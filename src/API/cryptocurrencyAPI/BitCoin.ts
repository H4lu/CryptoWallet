import {TransactionBuilder, networks, Transaction, ECPair, address, script} from 'bitcoinjs-lib'
import axios from 'axios'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
import {getAddressPCSC} from '../hardwareApi/getAddress'
import {remote} from "electron"

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
    ChainSoUnspentTransaction
} from './utils'

// @ts-ignore
import * as satoshi from 'satoshi-bitcoin'
import {Buffer} from "buffer";
import ffi from 'ffi-napi'
import { coinSelect } from './coinSelect'

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
    MAIN = "BTC",
    TEST = "BTCTEST",
    BLOCKCYPHER_MAIN = "main",
    BLOCKCYPHER_TEST = "test3"
}


const network = networks.bitcoin
const NETWORK: Networks = Networks.MAIN
const BLOCKCYPHER_NETWORK = Networks.BLOCKCYPHER_MAIN
const rootURL = 'https://chain.so/api/v2'

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

export async function getBitcoinLastTx(): Promise<Array<DisplayTransaction>> {
    const requestUrl = `${rootURL}/address/${NETWORK}/${myAddr}`
    const response = await axios.get(requestUrl)
    return parseBTCLikeTransactions(response.data, "BTC")
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
    const requestUrl = `https://api.blockcypher.com/v1/btc/${BLOCKCYPHER_NETWORK}/addrs/${myAddr}/balance`
    const response = await axios.get(requestUrl)
    return Number((response.data.balance / 100000000).toFixed(8))
}

export async function getChartBTC(end: string, start: string): Promise<Array<any>> {
    const requestUrl = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`
    console.log(requestUrl)
    // Делаем запрос и отдаём в виде Promise
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

export async function getBTCBalanceTarns(address: string): Promise<Array<any>> {
    /* Задаём параметры запроса
      Network - тип сети, testnet или mainnet
      myAddr - наш адрес
      0 - количество подтверждений транзакций
    */
    // rootURL + 'get_address_balance/' + myAddr
    const requestUrl = `https://blockchain.com/rawaddr/${address}`
        
    // Делаем запрос и отдаём в виде Promise
    const response = await axios.get(requestUrl)
    const balance = Number(response.data.final_balance) / 100000000
    const transactions = Number(response.data.n_tx)
    return [Number(balance.toFixed(8)), transactions]
}

function toSatoshi(BTC: number): number {
    return satoshi.toSatoshi(BTC)
}

async function getLastTransactionData(): Promise<ChainSoUnspentTransactions> {
    const requestUrl = `https://chain.so/api/v2/get_tx_unspent/${NETWORK}/${myAddr}`   
    console.log(requestUrl)
    const response = await axios.get(requestUrl)
    return response.data
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
    redirect: () => void, 
    utxos: Array<ChainSoUnspentTransaction>, 
    course: number, 
    balance: number
    ) {
        let targets = {
            address: paymentAdress,
            value: transactionAmount
        }
        let feeRate = getFee(transactionFee)
    
        let {inputs, outputs, fee} = coinSelect(utxos, targets, feeRate)
    
        console.log('FEE_coinSelect: ', fee)
        let transaction = new TransactionBuilder(network)
        for (let input in inputs) {
            transaction.addInput(inputs[input].txid, inputs[input].output_no)
        }
        for (let out in outputs) {
            if (!outputs[out].address) {
                outputs[out].address = myAddr
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
    
        let data = await getSignaturePCSC(0, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.inputs.length, course, fee / 100000000, balance)
        console.log("data after pcsc")
        console.log(data)
        if (data[0] == undefined) {
            throw new Error("Error from hw wallet")
        }
        if (data[0].length !== 1) {
            transaction.inputs.forEach((input, index) => {
                unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')
            })
            return sendTransaction(unbuildedTx, redirect)
            //transaction.addOutput(paymentAdress, transactionAmount)
        }
}

async function sendTransaction(
    transactionHex: string,
    redirect: () => void
    ): Promise<void> {
        console.log("tx hex")
        console.log(transactionHex)
        await axios.post(
            `https://api.blockcypher.com/v1/btc/${BLOCKCYPHER_NETWORK}/txs/push`,
            {'tx': transactionHex},
            {'headers': {'content-type': 'application/json'}}
            )
        return redirect()
}

export async function handleBitcoin(
    paymentAdress: string,
    amount: number, 
    transactionFee: number,
    redirect: () => void, 
    course: number, 
    balance: number
    ) {
        const lastTx = await getLastTransactionData()
        if (lastTx.status == "success") {
            const utxos = lastTx.data.txs
                .map(tx => {
                    tx.value = toSatoshi(parseFloat(tx.value)).toString()
                    return tx
                })
            amount = toSatoshi(amount)
            return createTransaction(
                paymentAdress, amount, transactionFee, redirect, utxos, course, balance
                )
        } else {
            remote.dialog.showErrorBox("Error", 'Error provided by internet connection')
        }
    }

