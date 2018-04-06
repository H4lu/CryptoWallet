import getAddress from '../hardwareAPI/GetAddress'
import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import * as utils from './utils'
import * as crypto from 'crypto'
// import { Transaction, TransactionBuilder, networks } from 'bitcoinjs-lib'
import { openPort, getSig } from '../hardwareAPI/GetSignature'
import * as satoshi from 'satoshi-bitcoin'
let address = ''
const rootURL = 'https://chain.so/api/v2'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.testnet
const NETWORK = 'LTCTEST'
export default function getAddres() {
  return address
}
export function initLitecoinAddress() {
  address = getAddress(2)
  address = 'mvLpZMU3cavwLbUMKocpSWcjP9LF62BQMd'
}
export async function getLitecoinLastTx(): Promise<any> {
  console.log('CALLING LTC')
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + address
    let response = await webRequest.get(requestUrl)
    console.log('GOT THIS',response)
    return response
  } catch (err) {
    console.log(err)
  }
}
// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'

// export const address: string = 'mhyUjiGtUvKQc5EuBAYxxE2NTojZywJ7St'

// We`re Bob. Bob send`s BTC to Alice

export async function getLitecoinBalance(): Promise<any> {
  /* Задаём параметры запроса
    Network - тип сети, testnet или mainnet
    address - наш адрес
    0 - количество подтверждений транзакций
  */
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + address + '/' + 0
  console.log(requestUrl)
  try {
    // Делаем запрос и отдаём в виде Promise
    const response = await webRequest.get(requestUrl)
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      console.log(error)
    })
  }
}

function toSatoshi(BTC: number): number {
  return satoshi.toSatoshi(BTC)
}

async function getLastTransactionData(): Promise<any> {
  let requestUrl = 'https://chain.so/api/v2/get_tx_unspent/' + NETWORK + '/' + address
  try {
    const response = await webRequest.get(requestUrl)
    console.log('Raw response: ' + response.content)
    console.log('Response of last tx: ' + JSON.parse(response.content).data.txs)
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      console.log(error)
    })
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

