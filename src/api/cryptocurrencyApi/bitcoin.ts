import {address, networks, TransactionBuilder} from 'bitcoinjs-lib'
import axios from 'axios'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
import {getAddressPCSC} from '../hardwareApi/getAddress'
import {
    BlockcypherFullTransactions,
    BlockcypherUnspentTransaction,
    BlockcypherUnspentTransactions,
    dustThreshold,
    finalize,
    inputBytes,
    sumOrNaN,
    toDisplayTransactions,
    transactionBytes,
    uintOrNaN
} from './utils'

// @ts-ignore
import * as satoshi from 'satoshi-bitcoin'
import {Buffer} from "buffer";
import ffi from 'ffi-napi'

type CoindeskChartBpiItem = {
    [key: string]: number
}

interface CoindeskChartResponse {
    bpi: CoindeskChartBpiItem,
    disclaimer: string,
    time: {
        updated: Date,
        updatedISO: Date
    }
}

enum Networks {
    MAIN = "main",
    TEST = "test3"
}

interface TransactionTarget {
    address: string,
    value: number
}

const network = networks.bitcoin
export const NETWORK: Networks = Networks.MAIN

let myAddr = ''
let myPubKey = Buffer.alloc(33)
let balance: number
let price: number
let basicFee1: number
let basicFee2: number
let basicFee3: number
let TXarr = []
let numTx: number


const libdll = ffi.Library('./resources/lib32.dll', {'forSign': ['void', ['string', 'int', 'string']]})

export const setBTCBalance = (bal: number) => {
    balance = bal
}

export const getBalance = () => {
    return balance
}

export const setBTCPrice = (priceToSet: number) => {
    price = priceToSet
}

export const initBitcoinAddress = async () => {
    let status = false
    while (!status) {
        const result = await getAddressPCSC(0)
        if (result[0].length > 16 && result[0].includes('BTC')) {
            status = true
            setMyAddress(result[0].substring(3, result[0].length))
            setMyPubKey(result[1])
            // if (NETWORK == Networks.TEST) {
            //     console.log("generate test address btc")
            //     setMyAddress(getTestnetAddressBTC(result[1]))
            // }
            await setFee()
        }
    }
}

export const setMyAddress = (address: string) => {
    myAddr = address
}

export const setMyPubKey = (pubKey: Buffer) => {
    myPubKey[0] = 0x02 + pubKey[64] % 2
    for (let i = 0; i < 32; i++) {
        myPubKey[i + 1] = pubKey[i + 1]
    }
}

export const getBitcoinAddress = (): string => {
    return myAddr
}

export const getBitcoinPubKey = () => {
    return myPubKey
}

const setFee = async () => {
    const requestUrl = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'
    const response = await axios.get(requestUrl)
    basicFee1 = Number(response.data.hourFee)
    basicFee2 = Number(response.data.halfHourFee)
    basicFee3 = Number(response.data.fastestFee)
}

export const getFee = (transactionFee: number): number => {
    let basicFee = 25
    switch (transactionFee) {
        case 1: {
            basicFee = basicFee1
            break
        }
        case 2: {
            basicFee = basicFee2
            break
        }
        case 3: {
            basicFee = basicFee3 + 5
            break
        }
    }
    return (basicFee)
}

export const getBTCBalance = async (): Promise<number> => {
    const requestUrl = `https://api.blockcypher.com/v1/btc/${NETWORK}/addrs/${myAddr}/balance`
    const response = await axios.get(requestUrl)
    return Number((response.data.balance / 100000000).toFixed(8))
}

export const getChartBTC = async (end: string, start: string): Promise<Array<any>> => {
    const requestUrl = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`
    const response = await axios.get(requestUrl)
    const chartData = response.data.bpi
    let key: keyof typeof chartData
    const arr = []
    for (key in chartData) {
        arr.push(chartData[key])
    }
    return arr
}

export const getBTCBalanceTarns = async (address: string): Promise<Array<any>> => {
    const requestUrl = `https://blockchain.com/rawaddr/${address}`
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.final_balance) / 100000000
    const transactions = Number(response.data.n_tx)
    return [Number(balance.toFixed(8)), transactions]
}

const toSatoshi = (BTC: number): number => {
    return satoshi.toSatoshi(BTC)
}

const getUnspentTransactions = async (address: string) => {
    const params = {
        "limit": 2000, // TODO: handle pagination
        "includeScript": true,
        "unspentOnly": true
    }
    const requestUrl = `https://api.blockcypher.com/v1/btc/${NETWORK}/addrs/${address}`
    const response = await axios.get<BlockcypherUnspentTransactions>(requestUrl, {params})
    return response.data
}

export async function getBitcoinLastTx() {
    const params = {
        "limit": 50
    }
    const requestUrl = `https://api.blockcypher.com/v1/btc/${NETWORK}/addrs/${myAddr}/full`
    const response = await axios.get<BlockcypherFullTransactions>(requestUrl, {params})
    return toDisplayTransactions(response.data)
}


function ReplaceAt(
    input: string,
    search: string,
    replace: string,
    start: number,
    end: number
) {
    return input.slice(0, start)
        + input.slice(start, end).replace(search, replace)
        + input.slice(end)
}

