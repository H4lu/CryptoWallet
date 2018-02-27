import { TransactionBuilder, networks, Transaction, ECPair } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import getSign from '../hardwareAPI/GetSignature'
import getAddress from '../hardwareAPI/GetAddress'
import * as utils from './utils'

// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.testnet
const NETWORK = 'BTCTEST'

export const myAddr: string = getAddress(0)

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
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 0
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
  return Number(BTC * 100000000)
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

function createTransaction(paymentAdress: string, transactionAmount: number,transactionFee: number, utxos: Array<Object>): string {
  console.log('Tx amount: ' + transactionAmount)
  let targets = {
    address: paymentAdress,
    value: transactionAmount
  }
  console.log('Got this utxos: ' + utxos)
  let { inputs, outputs, fee } = coinSelect(utxos, targets, Number(transactionFee))
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
  console.log('Unbuilded: ' + transaction.buildIncomplete().toHex())
  let sig: string = ''
  for (let tx in inputs) {
    console.log('Index: ' + tx)
    let hashForSig = transaction.tx.hashForSignature(Number(tx), Buffer.from(Object(utxos[Number(tx)]).script_hex),Transaction.SIGHASH_ALL)
    console.log('Hash for sig in for: ' + hashForSig.toString('hex'))
  }
  transaction.inputs.forEach(function(input, index) {
    console.log('My index: ' + index)
    console.log('For each')
    console.log(input)
    console.log('Utxo script: ' + Object(utxos[index]).script_hex)
    let hashForSig = transaction.tx.hashForSignature(index, Buffer.from(Object(utxos[index]).script_hex),Transaction.SIGHASH_ALL)
    console.log('My hash type: ' + Transaction.SIGHASH_ALL)
    console.log('Hash for sig: ' + hashForSig.toString('hex'))
    let data = getSign(0, hashForSig.toString('hex'))
    if (index !== 0) {
      sig = sig.concat(Object(utxos[index]).script_hex + data.toString() + 'ffffffff')
      console.log('My signature: ' + sig)
    } else {
      sig = sig.concat(data.toString() + 'ffffffff')
      console.log('Concatenate sig: ' + sig)
    }
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
  return sig
}

// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
function sendTransaction(transactionHex: string) {
  console.log('url: ' + urlChainSo + NETWORK)
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
     console.log(body)
     console.log(res), console.log(err)
     let bodyStatus = JSON.parse(body).status
     console.log(bodyStatus)
     if (bodyStatus.toString() === 'success') {
       alert('Transaction sended! Hash: ' + body.txid)
     } else {
       console.log(body.error.message)
       alert('Error occured: ' + body.error.message)
     }
   })
}

export function handle(paymentAdress: string, amount: number, transactionFee: number) {
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
    })*/
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
    })*/
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
    /*0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d5000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c48000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c480000000000ffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d5000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000
    0100000003f50ed0db6b746c15ff909c74eff980890c8b926a1d4f2c3b231e12d7d019beee0100000000ffffffffec728d8e301d8db1c13e1e41986bbb8b41afa3d65546afcc0e94b581e1c35c48000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888acffffffff728265d77a27a14cf7f881c46273f26acac2ee4330ae6089ba2748803e79b7d50000000000ffffffff0280d1f008000000001976a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac47aadf03000000001976a9140ae4da83696abd6515d3a7d62736d6aa60f1d6c888ac00000000*/
    txb.inputs.forEach(function (input, index) {
      console.log(input)
      txb.sign(index, key)
    })
    console.log('Builder Tx: ' + txb.build().toHex())

  }).catch((error) => {
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