function createTransaction(paymentAdress: string,
    transactionAmount: number,transactionFee: number, redirect: any, utxos: Array<any>): void {
  console.log(redirect)
  console.log('Tx amount: ' + transactionAmount)
  console.log(transactionFee)
  let targets = {
    address: paymentAdress,
    value: transactionAmount
  }
  console.log('Got this utxos: ' + utxos)
  let { inputs, outputs, fee } = coinSelect(utxos, targets, 20)
  console.log('Got this inputs: ' + inputs)
      // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  console.log(fee)
  let transaction = new TransactionBuilder(network)
  for (let input in inputs) {
    transaction.addInput(inputs[input].txid, inputs[input].output_no)
    console.log('Tx inputs: ' + transaction.inputs)
  }
  for (let out in outputs) {
    if (!outputs[out].address) {
      outputs[out].address = address
    }
    transaction.addOutput(outputs[out].address, outputs[out].value)
  }
  let unbuildedTx = transaction.buildIncomplete().toHex()
  console.log('Unbuilded: ' + transaction.buildIncomplete().toHex())
  let sig: string = ''
  for (let tx in inputs) {
    console.log('Index: ' + tx)
    let hashForSig = transaction.tx.hashForSignature(Number(tx), Buffer.from(Object(utxos[Number(tx)]).script_hex),Transaction.SIGHASH_ALL)
    console.log('Hash for sig in for: ' + hashForSig.toString('hex'))
  }
  transaction.inputs.map(value => {
    console.log('MAPPED INPUT: ' + value)
  })
  transaction.tx.ins.forEach((value: any) => {
    console.log('PROBABLY TX INPUT: ' + JSON.stringify(value))
  })

  openPort().then(async () => {
    let hashArray: Array<any>
    let lastIndex = 0
    hashArray = []
    transaction.inputs.forEach(function(input, index) {
      console.log(input)
      let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + Object(utxos[index]).script_hex + 'ff', unbuildedTx.indexOf('00000000ff', lastIndex), unbuildedTx.indexOf('00000000ff', lastIndex) + 50)
      console.log('DATA FOR HASH: ' + dataForHash)
      let firstHash = crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex')
      let secondHash = crypto.createHash('sha256').update(Buffer.from(firstHash, 'hex')).digest('hex')
      console.log('SECOND HASH: ' + secondHash)
      console.log('HASH OF first buffer: ' + crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex'))
      console.log('HASH WITH BUFFER: ' + crypto.createHash('sha256').update(crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex')))
      let sigIndex = unbuildedTx.indexOf('00000000ff', lastIndex)
      console.log(sigIndex)
      lastIndex += 90
      // let hashForSig = transaction.tx.hashForSignature(index, Buffer.from(Object(utxos[index]).script_hex),Transaction.SIGHASH_ALL)
      hashArray.push(Buffer.from(secondHash,'hex'))
    })
    let hashBuffer = Buffer.concat(hashArray)
    console.log('HASHBUFFER: ' + hashBuffer + 'LENGTH: ' + hashBuffer.length)
    console.log('HASHARRAY: ' + hashArray)
    let data = await getSig(2, hashBuffer, paymentAdress, transactionAmount, transaction.tx.ins.length)
    let startIndex = 5
    let shift = data[4] + 5
    transaction.inputs.forEach(() => {
      unbuildedTx = unbuildedTx.replace('00000000ff','000000' + data.slice(startIndex, shift).toString('hex') + 'ff')
      console.log('INSERT THIS: ' + data.slice(startIndex, shift).toString('hex'))
      console.log('STARTINDEX: ' + data[startIndex] + 2)
      console.log('DATA OF : ' + data[startIndex])
      startIndex += (data[startIndex] + 2)
      shift += data[startIndex] + 2
      console.log('SHIFT VALUE: ' + shift)
      console.log('DATA OF SHIFT: ' + data[shift])
      console.log('START INDEX: ' + startIndex)
      console.log('SHIFT: ' + shift)
    })
    console.log('UNBUILDED TX: ' + unbuildedTx)
    console.log('DATA: ' + data)
    sendTransaction(unbuildedTx, redirect)
  }).catch((error: any) => {
    console.log(error)
  })
  console.log('Final sig: ' + sig)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  // Добавляем адрес для "сдачи"
  // Вычисляем хэш неподписанной транзакции
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  // Сериализуем неподписаннуб транзакцию
  // Добавляем UnlockingScript в транзакцию
  // Возвращаем готовую к отправке транзакцию
}
// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
function sendTransaction(transactionHex: string, redirect: any) {
  // формируем запрос
  // Обрабатываем ответ
  /* Request.post({
    url: 'https://api.blockcypher.com/v1/ltc/main/txs/push',
    headers: {
      'content-type': 'application/json'
    },
    body : { 'tx': transactionHex },
    json: true
  },
      (res,err,body) => {
        console.log(body)
        console.log(res), console.log(err)
        let bodyStatus = body
        console.log(bodyStatus.tx.hash)
        try {
          if (body.tx.confirmations === 0) {
            redirect()
            // alert('Transaction sended! Hash: ' + Object(body).tx.hash)
          }
        } catch (error) {
          alert('Error occured: ' + Object(body).error)
        }
      })
    */
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
     console.log(body)
     console.log(res), console.log(err)
     let bodyStatus = body.status
     console.log(bodyStatus)
     if (bodyStatus.toString() === 'success') {
       redirect()
     } else {
       console.log(body.error.message)
       alert('Error occured: ' + body.error.message)
     }
   })
}

export function handleLitecoin(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    console.log('RespData: ' + respData.data)
    console.log('Resp status: ' + respData.status)
    if (respData.status === 'success') {
      console.log('In success')
      let utxos = []
      for (let utxo in respData.data.txs) {
        let temp = respData.data.txs[utxo].value
        respData.data.txs[utxo].value = toSatoshi(temp)
        console.log('My value: ' + respData.data.txs[utxo].value)
        utxos.push(respData.data.txs[utxo])
        console.log('Utxo: ' + utxo)
        console.log('Utxos: ' + utxos)
      }
      amount = toSatoshi(amount)
      createTransaction(paymentAdress, amount, transactionFee, redirect, utxos)
    } else {
      alert('Error provided by internet connection')
    }
  }).catch((error: any) => {
    console.log(error)
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