async function createTransaction(
    paymentAdress: string,
    transactionAmount: number,
    transactionFee: number,
    utxos: Array<BlockcypherUnspentTransaction>,
    course: number,
    balance: number
) {
    let targets = {
        address: paymentAdress,
        value: transactionAmount
    }
    let feeRate = getFee(transactionFee)

    let {inputs, outputs, fee} = coinSelect(utxos, targets, 25)

    let transaction = new TransactionBuilder(network)
    for (const input of inputs) {
        transaction.addInput(input.tx_hash, input.tx_output_n)
    }
    for (const out of outputs) {
        if (!out.address) {
            out.address = myAddr
        }
        transaction.addOutput(out.address, out.value)
    }
    let unbuildedTx = transaction.buildIncomplete().toHex()
    let hashArray: Array<Buffer> = []
    let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + utxos[0].script + 'ff', unbuildedTx.indexOf('00000000ff', 0), unbuildedTx.indexOf('00000000ff', 0) + 50)


    /************ lib dll *****************/
    let dataIn = Buffer.from(dataForHash, 'hex')
    let lenData = dataIn.length
    let numInputs = transaction.inputs.length
    let num64 = Math.floor(lenData / 64) - 1
    let lenEnd = lenData - num64 * 64
    let lenMess = 32 + lenEnd

    let dataOut = Buffer.alloc(numInputs * lenMess)
    libdll.forSign(dataIn as any, lenData, dataOut)

    for (let j = 0; j < numInputs; j++) {
        let arr = new Array(lenMess)
        for (let i = 0; i < lenMess; i++) {
            arr[i] = dataOut[j * lenMess + i]
        }
        let LL = 2 + lenMess
        let hh1 = num64 * 64 % 256
        let hh2 = (num64 * 64 - hh1) / 256
        let for41 = Buffer.concat([Buffer.from([LL]), Buffer.from([hh2]), Buffer.from([hh1]), Buffer.from(arr)])
        console.log('for41 ', for41.toString('hex'))

        hashArray.push(for41)
    }
    /************ lib dll ******************/

    let data = await getSignaturePCSC(0, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.inputs.length, course, fee / 100000000, balance)
    if (data[0] == undefined) {
        return
    }
    if (data[0]?.length !== 1) {
        transaction.inputs.forEach((input, index) => {
            unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')
        })
        return sendTransaction(unbuildedTx)
    }
}

async function sendTransaction(transactionHex: string): Promise<void> {
    await axios.post(
        `https://api.blockcypher.com/v1/btc/${NETWORK}/txs/push`,
        {'tx': transactionHex},
        {'headers': {'content-type': 'application/json'}}
    )
}

export async function handleBitcoin(
    paymentAdress: string,
    amount: number,
    transactionFee: number,
    course: number,
    balance: number
) {
    // validate address
    try {
        address.toOutputScript(paymentAdress)
    } catch (err) {
        console.log(err.meessage)
        throw Error("Invalid address")
    }
    const lastTx = await getUnspentTransactions(myAddr)
    const utxos = lastTx.txrefs
    amount = toSatoshi(amount)
    return createTransaction(
        paymentAdress, amount, transactionFee, utxos, course, balance
    )
}

function accumulative(
    utxos: Array<BlockcypherUnspentTransaction>,
    outputs: any,
    feeRate: number
) {
    if (!isFinite(uintOrNaN(feeRate))) return {}
    let bytesAccum = transactionBytes([], outputs)

    let inAccum = 0
    let inputs = []
    let outAccum = sumOrNaN(outputs)

    for (let i = 0; i < utxos.length; ++i) {
        let utxo = utxos[i]
        let utxoBytes = inputBytes(utxo)
        let utxoFee = feeRate * utxoBytes
        let utxoValue = uintOrNaN(utxo.value)
        // skip detrimental input
        if (utxoFee > uintOrNaN(utxo.value)) {
            if (i === utxos.length - 1) return {fee: feeRate * (bytesAccum + utxoBytes)}
            continue
        }

        bytesAccum += utxoBytes
        inAccum += utxoValue
        inputs.push(utxo)

        let fee = feeRate * bytesAccum

        // go again?
        if (inAccum < outAccum + fee) continue

        return finalize(inputs, outputs, feeRate)
    }

    return {fee: feeRate * bytesAccum}
}

function blackjack(
    utxos: Array<BlockcypherUnspentTransaction>,
    outputs: any,
    feeRate: number
) {
    if (!isFinite(uintOrNaN(feeRate))) return {}

    let bytesAccum = transactionBytes([], outputs)
    let inAccum = 0
    let inputs = []
    let outAccum = sumOrNaN(outputs)
    let threshold = dustThreshold({}, feeRate)

    for (let i = 0; i < utxos.length; ++i) {
        let input = utxos[i]
        let inputInBytes = inputBytes(input)
        console.log(`input in bytes ${inputInBytes}`)
        let fee = feeRate * (bytesAccum + inputInBytes)
        console.log(`blackjack fee ${fee}`)
        let inputValue = uintOrNaN(input.value)

        // would it waste value?
        if ((inAccum + inputValue) > (outAccum + fee + threshold)) continue

        bytesAccum += inputInBytes
        inAccum += inputValue
        inputs.push(input)

        // go again?
        if (inAccum < outAccum + fee) continue

        return finalize(inputs, outputs, feeRate)
    }

    return {fee: feeRate * bytesAccum}
}


export function coinSelect(
    utxos: Array<BlockcypherUnspentTransaction>,
    outputs: any,
    feeRate: number
) {
    // attempt to use the blackjack strategy first (no change output)
    let base = blackjack(utxos, outputs, feeRate)
    if (Object(base).inputs) return base

    // else, try the accumulative strategy
    return Object(accumulative(utxos, outputs, feeRate))
}
    