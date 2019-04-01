import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import {getSignaturePCSC, sig} from '../hardwareAPI/GetSignature'

import * as webRequest from 'web-request'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
import { info } from 'electron-log'
import {Buffer} from "buffer";

// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/hgAaKEDG9sIpNHqt8UYM'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/960cbfb44af74f27ad0e4b070839158a'))


let myAdress = ''
let myPubKey = new Buffer(64)
let tempEtherData = ''
let balance: number
let price: number
export function setETHBalance(bal: number) {
  balance = bal
}
export function getETBalance() {
  return balance
}
export function setETHPrice(priceToSet: number) {
  price = priceToSet
}
export function getETHPrice() {
  return price
}
export async function initEthereumAddress() {
  info('INITING ETH ADDRESS')

  return new Promise(async (resolve) => {
    let status = false
    while (!status) {
      info('Status', status)
      let answer = await getAddressPCSC(1)
      info('GOT MYADDR ANSWER', answer)
      if (answer.length > 1 && answer[0].includes('ETH')) {
        status = true
        info('status after reset', status)

            //костыль
          tempEtherData = web3.utils.soliditySha3(answer[0])
          let value = await web3.eth.accounts.privateKeyToAccount(tempEtherData)
          myAdress = value.address
          info("ether priv: ", tempEtherData)
          info("ether adr:" , myAdress)
            //конец костыля

/*
        setAddress(answer[0].substring(3,answer[0].length).toLowerCase())
        setMyPubKey(answer[1])*/
        resolve(0)
      }
    }
  })
}

export function setMyPubKey(pubKey: Buffer) {
    for(let i = 0; i < 64; i++)
    {
        myPubKey[i] = pubKey[i+1]
    }
    info('PUB_KEY_ETHEREUM', myPubKey.toString('hex'))
}

export function getEthereumPubKey() {
    return myPubKey
}

function setAddress(address: string) {
  myAdress = web3.utils.toChecksumAddress(address)
  info('ETH ADDRESS', myAdress)
}
export function getEthereumAddress() {
  return myAdress
}
export async function getEthereumLastTx(): Promise<any> {
  info('GETTING ETH')
  try {
    const requestURL = 'https://api.ethplorer.io/getAddressTransactions/' + myAdress + '?apiKey=freekey&limit=50'
    let response = await webRequest.get(requestURL)
    return response
  } catch (err) {
    info(err)
  }
}


export async function getETHBalance() {
  web3.eth.getGasPrice().then(value => info(value)).catch(err => info(err))
  let resp = await web3.eth.getBalance(myAdress)
  info('ETH balance: ' + resp)
  return parseValueCrypto(resp)
}

function parseValueCrypto(amount: number): Array<Number | String> {
  let ethValue = convertFromWei(amount)
  let arr = []
  arr.push('ETH')
  arr.push(Number(Number(ethValue).toFixed(8)))
  let answer = 'ETH' + ethValue.toString()
  info('RETURNING ETH BALANCE',answer)
  return arr
}

export function convertFromWei(amount: number) {
  return web3.utils.fromWei(amount, 'ether')
}

/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая отправляется
*/
function createTransaction (paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any, course: number, balance: number) {
    info(redirect)
    web3.eth.getTransactionCount(myAdress).then(async (value) => {
        // Получаем порядковый номер транзакции, т.н nonce
        info('Got this values: ' + 'gasPrice: ' + gasPrice + 'gasLimit: ' + gasLimit)
        /* Создаём неподписанную транзакцию. Она включает в себя:
           nonce - порядковый номер
           gasPrice и gasLimit - константы, использующиеся для подсчёта комиссии
           value - сумма транзакции в wei
           to - адрес получателя
           chainId - обозначает сеть, в которой будет отправлена траназкция
           К примеру, ropsten - 3, mainnet - 1, значение согласно EIP155
           data - содержит собой код, но т.к у нас обычная транзакция, то это поле пусто
           v,r,s - данные цифровой подписи, согласно EIP155 r и s - 0, v  = chainId
        */
        let rawtx = {
            value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
            nonce: web3.utils.toHex(value),
            from: myAdress,
            to: paymentAdress,
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'shannon')),
            gasLimit: web3.utils.toHex(24000),
            chainId: web3.utils.toHex(1),
            data: '0x00',
            v: web3.utils.toHex(1),
            r: 0,
            s: 0
        }
        info('Gas price: ' + rawtx.gasPrice)
        info('tx value: ' + rawtx.value)
        for (let item in rawtx) {
            info('item : ' + Object(rawtx)[item])
        }
        // С помощью ethereumjs-tx создаём объект транзакции
        let tx = new Transaction(rawtx)
        info('OK')
        let txCost = tx.getUpfrontCost()
        let txfee = web3.utils.toDecimal(web3.utils.toHex(tx.getDataFee()))
        info('Transaction cost: ', txfee)
        info('Unsigned: ' + tx.serialize().toString('hex'))

        info('Pass this to amount: ' + amount)
        info('Amount type: ' + typeof(amount))

        let fee = txfee/100000000000
        let message = new Buffer(32);
        message[0] = 0x99
        message[31] = 0x99
        let hashArray: Array<Buffer> =[]
        hashArray.push(message)

            let data = await getSignaturePCSC(1, hashArray, paymentAdress, amount, 1, course, fee, balance)
            if (data[0].length != 1) {
                let temp = web3.utils.hexToBytes(tempEtherData)
                let privBuf = new Buffer(32)
                for (let i = 0; i < 32; i++) {
                    privBuf[i] = temp[i]
                }

                tx.sign(privBuf)

                let serTx = '0x' + tx.serialize().toString('hex')
                info(serTx)
                web3.eth.sendSignedTransaction(serTx).on('receipt', info).on('transactionHash', function (hash) {
                    info('Transaction sended: ' + hash)
                    //redirect()
                }).on('error', console.error).catch(err => info(err))
            }

    }).catch(err => info(err))

}
export function handleEthereum(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number,redirect: any, course: number, balance: number) {
  createTransaction(paymentAdress, amount, gasPrice, gasLimit, redirect,course, balance)
}