import { TransactionBuilder, networks, Transaction, ECPair } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import * as utils from './utils'
// import * as crypto from 'crypto'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
import {getSignaturePCSC, sig} from '../hardwareAPI/GetSignature'
import * as wif from 'wif'
import * as satoshi from 'satoshi-bitcoin'
import { info } from 'electron-log'
import {Buffer} from "buffer";
let myAddress = 'LLywTi8TF1eGjAzAjpyA3HHwcBt1rgReNG'
let wifKey =''
let myPubKey = new Buffer(64)
const rootURL = 'https://chain.so/api/v2'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.litecoin
const NETWORK = 'LTC'
import Web3 from 'web3'
import * as crypto from "crypto";
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/960cbfb44af74f27ad0e4b070839158a'))

let balance: number
let price: number
export function setLTCBalance(bal: number) {
  balance = bal
}
export function getLTalance() {
  return balance
}
export function setLTCPrice(priceToSet: number) {
  price = priceToSet
}
export function getLTCPrice() {
  return price
}

export default function getAddres() {
  return myAddress
}
export async function initLitecoinAddress() {
  
  
  info('INITING LTC ADDRESS')

  return new Promise(async (resolve) => {
    let status = false
    while (!status) {
      let answer = await getAddressPCSC(2)
      info('GOT MYADDR ANSWER', answer)
      info('My addr length', answer.length)
      if (answer.length > 1 && answer[0].includes('LTC')) {
        status = true
        info('status after reset', status)

          //костыль
       /*   let tempPriv = web3.utils.soliditySha3(answer[0])
          let temp = web3.utils.hexToBytes(tempPriv)
          let privBuf = new Buffer(32)
          for(let i = 0; i < 32; i++)
          {
              privBuf[i] = temp[i]
          }
          wifKey = wif.encode(176,privBuf,true)
          info("LTC wifKey", wifKey)

          let tempLTCData = ECPair.fromWIF(wifKey,network)

          info('LTC ADDRESS', tempLTCData.getAddress())
          myAddress = tempLTCData.getAddress()*/

          //конец костыля


        setMyAddress(answer[0].substring(3,answer[0].length))
        setMyPubKey(answer[1])
        resolve(0)
      }
    }
  })
}
function parseValueCrypto(response: webRequest.Response<string>): Array<Number | String> {
  let parsedResponse = JSON.parse(response.content).data
  let balance: Number = Number(parsedResponse.confirmed_balance) + Number(parsedResponse.unconfirmed_balance)
  let arr = []
  arr.push('LTC')
  arr.push(Number(balance.toFixed(8)))
  return arr
}

function setMyAddress(address: string) {
  myAddress = address
  info('MY ADDRESS LITECOIN: ' + myAddress)
}

export function setMyPubKey(pubKey: Buffer) {
    for(let i = 0; i < 64; i++)
    {
        myPubKey[i] = pubKey[i+1]
    }
    info('PUB_KEY_ETHEREUM', myPubKey.toString('hex'))
}

export function getLitecoinPubKey() {
    return myPubKey
}

export async function getLitecoinLastTx(): Promise<any> {
  info('CALLING LTC')
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddress
    let response = await webRequest.get(requestUrl)
    return response
  } catch (err) {
    info(err)
  }
}

// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'

// export const address: string = 'mhyUjiGtUvKQc5EuBAYxxE2NTojZywJ7St'

// We`re Bob. Bob send`s BTC to Alice

export async function getLTCBalance(): Promise<Array<Number | String>> {
  /* Задаём параметры запроса
    Network - тип сети, testnet или mainnet
    address - наш адрес
    0 - количество подтверждений транзакций
  */
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddress + '/' + 0
  info(requestUrl)
  try {
    // Делаем запрос и отдаём в виде Promise
    const response = await webRequest.get(requestUrl)
    return parseValueCrypto(response)
  } catch (error) {
    Promise.reject(error).catch(error => {
      info(error)
    })
  }
}

function toSatoshi(BTC: number): number {
  return satoshi.toSatoshi(BTC)
}

async function getLastTransactionData(): Promise<any> {
  let requestUrl = 'https://chain.so/api/v2/get_tx_unspent/' + NETWORK + '/' + myAddress
  try {
    const response = await webRequest.get(requestUrl)
    info('Raw response: ' + response.content)
    info('Response of last tx: ' + JSON.parse(response.content).data.txs)
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      info(error)
    })
  }
}

