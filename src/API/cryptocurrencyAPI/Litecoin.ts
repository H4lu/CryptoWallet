import {TransactionBuilder, networks} from 'bitcoinjs-lib'
import axios from 'axios'
import {
    transactionBytes,
    getTestnetAddressBTC, 
    uintOrNaN,
    sumOfArray, 
    sumOrNaN,
    inputBytes,
    dustThreshold,
    finalize
} from './utils'
import {getAddressPCSC} from '../hardwareAPI/GetAddress'
import {getSignaturePCSC} from '../hardwareAPI/GetSignature'
import * as satoshi from 'satoshi-bitcoin'
import {info} from 'electron-log'
import {Buffer} from 'buffer'
import * as ffi from 'ffi-napi'

enum Networks {
    MAIN = "LTC",
    TEST = "LTCTEST"
}

let myAddress = ''
let myPubKey = Buffer.alloc(64)
const rootURL = 'https://chain.so/api/v2'
const network = networks.litecoin

const NETWORK = Networks.MAIN

const libdll = ffi.Library('./resources/lib32.dll', {'forSign': ['void', ['string', 'int', 'string']]})


let balance: number
let price: number

export function setLTCBalance(bal: number) {
    balance = bal
}

export function setLTCPrice(priceToSet: number) {
    price = priceToSet
}
export default function getAddres() {
    return myAddress
}

export async function initLitecoinAddress() {
    return new Promise(async (resolve) => {
        let status = false
        while (!status) {
            let answer = await getAddressPCSC(2)
            info('GOT MYADDR ANSWER', answer)
            info('My addr length', answer.length)
            if (answer.length > 1 && answer[0].includes('LTC')) {
                status = true
                info('status after reset', status)
                setMyAddress(answer[0].substring(3, answer[0].length))
                console.log("address LTC: ", answer[0].substring(3, answer[0].length))
                setMyPubKey(answer[1])
               // setMyAddress(getTestnetAddressBTC(Buffer.from(answer[1])))
                resolve(0)
            }
        }
    })
}

function setMyAddress(address: string) {
    myAddress = address
    info('MY ADDRESS LITECOIN: ' + myAddress)
}

export function setMyPubKey(pubKey: Buffer) {
    myPubKey[0] = 0x02 + pubKey[64]%2

    for(let i = 0; i < 32; i++)
    {
        myPubKey[i+1] = pubKey[i+1]
    }
}

export function getLitecoinPubKey() {
    return myPubKey
}

export async function getLitecoinLastTx(): Promise<any> {
    try {
        const requestUrl = `${rootURL}/address/${NETWORK}/${myAddress}`
        let response = await axios.get(requestUrl)
        return response
    } catch (err) {
        info(err)
    }
}

export async function getLTCBalanceTrans(address: string): Promise<Array<Number | string>> {
    const requestUrl = `https://chain.so/api/v2/address/${NETWORK}/${address}`
    // Делаем запрос и отдаём в виде Promise
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.balance).toFixed(8)
    const transactions = Number(response.data.total_txs)
    return [balance, transactions]
}

export async function getLTCBalance(): Promise<Array<Number | String>> {
    const requestUrl = `https://api.blockcypher.com/v1/ltc/main/addrs/${myAddress}/balance`
    // Делаем запрос и отдаём в виде Promise
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.final_balance)
    return ["LTC", Number((balance/100000000).toFixed(8))] 
}

function toSatoshi(BTC: number): number {
    return satoshi.toSatoshi(BTC)
}

async function getLastTransactionData(): Promise<any> {
    const requestUrl = `https://chain.so/api/v2/get_tx_unspent/${NETWORK}/${myAddress}`
    try {
        const response = await axios.get(requestUrl)
        info('Raw response: ' + response)
        info('Response of last tx: ' + JSON.parse(response.data).data.txs)
        return response.data
    } catch (error) {
        Promise.reject(error).catch(error => {
            info(error)
        })
    }
}

