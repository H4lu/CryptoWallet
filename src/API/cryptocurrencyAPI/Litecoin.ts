import { TransactionBuilder, networks, Transaction, ECPair } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import * as utils from './utils'
// import * as crypto from 'crypto'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
// import { Transaction, TransactionBuilder, networks } from 'bitcoinjs-lib'
import { sig } from '../hardwareAPI/GetSignature'
import * as wif from 'wif'
import * as satoshi from 'satoshi-bitcoin'
import { info } from 'electron-log'
let myAddress = ''
const rootURL = 'https://chain.so/api/v2'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.litecoin
const NETWORK = 'LTC'

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
  /*
  myAddr = await getAddressPCSC(0)
  info('BTC ADDRESS', myAddr)
  */
  info('INITING LTC ADDRESS')

  return new Promise(async (resolve) => {
    let status = false
    while (!status) {
      let answer = await getAddressPCSC(2)
      info('GOT MYADDR ANSWER', answer)
      info('My addr length', answer.length)
      if (answer.length > 16 && answer.includes('LTC')) {
        status = true
        info('status after reset', status)
        info('resolving')
        setMyAddress(answer.substring(3,answer.length))
        resolve(0)
      }
    }
    /*
    let interval = setInterval(async () => {
      myAddr = await getAddressPCSC(0)
      if (myAddr.length > 20) {
        clearInterval(interval)
        resolve(0)
        info('MY ADDRESS BITCOIN: ' + myAddr)
      }
    },500,[])
    */
  //
// })

  })
}

function parseValueCrypto(response: webRequest.Response<string>): Array<Number | String> {
  let parsedResponse = JSON.parse(response.content).data
  info('PARSED RESP IN PARSE', parsedResponse)
  info('CONFIRMED BALANCE',Number(parsedResponse.confirmed_balance),parsedResponse.confirmed_balance)
  info('UNCONFIRMED',Number(parsedResponse.unconfirmed_balance),parsedResponse.unconfirmed_balance)
  let balance = Number(parsedResponse.confirmed_balance) + Number(parsedResponse.unconfirmed_balance)
  info('BALANCE', balance)
  info('BALANCE TO STRING', String(balance))
  info(balance.toString())
  info(Number(balance).toString(10))
  info(Number(balance).toString())
  let arr = []
  arr.push('LTC')
  arr.push(Number(balance.toFixed(8)))
  let answer = { 'LTC': balance }
  info('ANSWERING IN PARSEVALUE CRYPTO',arr,answer,arr[1])
  return arr
}

function setMyAddress(address: string) {
  myAddress = address
  info('MY ADDRESS LITECOIN: ' + myAddress)
}

