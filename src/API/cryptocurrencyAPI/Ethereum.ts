import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { sig } from '../hardwareAPI/GetSignature'

import * as webRequest from 'web-request'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
import { info } from 'electron-log'
import {Buffer} from "buffer";

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/hgAaKEDG9sIpNHqt8UYM'))


let myAdress = ''
let myPubKey = new Buffer(64)
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
        setAddress(answer[0].substring(3,answer[0].length).toLowerCase())
        setMyPubKey(answer[1])
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
// const myAdress = '0x033baF5BEdc9fFbf2190C800bfd17e073Bf79D18'
/* const gasPriceConst = 30000000000
const gasLimitConst = 100000*/
// const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))

// const web3 = new Web3('https://ropsten.infura.io/hgAaKEDG9sIpNHqt8UYM')
// const ERC20Contract = new web3.eth.Contract(JSON.parse(abi), testTokenAdress, { from: myAdress })

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
function createTransaction (paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any) {
  info(redirect)
  web3.eth.getTransactionCount(myAdress).then((value) => {
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
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'shannon')),
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
    let txCost = tx.getUpfrontCost()
    info('Transaction cost: ' + web3.utils.fromWei(txCost, 'ether'))
    info('Unsigned: ' + tx.serialize().toString('hex'))
      // Получаем хэш для подписи
    // let txHash = keccak256(tx.serialize())
    // info('Tx hash: ' + txHash.toString())
      // Отправляем на подпись
    info('Pass this to amount: ' + amount)
    info('Amount type: ' + typeof(amount))
    // let hash = Buffer.from(txHash, 'hex')
    // let arr = [hash]
    sig(1, paymentAdress, amount).then(data => {
      /*
      info('data length: ' + sign.length)
      info(web3.utils.toHex(sign[69]))
      info('r: ' + sign.slice(5,37).toString('hex'))
      info('s: ' + sign.slice(37,69).toString('hex'))
      info('v: ' + sign[69])
      */
          // создаём объект подписи
          // cost: 600000130000000
      /*let sig = {
        v : web3.utils.toHex(sign[69] + 10),
        r : sign.slice(5,37),
        s : sign.slice(37,69)
      }*/
      info('SIGNING BY THIS KEY', data.slice(3,35))
      tx.sign(data.slice(3,35))
      // info('V in sig: ' + sig.v)
          // Вставляем подпись в транзакцию
      // Object.assign(tx, sig)
          // Приводим транзакцию к нужному для отправки виду
      let serTx = '0x' + tx.serialize().toString('hex')
      info(serTx)
      web3.eth.sendSignedTransaction(serTx).on('receipt', info).on('transactionHash', function(hash) {
        info('Transaction sended: ' + hash)
        redirect()
      }).on('error', console.error).catch(err => info(err))
        // Отправляем

    }).catch(err => info(err))
  }).catch(err => info(err))
}
export function handleEthereum(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number,redirect: any) {
  createTransaction(paymentAdress, amount, gasPrice, gasLimit, redirect)
}