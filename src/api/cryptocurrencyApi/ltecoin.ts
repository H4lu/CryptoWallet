import {TransactionBuilder, networks} from 'bitcoinjs-lib'
import axios from 'axios'
import {parseBTCLikeTransactions, DisplayTransaction} from "./utils"
import {getAddressPCSC} from '../hardwareApi/getAddress'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
// @ts-ignore
import * as satoshi from 'satoshi-bitcoin'
import {Buffer} from 'buffer'
import ffi from "ffi-napi"
import { coinSelect } from './coinSelect'

enum Networks {
    MAIN = "LTC",
    TEST = "LTCTEST"
}

let myAddress = ''
let myPubKey = Buffer.alloc(64)
let balance: number
let price: number

const rootURL = 'https://chain.so/api/v2'
const network = networks.litecoin

const NETWORK = Networks.MAIN

const libdll = ffi.Library('./resources/lib32.dll', {'forSign': ['void', ['string', 'int', 'string']]})

export function setLTCBalance(bal: number) {
    balance = bal
}

export function setLTCPrice(priceToSet: number) {
    price = priceToSet
}
export function getLitecoinAddress() {
    return myAddress
}

export async function initLitecoinAddress() {
    return new Promise(async (resolve) => {
        let status = false
        while (!status) {
            let answer = await getAddressPCSC(2)
            console.log('GOT MYADDR ANSWER', answer)
            console.log('My addr length', answer.length)
            if (answer.length > 1 && answer[0].includes('LTC')) {
                status = true
                console.log('status after reset', status)
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
    console.log('MY ADDRESS LITECOIN: ' + myAddress)
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

export async function getLitecoinLastTx(): Promise<Array<DisplayTransaction>> {
    const requestUrl = `${rootURL}/address/${NETWORK}/${myAddress}`
    const response = await axios.get(requestUrl)
    return parseBTCLikeTransactions(response.data, "LTC")
}

export async function getLTCBalanceTrans(address: string): Promise<Array<Number | string>> {
    const requestUrl = `https://chain.so/api/v2/address/${NETWORK}/${address}`
    // Делаем запрос и отдаём в виде Promise
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.balance).toFixed(8)
    const transactions = Number(response.data.total_txs)
    return [balance, transactions]
}

export async function getLTCBalance(): Promise<number> {
    const requestUrl = `https://api.blockcypher.com/v1/ltc/main/addrs/${myAddress}/balance`
    const response = await axios.get(requestUrl)
    return Number((response.data.balance / 100000000).toFixed(8))
}

function toSatoshi(BTC: number): number {
    return satoshi.toSatoshi(BTC)
}

async function getLastTransactionData(): Promise<any> {
    const requestUrl = `https://chain.so/api/v2/get_tx_unspent/${NETWORK}/${myAddress}`
    const response = await axios.get(requestUrl)
    return response.data
}

async function createTransaction(
    paymentAdress: string,
    transactionAmount: number, 
    transactionFee: number, 
    utxos: Array<any>, 
    course: number, 
    balance: number
    ) {
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
            console.log('MAPPED INPUT: ' + value)
        })
        transaction.tx.ins.forEach((value: any) => {
            console.log('PROBABLY TX INPUT: ' + JSON.stringify(value))
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
    
        let data = await getSignaturePCSC(2, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.inputs.length, course, fee / 100000000, balance)
        if (data[0].length !== 1) {
            transaction.inputs.forEach((input, index) => {
    
                unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')
    
            })
            return sendTransaction(unbuildedTx)
        }
}

function ReplaceAt(input: any, search: any, replace: any, start: any, end: any) {
    console.log('FIRST SLICE:' + input.slice(0, start))
    console.log('SECOND SLICE ' + input.slice(start, end).replace(search, replace))
    console.log('THIRD SLICE: ' + input.slice(end))
    return input.slice(0, start)
        + input.slice(start, end).replace(search, replace)
        + input.slice(end)
}

async function sendTransaction(transactionHex: string): Promise<void> {
    await axios.post(
        'https://api.blockcypher.com/v1/ltc/main/txs/push',
        {'tx': transactionHex},
        {headers: {'content-type': 'application/json'}}
        ) 
}

export async function handleLitecoin(
    paymentAdress: string, 
    amount: number, 
    transactionFee: number,
    course: number, 
    balance: number
    ) {
        const lastTx = await getLastTransactionData()
        
        if (lastTx.status === 'success') {
            const utxos = []
            for (let utxo in lastTx.data.txs) {
                let temp = lastTx.data.txs[utxo].value
                lastTx.data.txs[utxo].value = toSatoshi(temp)
                utxos.push(lastTx.data.txs[utxo])
            }
            amount = toSatoshi(amount)
            return createTransaction(paymentAdress, amount, transactionFee, utxos, course, balance).catch(err => {
                console.log(err)
            })
        } else {
            throw new Error("Error provided by the internet connection")
        }
   
}