export async function getLitecoinLastTx(): Promise<any> {
  info('CALLING LTC')
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddress
    let response = await webRequest.get(requestUrl)
    info('GOT THIS',response)
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
  let requestUrl = 'https://api.blockcypher.com/v1/ltc/main/addrs/' + myAddress + '/balance'
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

/*function ReplaceAt(input: any, search: any, replace: any, start: any, end: any) {
  info('FIRST SLICE:' + input.slice(0, start))
  info('SECOND SLICE ' + input.slice(start, end).replace(search, replace))
  info('THIRD SLICE: ' + input.slice(end))
  return input.slice(0, start)
      + input.slice(start, end).replace(search, replace)
      + input.slice(end)
}
*/
async function createTransaction(paymentAdress: string,
    transactionAmount: number,transactionFee: number, redirect: any, utxos: Array<any>) {
  info(redirect)
  info('Tx amount: ' + transactionAmount)
  info(transactionFee)
  let targets = {
    address: paymentAdress,
    value: transactionAmount
  }
  info('Got this utxos: ' + utxos)
  let { inputs, outputs, fee } = coinSelect(utxos, targets, 100)
  info('Got this inputs: ' + inputs)
      // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  info(fee)
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
  // let sig: string = ''
  for (let tx in inputs) {
    info('Index: ' + tx)
    let hashForSig = transaction.tx.hashForSignature(Number(tx), Buffer.from(Object(utxos[Number(tx)]).script_hex),Transaction.SIGHASH_ALL)
    info('Hash for sig in for: ' + hashForSig.toString('hex'))
  }
  transaction.inputs.map(value => {
    info('MAPPED INPUT: ' + value)
  })
  transaction.tx.ins.forEach((value: any) => {
    info('PROBABLY TX INPUT: ' + JSON.stringify(value))
  })

  /*let hashArray: Array<any>
  let lastIndex = 0
  hashArray = []
  transaction.inputs.forEach(function(input, index) {
    info(input)
    let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + Object(utxos[index]).script_hex + 'ff', unbuildedTx.indexOf('00000000ff', lastIndex), unbuildedTx.indexOf('00000000ff', lastIndex) + 50)
    info('DATA FOR HASH: ' + dataForHash)
    let firstHash = crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex')
    let secondHash = crypto.createHash('sha256').update(Buffer.from(firstHash, 'hex')).digest('hex')
    info('SECOND HASH: ' + secondHash)
    let sigIndex = unbuildedTx.indexOf('00000000ff', lastIndex)
    info(sigIndex)
    lastIndex += 90
      // let hashForSig = transaction.tx.hashForSignature(index, Buffer.from(Object(utxos[index]).script_hex),Transaction.SIGHASH_ALL)
    hashArray.push(Buffer.from(secondHash,'hex'))
  })
  let hashBuffer = Buffer.concat(hashArray)
  info('HASHBUFFER: ' + hashBuffer + 'LENGTH: ' + hashBuffer.length)
  info('HASHARRAY: ' + hashArray)
  let data = await getSignaturePCSC(2, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.tx.ins.length)
  /*
  let startIndex = 5
  let shift = data[4] + 5
  */
 /*
  transaction.inputs.forEach((input, index) => {
    info('Input', input)
    info('Index', index)
    info('SIGNATURE DATA', data[index].toString('hex'))
    unbuildedTx = unbuildedTx.replace('00000000ff','000000' + data[index].toString('hex') + 'ff')
    info('Unbuilded step', index, 'tx:', unbuildedTx)
    /*
    unbuildedTx = unbuildedTx.replace('00000000ff','000000' + data.slice(startIndex, shift).toString('hex') + 'ff')
    info('INSERT THIS: ' + data.slice(startIndex, shift).toString('hex'))
    info('STARTINDEX: ' + data[startIndex] + 2)
    info('DATA OF : ' + data[startIndex])
    startIndex += (data[startIndex] + 2)
    shift += data[startIndex] + 2
    info('SHIFT VALUE: ' + shift)
    info('DATA OF SHIFT: ' + data[shift])
    info('START INDEX: ' + startIndex)
    info('SHIFT: ' + shift)
    */
  // })
  info('UNBUILDED TX: ' + unbuildedTx)
  let key = await sig(2,paymentAdress,satoshi.toBitcoin(transactionAmount))
  let wifKey = wif.encode(176,key.slice(3,35),true)
  let alice = ECPair.fromWIF(wifKey,network)
  info('LTC ADDRESS', alice.getAddress())
  transaction.inputs.forEach((value,index) => {
    transaction.sign(index,alice)
    info('SIG VALUE', value)
  })
  // info('DATA: ' + data)
  let final = transaction.build().toHex()
  info('FIANL', final)
  sendByBlockcypher(final, redirect)
  info('Final sig: ' + sig)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  // transaction.addOutput(paymentAdress, transactionAmount)
  // Добавляем адрес для "сдачи"
  // Вычисляем хэш неподписанной транзакции
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  // Сериализуем неподписаннуб транзакцию
  // Добавляем UnlockingScript в транзакцию
  // Возвращаем готовую к отправке транзакцию
}
// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
/*function sendTransaction(transactionHex: string, redirect: any) {
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
        info(body)
        info(res), info(err)
        let bodyStatus = body
        info(bodyStatus.tx.hash)
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
   /*
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
     if (bodyStatus.toString() === 'success') {
       redirect()
     } else {
       info(body.error.message)
       alert('Error occured: ' + body.error.message)
     }
   })
}
*/
function sendTransaction(transactionHex: string, redirect: any) {
  info('url: ' + urlChainSo + NETWORK)
  // формируем запрос
  /* Request.post({
    url: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
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
        info(bodyStatus.tx.confirmations)
        try {
          if (body.tx.confirmations === 0) {
            // alert('Transaction sended! Hash: ' + Object(body).tx.hash)
            redirect()
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

export function handleLitecoin(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
  // let code = 239
  // let code2 = 57
  // let code = 239
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
      createTransaction(paymentAdress, amount, transactionFee, redirect, utxos).catch(err => {
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
