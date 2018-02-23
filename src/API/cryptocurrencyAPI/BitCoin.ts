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

function createTransaction(paymentAdress: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number, utxos: Array<Object>): string {
  console.log(transactionInputAmount)
  console.log(outNumber)
  let targets = {
    address: paymentAdress,
    value: toSatoshi(Number(transactionAmount))
  }
  let { inputs, outputs, fee } = coinSelect(utxos, targets, Number(transactionFee))
  // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  console.log(fee)
  let transaction = new TransactionBuilder(network)
  for (let input in inputs) {
    transaction.addInput(inputs[input].txid, inputs[input].output_no)
  }
  for (let out in outputs) {
    if (!outputs[out].address) {
      outputs[out].address = myAddr
    }
    transaction.addOutput(outputs[out].address, outputs[out].value)
  }
  let sig: string = ''
  transaction.inputs.forEach((input, index) => {
    console.log(input)
    let hashForSig = transaction.tx.hashForSignature(index, Buffer.from(Object(utxos[index]).script_hex),Transaction.SIGHASH_ALL)
    let data = getSign(0, hashForSig.toString('hex'))
    if (index !== 0) {
      sig = sig.concat(Object(utxos[index]).script_hex + data.toString() + 'ffffffff')
      console.log('My signature: ' + sig)
    } else {
      sig = sig.concat(data.toString() + 'ffffffff')
    }
  })
  console.log('Final sig: ' + sig)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  // Добавляем адрес для "сдачи"
  // Вычисляем хэш неподписанной транзакции
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript.trim(), 'hex'), Transaction.SIGHASH_ALL)
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  let unlockingScript = getSign(0, txHashForSignature.toString('hex'))
  // Сериализуем неподписаннуб транзакцию
  let txHex = transaction.tx.toHex()
  // Добавляем UnlockingScript в транзакцию
  let data = txHex.replace('00000000ff','000000' + unlockingScript + 'ff')
  // Возвращаем готовую к отправке транзакцию
  console.log(data)
  return data
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
    let { inputs, outputs, fee } = coinSelect(utxos, targets, Number(transactionFee))
    console.log(fee)
    console.log(inputs)
    console.log(outputs)

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
    txb.inputs.forEach(function (input, index) {
      console.log(input)
      txb.sign(index, key)
    })
    console.log('Builder Tx: ' + txb.build().toHex())
    console.log(txb.buildIncomplete().toHex())
    if (respData.status === 'success') {
      console.log('In success')
      for (let tx in respData.data.txs) {
        console.log('rspdata: ' + respData.data.txs[tx])
        if (respData.data.txs[tx].value >= amount + amount * transactionFee) {
          console.log('respData: ' + respData.data.txs[tx])
          let prevOutScript: string = respData.data.txs[tx].script_hex
          let prevHash: string = respData.data.txs[tx].txid
          let unspentTxAmount: number = respData.data.txs[tx].value
          let outNumber: number = respData.data.txs[tx].output_no
          console.log('Hash: ' + prevHash + 'Amount: ' + unspentTxAmount + 'outScript: ' + prevOutScript + 'out_no: ' + outNumber)
          amount = toSatoshi(amount), unspentTxAmount = toSatoshi(unspentTxAmount)
          let transaction = createTransaction(paymentAdress, unspentTxAmount, amount, transactionFee, prevOutScript, outNumber, respData.data.txs)
          sendTransaction(transaction)
        }
      }
    } else {
      alert('Error provided by internet connection')
    }
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
