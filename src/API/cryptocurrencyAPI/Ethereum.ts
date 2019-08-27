import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import {getSignaturePCSC} from '../hardwareAPI/GetSignature'

import * as webRequest from 'web-request'
import {getAddressPCSC} from '../hardwareAPI/GetAddress'
import {info} from 'electron-log'
import {Buffer} from 'buffer'
import {keccak256} from "js-sha3";

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/960cbfb44af74f27ad0e4b070839158a'))

let myAdress = ''
let myPubKey = new Buffer(64)
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

export async function getEthereumLastTx(): Promise<any> {
    try {
        const requestURL = 'https://api.ethplorer.io/getAddressTransactions/' + myAdress + '?apiKey=freekey&limit=50'
        let response = await webRequest.get(requestURL)
        return response
    } catch (err) {
        info(err)
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

export async function getETHBalance() {
    web3.eth.getGasPrice().then(value => info(value)).catch(err => info(err))
    let resp = await web3.eth.getBalance(myAdress)
    info('ETH balance: ' + resp)
    return parseValueCrypto(Number(resp))
}

function parseValueCrypto(amount: number): Array<Number | String> {
    let ethValue = convertFromWei(amount)
    let arr = []
    arr.push('ETH')
    arr.push(Number(Number(ethValue).toFixed(8)))
    let answer = 'ETH' + ethValue.toString()
    info('RETURNING ETH BALANCE', answer)
    return arr
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
        for (let item in rawtx) {
            console.log('item : ', Object(rawtx)[item])
        }
        let tx = new Transaction(rawtx)
        console.log('Unsigned: ', tx.serialize().toString('hex'))
        let txHash = keccak256(tx.serialize())
        console.log('Tx hash: ', txHash.toString())
        let hash = Buffer.concat([Buffer.from([0x20]),Buffer.from(txHash, 'hex')])
        let hashArray: Array<Buffer> = []
        hashArray.push(hash)
        let fee = (49103*gasPrice)/100000000
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