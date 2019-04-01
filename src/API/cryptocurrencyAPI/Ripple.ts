import {TransactionBuilder, networks, Transaction, ECPair, address, script} from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import { getSignaturePCSC } from '../hardwareAPI/GetSignature'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
import * as utils from './utils'
import * as crypto from 'crypto'
import * as satoshi from 'satoshi-bitcoin'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.bitcoin
const NETWORK = 'BTC'                                          // change XRP
const rootURL = 'https://chain.so/api/v2'
let myAddr = ''
let myPubKey = new Buffer(33)
let balance: number
let price: number
import { info } from 'electron-log'
import number = script.number;
import {types} from "util";
import {Buffer} from "buffer";

export function setXRPBalance(bal: number) {
    balance = bal
}
export function getXRPalance() {
    return balance
}
export function setXRPPrice(priceToSet: number) {
    price = priceToSet
}
export function getXRPPrice() {
    return price
}


export async function initRippleAddress() {
    info('INITING XRP ADDRESS')

    return new Promise(async (resolve) => {
        let status = false
        while (!status) {
            info('Status', status)
            let answer = await getAddressPCSC(0)                                // change 3
            if (answer[0].length > 16 && answer[0].includes('BTC')) {   //change XRP
                status = true
                info('MY ADDRESS XRP: ' + myAddr)
                setMyAddress(answer[0].substring(3,answer[0].length))
                setMyPubKey(answer[1])
                resolve(0)
            }
        }

    })
}
export function setMyAddress(address: string) {
    myAddr = address
    info('MY ADDRESS RIPPLE:' + myAddr)
}
export function setMyPubKey(pubKey: Buffer) {

    myPubKey[0] = 0x02 + pubKey[64]%2

    for(let i = 0; i < 32; i++)
    {
        myPubKey[i+1] = pubKey[i+1]
    }
    info('MY PUBKEY RIPPLE FULL:', pubKey.toString('hex'))
    info('MY PUBKEY RIPPLE     :', myPubKey.toString('hex'))
}

export default function getRippleAddress() {
    return myAddr
}
export function getRipplePubKey() {
    return myPubKey
}


export async function getRippleLastTx(): Promise<any> {
    info('CALLING XRP')
   /* try {
        const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddr
        info('My req url: ' + requestUrl)
        let response = await webRequest.get(requestUrl)
        return response
    } catch (err) {
        info(err)
    }*/
}

function parseValueCrypto(response: webRequest.Response<string>): Array<Number | String> {
    let parsedResponse = JSON.parse(response.content).data
    let balance: Number = Number(parsedResponse.confirmed_balance) + Number(parsedResponse.unconfirmed_balance)
    let arr = []
    arr.push('XRP')
    arr.push(Number(balance.toFixed(8)))
    return arr
}

export async function getXRPBalance(): Promise<Array<Number | String>> {
    /* Задаём параметры запроса
      Network - тип сети, testnet или mainnet
      address - наш адрес
      0 - количество подтверждений транзакций
    */
  /*  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 0
    info(requestUrl)
    try {
        // Делаем запрос и отдаём в виде Promise
        const response = await webRequest.get(requestUrl)
        return parseValueCrypto(response)
    } catch (error) {
        Promise.reject(error).catch(error => {
            info(error)
        })
    }*/
    let arr = []
    arr.push('XRP')
    arr.push(0)
    return arr
}