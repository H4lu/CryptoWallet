import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import { getSig, openPort } from '../hardwareAPI/GetSignature'
import { getAddressByCOM } from '../hardwareAPI/GetAddress'
// import getAddress from '../hardwareAPI/GetAddress'
import * as utils from './utils'
import * as crypto from 'crypto'
import Container from '../../ui/Index'
import * as satoshi from 'satoshi-bitcoin'
console.log(Container)
// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
console.log(urlChainSo)
const network = networks.testnet
const NETWORK = 'BTCTEST'
const rootURL = 'https://chain.so/api/v2'
let myAddr = ''
export async function initBitcoinAddress() {
  console.log('OPENING PORT')
  let port = await openPort()
  console.log('PORT IN AWAIT', port)
  myAddr = await getAddressByCOM(port, 0)
  if (myAddr.length > 1) return 1
  console.log('MY ADDRESS BITCOIN: ' + myAddr)
}
export default function getBitcoinAddress() {
  return myAddr
}
export async function getBitcoinLastTx(): Promise<any> {
  console.log('CALLING BTC')
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddr
    console.log('My req url: ' + requestUrl)
    let response = await webRequest.get(requestUrl)
    console.log('GOT THIS RESPONSE',response)
    return response
  } catch (err) {
    console.log(err)
  }
}
export async function getFee() {
  const requestUrl = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'
  try {
    const response = await webRequest.get(requestUrl)
    return response.content
  } catch (error) {
    console.log(error)
  }
}
// We`re Bob. Bob send`s BTC to Alice
export async function getBalance(): Promise<any> {
  /* Задаём параметры запроса
    Network - тип сети, testnet или mainnet
    myAddr - наш адрес
    0 - количество подтверждений транзакций
  */
  // rootURL + 'get_address_balance/' + myAddr
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 0
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
  let requestUrl = 'https://chain.so/api/v2/get_tx_unspent/' + NETWORK + '/' + myAddr
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
      outputs[out].address = myAddr
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
      console.log('My index: ' + index)
      console.log('For each')
      console.log(input)
      console.log('Utxo script: ' + Object(utxos[index]).script_hex)
      let dataForHash = ReplaceAt(unbuildedTx + '01000000', '00000000ff', '00000019' + Object(utxos[index]).script_hex + 'ff', unbuildedTx.indexOf('00000000ff', lastIndex), unbuildedTx.indexOf('00000000ff', lastIndex) + 50)
      console.log('DATA FOR HASH: ' + dataForHash)
      let firstHash = crypto.createHash('sha256').update(Buffer.from(dataForHash, 'hex')).digest('hex')
      let secondHash = crypto.createHash('sha256').update(Buffer.from(firstHash, 'hex')).digest('hex')
      console.log('SECOND HASH: ' + secondHash)
      console.log('GOT THIS HASH' + crypto.createHash('sha256').update(crypto.createHash('sha256').update('sdfsdf').digest('hex')).digest('hex'))
      let sigIndex = unbuildedTx.indexOf('00000000ff', lastIndex)
      console.log(sigIndex)
      lastIndex += 90
      // let hashForSig = transaction.tx.hashForSignature(index, Buffer.from(Object(utxos[index]).script_hex),Transaction.SIGHASH_ALL)
      hashArray.push(Buffer.from(secondHash,'hex'))
    })
    let hashBuffer = Buffer.concat(hashArray)
    console.log('HASHBUFFER: ' + hashBuffer + 'LENGTH: ' + hashBuffer.length)
    console.log('HASHARRAY: ' + hashArray)
    let data = await getSig(0, hashBuffer, paymentAdress, transactionAmount, transaction.tx.ins.length)
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
/*  function createTransaction(paymentAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number, redirect: any): void {
  console.log(transactionFee)
  console.log('Transaction amount: ' + transactionAmount)
  // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  let transaction = new TransactionBuilder(network)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  transaction.addInput(transactionHash, outNumber)
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  let change: number = transactionInputAmount - transactionAmount - 4500
  // Добавляем адрес для "сдачи"
  if (change > 0) {
    transaction.addOutput(myAddr, Math.round(change))
  }
  console.log('Build incomplete: ' + transaction.buildIncomplete().toHex())
  // Вычисляем хэш неподписанной транзакции
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript.trim(), 'hex'), Transaction.SIGHASH_ALL)
  console.log('Hash for sig: ' + txHashForSignature.toString('hex'))
  console.log('Hash for sig length: ' + txHashForSignature.length)
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  openPort().then(() => {
    getSig(0, txHashForSignature.toString('hex'), paymentAdress, transactionAmount).then(value => {
      console.log('Suppposed to be sig: ' + value.slice(5,value.length).toString('hex'))
      // Сериализуем неподписанную транзакцию
      let txHex = transaction.tx.toHex()
      // Добавляем UnlockingScript в транзакцию
      let data = txHex.replace('00000000ff','000000' + value.slice(5,value.length).toString('hex') + 'ff')
      console.log('Final transaction: ' + data)
      // Возвращаем готовую к отправке транзакцию
      sendTransaction(data, redirect)
    }).catch(err => {
      throw(err)
    })
  }).catch(err => {
    throw(err)
  })

}
*/
// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
function sendTransaction(transactionHex: string, redirect: any) {
  console.log('url: ' + urlChainSo + NETWORK)
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
        console.log(body)
        console.log(res), console.log(err)
        let bodyStatus = body
        console.log(bodyStatus.tx.confirmations)
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

/* const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
function sendTransaction(transactionHash: string) {
  Request.post({ url: urlSmartbit,
    headers: {
      'content-type': 'application/json'
    },
    body : { 'hex': transactionHash },
    json: true}, (err, res, body) => {
    console.log(body)
    console.log(res), console.log(err)
    let bodyStatus = body.success
    if (bodyStatus.toString() === 'true') {
      alert('Transaction sended! Hash: ' + body.txid)

    } else {
      console.log(body.error.message)
      alert('Error occured: ' + body.error.message)
    }
  })
}
*/
export function handle(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
  console.log('In handle')
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
/* export function handle(paymentAdress: string, amount: number, transactionFee: number) {
  console.log('In handle')
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    console.log('RespData: ' + respData.data)
    console.log('Resp status: ' + respData.status)
    let utxos = []
    for (let utxo in respData.data.txs) {
      let temp = respData.data.txs[utxo].value
      respData.data.txs[utxo].value = toSatoshi(temp)
      console.log('My value: ' + respData.data.txs[utxo].value)
      utxos.push(respData.data.txs[utxo])
      console.log('Utxo: ' + utxo)
      console.log('Utxos: ' + utxos)
    }
    let targets = {
      address: paymentAdress,
      value: toSatoshi(Number(amount))
    }
    let tx = createTransaction(paymentAdress, toSatoshi(Number(amount)), transactionFee, utxos)
    sendTransaction(tx)
    console.log(tx)
    let { inputs, outputs, fee } = coinSelect(utxos, targets, Number(transactionFee))
    console.log(fee)
    console.log('Inputs in handle: ' + inputs)
    console.log('Outputs in handle:' + outputs)

    if (!inputs || !outputs) return
    let txb = new TransactionBuilder(network)
    // inputs = JSON.parse(inputs)
    for (let input in inputs) {
      txb.addInput(inputs[input].txid, inputs[input].output_no)
    }
    /* Array(inputs).forEach(input => {
      console.log('My input: ' + input)
      txb.addInput(Objecttxb(input).txid, Object(input).vout)
    })
    for (let out in outputs) {
      console.log('Out address: ' + outputs[out].address)
      if (!outputs[out].address) {
        outputs[out].address = myAddr
        console.log('Added this to change: ' + outputs[out].address)
      }
      txb.addOutput(outputs[out].address, outputs[out].value)
    }
    /* Array(outputs).forEach(output => {
      if (!output.address) {
        output.address = myAddr
      }
      txb.addOutput(output.address, output.value)
    })
    const key = ECPair.fromWIF('cT2KsVoG9CxsphtEefRXDvmFnq3aUZ5mvQDNT3HKb3UqhGGrWxiy', network)
    console.log('Unbuilded in handle: ' + txb.buildIncomplete().toHex())
    let sig = ''
    txb.inputs.forEach(function(input, index) {
      console.log('My index: ' + index)
      console.log('For each')
      console.log(input)
      console.log('Utxo script: ' + Object(inputs[index]).script_hex)
      let hashForSig = txb.tx.hashForSignature(index, Buffer.from(Object(inputs[index]).script_hex),Transaction.SIGHASH_ALL)
      console.log('My hash type: ' + Transaction.SIGHASH_ALL)
      console.log('Hash for sig: ' + hashForSig.toString('hex'))
      let data = getSign(0, hashForSig.toString('hex'))
      if (index !== 0) {
        sig = sig.concat(Object(inputs[index]).script_hex + data.toString() + 'ffffffff')
        console.log('My signature: ' + sig)
      } else {
        sig = sig.concat(data.toString() + 'ffffffff')
        console.log('Concatenate sig: ' + sig)
      }
    })
    /*
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d5000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c48000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d5000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c48000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    txb.inputs.forEach(function (input, index) {
      console.log(input)
      txb.sign(index, key)
    })
    console.log('Builder Tx: ' + txb.build().toHex())

  }).catch((error) => {
    console.log(error)
  })
}
*/
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