async function createTransaction(paymentAdress: string,
                                 transactionAmount: number,transactionFee: number, redirect: any, utxos: Array<any>, course: number, balance: number) {
    info(redirect)
    info('Tx amount: ' + transactionAmount)
    info('FEE:  ', transactionFee)
    let targets = {
        address: paymentAdress,
        value: transactionAmount
    }
    info('Got this utxos: ' + utxos)
    let { inputs, outputs, fee } = coinSelect(utxos, targets, 35)
    info('Got this inputs: ' + inputs)
    // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
    info('FEE_coinSelect', fee)
    let transaction = new TransactionBuilder(network)
    for (let input in inputs) {
        transaction.addInput(inputs[input].txid, inputs[input].output_no)
        info('Tx inputs: ' + transaction.inputs)
    }
    for (let out in outputs) {
        if (!outputs[out].address) {
            outputs[out].address = myAddress
        }
        transaction.addOutput(outputs[out].address, outputs[out].value)
    }
    let unbuildedTx = transaction.buildIncomplete().toHex()
    info('Unbuilded: ' + transaction.buildIncomplete().toHex())
    transaction.inputs.map(value => {
        info('MAPPED INPUT: ' + value)
    })
    transaction.tx.ins.forEach((value: any) => {
        info('PROBABLY TX INPUT: ' + JSON.stringify(value))
    })

    let hashArray: Array<Buffer> =[]
    let lastIndex = 0
    transaction.inputs.forEach(function(input, index) {
        info('My index: ' + index)
        info('For each')
        info(input)
        info('Utxo script: ' + Object(utxos[index]).script_hex)
        let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + Object(utxos[index]).script_hex + 'ff', unbuildedTx.indexOf('00000000ff', lastIndex), unbuildedTx.indexOf('00000000ff', lastIndex) + 50)
        info('DATA FOR HASH: ' + dataForHash)
        let firstHash = crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex')
        let secondHash = crypto.createHash('sha256').update(Buffer.from(firstHash, 'hex')).digest('hex')
        info('SECOND HASH: ', secondHash)
        let sigIndex = unbuildedTx.indexOf('00000000ff', lastIndex)
        info(sigIndex)
        lastIndex += 90
        hashArray.push(Buffer.from(secondHash,'hex'))
    })
    if(lastIndex != 0) {
        info('HASHARRAY: ', hashArray[0])
        info('HASHARRAY len: ', hashArray[0].length)
        let data = await getSignaturePCSC(2, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.inputs.length, course, fee/100000000, balance)
        if (data[0].length != 1) {
            transaction.inputs.forEach((input, index) => {
                info('Input', input)
                info('Index', index)
                info('SIGNATURE DATA', data[index].toString('hex'))
                unbuildedTx = unbuildedTx.replace('00000000ff', '000000' + data[index].toString('hex') + 'ff')
                info('Unbuilded step', index, 'tx', unbuildedTx)
            })
            info('UNBUILDED TX: ' + unbuildedTx)
            //info('DATA: ' + data)
            sendTransaction(unbuildedTx, redirect)
            //info('Final sig: ' + sig)
            // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
            // Добавляем выход транзакции, где указывается адрес и сумма перевода
            transaction.addOutput(paymentAdress, transactionAmount)
            // Добавляем адрес для "сдачи"/.
            // Вычисляем хэш неподписанной транзакции
            // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
            // Сериализуем неподписаннуб транзакцию
            // Добавляем UnlockingScript в транзакцию
            // Возвращаем готовую к отправке транзакцию
        }
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

function sendTransaction(transactionHex: string, redirect: any) {
  info('url: ' + urlChainSo + NETWORK)
  // формируем запрос
  Request.post({
    url: urlChainSo + NETWORK,
    headers: {
      'content-type': 'application/json'
    },
    body : { 'tx_hex': transactionHex },
    json: true
  },
  // Обрабатываем ответ
   (res,err,body) => {
     info(body)
     info(res), info(err)
     let bodyStatus = body.status
     info(bodyStatus)
     if (bodyStatus === 'fail') {
       info('ERROR IN SEND LITECOIN', err)
       sendByBlockcypher(transactionHex, redirect)
     } else {
       if (bodyStatus.toString() === 'success') {
         redirect()
       } else {
         info(body.error.message)
         alert('Error occured: ' + body.error.message)
       }
     }
   })
}

function sendByBlockcypher(transactionHex: string, redirect: any) {
  Request.post({
    url: 'https://api.blockcypher.com/v1/ltc/main/txs/push',
    headers: {
      'content-type': 'application/json'
    },
    body : { 'tx': transactionHex },
    json: true
  },
      (res,err,body) => {
        info(body)
        info(res), info(err)
        let bodyStatus = body
        info(bodyStatus.tx.hash)
        if (err !== null) {
          if (err.statusMessage === 'Conflict') {
            alert('Conflict')
            return
          }
        }
        try {
          if (body.tx.confirmations === 0) {
            redirect()
            // alert('Transaction sended! Hash: ' + Object(body).tx.hash)
          }
        } catch (error) {
          alert('Error occured: ' + Object(body).error)
        }
      })
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
function accumulative (utxos: any, outputs: any, feeRate: any) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  let bytesAccum = utils.transactionBytes([], outputs)

  let inAccum = 0
  let inputs = []
  let outAccum = utils.sumOrNaN(outputs)

  for (let i = 0; i < utxos.length; ++i) {
    let utxo = utxos[i]
    let utxoBytes = utils.inputBytes(utxo)
    let utxoFee = feeRate * utxoBytes
    let utxoValue = utils.uintOrNaN(Number(utxo.value))

    // skip detrimental input
    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1) return { fee: feeRate * (bytesAccum + utxoBytes) }
      continue
    }

    bytesAccum += utxoBytes
    inAccum += utxoValue
    inputs.push(utxo)

    let fee = feeRate * bytesAccum

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  return { fee: feeRate * bytesAccum }
}

function blackjack (utxos: any, outputs: any, feeRate: any) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  let bytesAccum = utils.transactionBytes([], outputs)

  let inAccum = 0
  let inputs = []
  let outAccum = utils.sumOrNaN(outputs)
  let threshold = utils.dustThreshold({}, feeRate)

  for (let i = 0; i < utxos.length; ++i) {
    let input = utxos[i]
    let inputBytes = utils.inputBytes(input)
    let fee = feeRate * (bytesAccum + inputBytes)
    let inputValue = utils.uintOrNaN(Number(input.value))

    // would it waste value?
    if ((inAccum + inputValue) > (outAccum + fee + threshold)) continue

    bytesAccum += inputBytes
    inAccum += inputValue
    inputs.push(input)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  return { fee: feeRate * bytesAccum }
}

function coinSelect (utxos: any, outputs: any, feeRate: any) {

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (Object(base).inputs) return base

  // else, try the accumulative strategy
  return Object(accumulative(utxos, outputs, feeRate))
}
