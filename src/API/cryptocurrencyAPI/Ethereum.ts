import Web3 from 'web3'
import {Transaction} from '@ethereumjs/tx'
import {getSignaturePCSC} from '../hardwareAPI/GetSignature'
import axios from 'axios'

import {getAddressPCSC} from '../hardwareAPI/GetAddress'
import {info} from 'electron-log'
import {Buffer} from 'buffer'
import {keccak256} from "js-sha3";
import { DisplayTransaction, DisplayTransactionCurrency, DisplayTransactionStatus, DisplayTransactionType } from './utils'

interface EthplorerTransaction {
    timestamp: number,
    from: string,
    to: string,
    hash: string,
    value: number,
    input: string,
    success: boolean
}

enum Networks {
    MAIN = "mainnet",
    TEST = "ropsten"
}
const NETWORK = Networks.TEST

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/960cbfb44af74f27ad0e4b070839158a`))

let myAdress = ''
let myPubKey = Buffer.alloc(64)
let balance: number
let price: number

export function setETHBalance(bal: number) {
    balance = bal
}

export function setETHPrice(priceToSet: number) {
    price = priceToSet
}

export async function initEthereumAddress() {
    return new Promise(async (resolve) => {
        let status = false
        while (!status) {
            info('Status', status)
            let answer = await getAddressPCSC(1)
            info('GOT MYADDR ANSWER', answer)
            if (answer.length > 1 && answer[0].includes('ETH')) {
                status = true
                info('status after reset', status)
                setMyPubKey(answer[1])
                resolve(0)
            }
        }
    })
}

export function setMyPubKey(pubKey: Buffer) {
    for (let i = 0; i < 64; i++) {
        myPubKey[i] = pubKey[i + 1]
    }
    console.log('PUB_KEY_ETHEREUM', myPubKey.toString('hex'))
    let address = '0x' + keccak256(myPubKey).substr(24, 40).toLowerCase()
    console.log('PUB_KEY_ETHEREUM', address)
    setAddress(address)
}

export function getEthereumPubKey() {
    return myPubKey
}

function setAddress(address: string) {
    myAdress = web3.utils.toChecksumAddress(address)
}

export function getEthereumAddress() {
    return myAdress
}

export async function getEthereumLastTx(): Promise<Array<DisplayTransaction>> {
    const requestURL = `https://api.ethplorer.io/getAddressTransactions/${myAdress}?apiKey=freekey&limit=50`
    const response = await axios.get(requestURL)
    return (response.data as Array<EthplorerTransaction>)
        .map(tx => ethplorerToDisplayTransaction(tx))
}

function ethplorerToDisplayTransaction(tx: EthplorerTransaction): DisplayTransaction {
    const date = new Date(tx.timestamp * 1000)
    const dateUnix = date.getTime()
    const displayDate = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
    const amount = tx.value.toString()
    const hash = tx.hash
    const type = tx.from === myAdress.toLowerCase() ? 
        DisplayTransactionType.OUTGOING : DisplayTransactionType.INCOMING
    const status = tx.success ?
        DisplayTransactionStatus.ACTIVE : DisplayTransactionStatus.FINISHED    
    const address = type === DisplayTransactionType.OUTGOING ? tx.to : tx.from
    const currency: DisplayTransactionCurrency = "ETH"
    return {
        dateUnix, displayDate, currency, amount, address, status, type, hash
    }
}

export async function getETHBalanceTrans(address: string): Promise<Array<any>> {
    let respB = await web3.eth.getBalance(address)

    let ethValue = convertFromWei(Number(respB))
    console.log('1', ethValue)
    let arr = []
    arr.push(Number(Number(ethValue).toFixed(8)))

    let respT = await web3.eth.getTransactionCount(address)

    arr.push(Number(respT))
    console.log('2', respT)
    return arr
}

export async function getETHBalance(): Promise<number> {
    const response = await web3.eth.getBalance(myAdress)
    const ethValue = convertFromWei(Number(response))
    return Number(Number(ethValue).toFixed(8)) 
}

export function convertFromWei(amount: number) {
    return web3.utils.fromWei(String(amount), 'ether')
}

function createTransaction(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any, course: number, balance: number) {
    info(redirect)
    web3.eth.getTransactionCount(myAdress).then(async (value) => {
        // Получаем порядковый номер транзакции, т.н nonce

        let gas = (8 * gasPrice).toString()
        let rawtx = {
            value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
            nonce: web3.utils.toHex(value),
            from: myAdress,
            to: paymentAdress,
            gasPrice: web3.utils.toHex(web3.utils.toWei(gas, 'shannon')),
            gasLimit: web3.utils.toHex(31000),
            chainId: web3.utils.toHex(1),
            data: '0x00',
            v: web3.utils.toHex(1),
            r: 0,
            s: 0
        }
    
        let tx = new Transaction(rawtx)
        console.log('Unsigned: ', tx.serialize().toString('hex'))
        let txHash = keccak256(tx.serialize())
        console.log('Tx hash: ', txHash.toString())
        let hash = Buffer.concat([Buffer.from([0x20]),Buffer.from(txHash, 'hex')])
        let hashArray: Array<Buffer> = []
        hashArray.push(hash)
        let fee = (49103 * gasPrice) / 100000000
        let data = await getSignaturePCSC(1, hashArray, paymentAdress, amount, 1, course, fee, balance)
        if (data[0].length !== 1) {
            console.log('sign', data[0].toString('hex'))

            let sig = {
                value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
                nonce: web3.utils.toHex(value),
                from: myAdress,
                to: paymentAdress,
                gasPrice: web3.utils.toHex(web3.utils.toWei(gas, 'shannon')),
                gasLimit: web3.utils.toHex(31000),
                chainId: web3.utils.toHex(1),
                data: '0x00',
                v: web3.utils.toHex(Number(data[0][64]) + 10),
                r: '0x' + (data[0].slice(0, 32)).toString('hex'),
                s: '0x' + (data[0].slice(32, 64)).toString('hex')
            }

            for (let item in sig) {
                console.log('item sign: ', Object(sig)[item])
            }
            let sigTx = new Transaction(sig)
            let serTx = '0x' + sigTx.serialize().toString('hex')

            web3.eth.sendSignedTransaction(serTx).on('receipt', info).on('transactionHash', function (hash) {
                info('Transaction sended: ' + hash)
                // redirect()
            }).on('error', console.error).catch(err => info(err))
        }

    }).catch(err => info(err))

}

export function handleEthereum(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any, course: number, balance: number) {
    createTransaction(paymentAdress, amount, gasPrice, gasLimit, redirect, course, balance)
}