async function createTransaction(paymentAdress: string,
                                 transactionAmount: number, transactionFee: number, redirect: any, utxos: Array<any>, course: number, balance: number) {
    let targets = {
        address: paymentAdress,
        value: transactionAmount
    }
    let {inputs, outputs, fee} = coinSelect(utxos, targets, 23 * transactionFee)

    console.log('FEE_coinSelect: ', fee)
    let transaction = new TransactionBuilder(network)
    for (let input in inputs) {
        transaction.addInput(inputs[input].txid, inputs[input].output_no)
    }
    for (let out in outputs) {
        if (!outputs[out].address) {
            outputs[out].address = myAddress
        }
        transaction.addOutput(outputs[out].address, outputs[out].value)
    }
    let unbuildedTx = transaction.buildIncomplete().toHex()
    transaction.inputs.map(value => {
        info('MAPPED INPUT: ' + value)
    })
    transaction.tx.ins.forEach((value: any) => {
        info('PROBABLY TX INPUT: ' + JSON.stringify(value))
    })

    let hashArray: Array<Buffer> = []

    let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + Object(utxos[0]).script_hex + 'ff', unbuildedTx.indexOf('00000000ff', 0), unbuildedTx.indexOf('00000000ff', 0) + 50)
    console.log('DATA FOR HASH: ', dataForHash)


    /************ lib dll *****************/
    let dataIn = Buffer.from(dataForHash, 'hex')
    let lenData = dataIn.length
    let numInputs = transaction.inputs.length
    let num64 = Math.floor(lenData / 64) - 1
    let lenEnd = lenData - num64 * 64
    let lenMess = 32 + lenEnd

    let dataOut = Buffer.alloc(numInputs * lenMess)
    libdll.forSign(dataIn, lenData, dataOut)
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

    let data = await getSignaturePCSC(2, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.inputs.length, course, fee / 100000000, balance)
    if (data[0].length !== 1) {
        transaction.inputs.forEach((input, index) => {

            unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')

        })
        sendTransaction(unbuildedTx, redirect)
        transaction.addOutput(paymentAdress, transactionAmount)
    }
}

function ReplaceAt(input: any, search: any, replace: any, start: any, end: any) {
    info('FIRST SLICE:' + input.slice(0, start))
    info('SECOND SLICE ' + input.slice(start, end).replace(search, replace))
    info('THIRD SLICE: ' + input.slice(end))
    return input.slice(0, start)
        + input.slice(start, end).replace(search, replace)
        + input.slice(end)
}

async function sendTransaction(transactionHex: string, redirect: any): Promise<void> {
    await axios.post(
        'https://api.blockcypher.com/v1/ltc/main/txs/push',
        {'tx': transactionHex},
        {headers: {'content-type': 'application/json'}}
        )
    redirect()    
}

export function handleLitecoin(paymentAdress: string, amount: number, transactionFee: number, redirect: any, course: number, balance: number) {

    getLastTransactionData().then(Response => {
        let respData = JSON.parse(Response.content)
        info('RespData: ' + respData.data)
        info('Resp status: ' + respData.status)
        if (respData.status === 'success') {
            info('In success')
            let utxos = []
            for (let utxo in respData.data.txs) {
                let temp = respData.data.txs[utxo].value
                respData.data.txs[utxo].value = toSatoshi(temp)
                info('My value: ' + respData.data.txs[utxo].value)
                utxos.push(respData.data.txs[utxo])
                info('Utxo: ' + utxo)
                info('Utxos: ' + utxos)
            }
            amount = toSatoshi(amount)
            createTransaction(paymentAdress, amount, transactionFee, redirect, utxos, course, balance).catch(err => {
                info(err)
            })
        } else {
            alert('Error provided by internet connection')
        }
    }).catch((error: any) => {
        info(error)
    })
}

function accumulative(utxos: any, outputs: any, feeRate: any) {
    if (!isFinite(uintOrNaN(feeRate))) return {}
    let bytesAccum = transactionBytes([], outputs)

    let inAccum = 0
    let inputs = []
    let outAccum = sumOrNaN(outputs)

    for (let i = 0; i < utxos.length; ++i) {
        let utxo = utxos[i]
        let utxoBytes = inputBytes(utxo)
        let utxoFee = feeRate * utxoBytes
        let utxoValue = uintOrNaN(Number(utxo.value))

        // skip detrimental input
        if (utxoFee > utxo.value) {
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

function blackjack(utxos: any, outputs: any, feeRate: any) {
    if (!isFinite(uintOrNaN(feeRate))) return {}

    let bytesAccum = transactionBytes([], outputs)

    let inAccum = 0
    let inputs = []
    let outAccum = sumOrNaN(outputs)
    let threshold = dustThreshold({}, feeRate)

    for (let i = 0; i < utxos.length; ++i) {
        let input = utxos[i]
        let inputInBytes = inputBytes(input)
        let fee = feeRate * (bytesAccum + inputInBytes)
        let inputValue = uintOrNaN(Number(input.value))

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

function coinSelect(utxos: any, outputs: any, feeRate: any) {

    // attempt to use the blackjack strategy first (no change output)
    let base = blackjack(utxos, outputs, feeRate)
    if (Object(base).inputs) return base

    // else, try the accumulative strategy
    return Object(accumulative(utxos, outputs, feeRate))
}
