import {TransactionBuilder, networks, Transaction, ECPair, address, script} from 'bitcoinjs-lib'
import axios from 'axios'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
import {getAddressPCSC} from '../hardwareApi/getAddress'

import  {
    transactionBytes,
    getTestnetAddressBTC, 
    uintOrNaN,
    sumOfArray, 
    sumOrNaN,
    inputBytes,
    dustThreshold,
    finalize,
    DisplayTransaction,
    parseBTCLikeTransactions,
    BtcLikeCurrencies,
    ChainSoTransaction,
    ChainSoUnspentTransactions,
    ChainSoUnspentTransaction,
    BlockcypherUnspentTransactions,
    BlockcypherUnspentTransaction,
    BlockcypherFullTransactions,
    toDisplayTransactions
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

export function setBTCBalance(bal: number) {
    balance = bal
}

export function getBalance() {
    return balance
}

export function setBTCPrice(priceToSet: number) {
    price = priceToSet
}

export async function initBitcoinAddress() {
    return new Promise(async resolve => {
        let status = false
        while (!status) {
            const answer = await getAddressPCSC(0)
            if (answer[0].length > 16 && answer[0].includes('BTC')) {
                status = true
                setMyAddress(answer[0].substring(3, answer[0].length))
                setMyPubKey(answer[1])
                if (NETWORK == Networks.TEST) {
                    console.log("generate test address btc")
                    setMyAddress(getTestnetAddressBTC(Buffer.from(answer[1])))
                }
                setFee()
                resolve(0)
            }
        }
    })
}

export function setMyAddress(address: string) {
    myAddr = address
    console.log('MY ADDRESS BITCOIN:' + myAddr)
}

export function setMyPubKey(pubKey: Buffer) {

    myPubKey[0] = 0x02 + pubKey[64] % 2

    for (let i = 0; i < 32; i++) {
        myPubKey[i + 1] = pubKey[i + 1]
    }
}

export function getBitcoinAddress() {
    return myAddr
}

export function getBitcoinPubKey() {
    return myPubKey
}

async function setFee() {
    const requestUrl = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'
    const response = await axios.get(requestUrl)
    basicFee1 = Number(response.data.hourFee)
    basicFee2 = Number(response.data.halfHourFee)
    basicFee3 = Number(response.data.fastestFee)
}

export function getFee(transactionFee: number): number {
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

export async function getBTCBalance(): Promise<number> {
    const requestUrl = `https://api.blockcypher.com/v1/btc/${NETWORK}/addrs/${myAddr}/balance`
    const response = await axios.get(requestUrl)
    return Number((response.data.balance / 100000000).toFixed(8))
}

export async function getChartBTC(end: string, start: string): Promise<Array<any>> {
    const requestUrl = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`
    console.log(requestUrl)
    const response = await axios.get(requestUrl)
    const chartData = response.data.bpi
    let key: keyof typeof chartData
    const arr = []
    for (key in chartData) {
        arr.push(chartData[key])
    }
    console.log(arr)
    return arr
}

export async function getBTCBalanceTarns(address: string,): Promise<Array<any>> {
    const requestUrl = `https://blockchain.com/rawaddr/${address}`
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.final_balance) / 100000000
    const transactions = Number(response.data.n_tx)
    return [Number(balance.toFixed(8)), transactions]
}

function toSatoshi(BTC: number): number {
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
    console.log(response)
    return response.data
}

export async function getBitcoinLastTx() {
    const params = {
        "limit": 50
    }
    const requestUrl = `https://api.blockcypher.com/v1/btc/${NETWORK}/addrs/${myAddr}/full`  
    const response = await axios.get<BlockcypherFullTransactions>(requestUrl, {params})
    console.log(response)
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
            console.log("add input")
            console.log(input)
            transaction.addInput(input.tx_hash, input.tx_output_n)
        }
        for (const out of outputs) {
            console.log("add output")
            if (!out.address) {
                out.address = myAddr
            }
            transaction.addOutput(out.address, out.value)
        }
        let unbuildedTx = transaction.buildIncomplete().toHex()
        transaction.inputs.map(value => {
            console.log('MAPPED INPUT')
            console.log(value)
        })
        transaction.tx.ins.forEach(value => {
            console.log('PROBABLY TX INPUT: ')
            console.log(value)
        })
    
        let hashArray: Array<Buffer> = []
        console.log(utxos)
        let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + utxos[0].script + 'ff', unbuildedTx.indexOf('00000000ff', 0), unbuildedTx.indexOf('00000000ff', 0) + 50)
        console.log('DATA FOR HASH: ', dataForHash)
    
    
        /************ lib dll *****************/
        let dataIn = Buffer.from(dataForHash, 'hex')
        let lenData = dataIn.length
        let numInputs = transaction.inputs.length
        console.log("num inputs: %s", numInputs)
        let num64 = Math.floor(lenData / 64) - 1
        let lenEnd = lenData - num64 * 64
        let lenMess = 32 + lenEnd
    
        let dataOut = Buffer.alloc(numInputs * lenMess)
        libdll.forSign(dataIn as any, lenData, dataOut)
        console.log('OUT: ', dataOut.toString('hex'))

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
        console.log("data after pcsc")
        console.log(data)
        console.log(data.toString())
        if (data[0] == undefined) {
            throw new Error("Error from hw wallet")
        }
        if (data[0].length !== 1) {
            transaction.inputs.forEach((input, index) => {
                unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')
            })
            return sendTransaction(unbuildedTx)
            //transaction.addOutput(paymentAdress, transactionAmount)
        }
}

async function sendTransaction(transactionHex: string): Promise<void> {
        console.log("tx hex")
        console.log(transactionHex)
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
        console.log(`bytes accum ${bytesAccum}`)
    
        let inAccum = 0
        let inputs = []
        let outAccum = sumOrNaN(outputs)
    
        for (let i = 0; i < utxos.length; ++i) {
            let utxo = utxos[i]
            let utxoBytes = inputBytes(utxo)
            let utxoFee = feeRate * utxoBytes
            let utxoValue = uintOrNaN(utxo.value)
            console.log(`utxo fee ${utxoFee}`)
    
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
        console.log(`bytes accum ${bytesAccum}`)
    
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
        console.log(`fee rate ${feeRate}`)
       
        // attempt to use the blackjack strategy first (no change output)
        let base = blackjack(utxos, outputs, feeRate)
        if (Object(base).inputs) return base
    
        // else, try the accumulative strategy
        return Object(accumulative(utxos, outputs, feeRate))
    }
    