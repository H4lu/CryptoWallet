import {TransactionBuilder, networks, Transaction, ECPair, address, script} from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
 import { getSignaturePCSC } from '../hardwareAPI/GetSignature'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
// import getAddress from '../hardwareAPI/GetAddress'
import * as utils from './utils'
 import * as crypto from 'crypto'
import * as satoshi from 'satoshi-bitcoin'
import * as wif from 'wif'
import { sig } from '../hardwareAPI/GetSignature'
// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.bitcoin
const NETWORK = 'BTC'
const rootURL = 'https://chain.so/api/v2'
let myAddr = ''
let myPubKey = new Buffer(33)
let balance: number
let price: number
import { info } from 'electron-log'
import number = script.number;
import {types} from "util";
import {Buffer} from "buffer";
//import isUint8Array =
export function setBTCBalance(bal: number) {
  balance = bal
}
export function getBalance() {
  return balance
}
export function setBTCPrice(priceToSet: number) {
  price = priceToSet
}
export function getBTCPrice() {
  return price
}
export async function getBitcoinSmartBitBalance(): Promise<webRequest.Response<string>> {

  let url = 'https://testnet-api.smartbit.com.au/v1/blockchain/address/' + myAddr
  try {
    const response = await webRequest.get(url)
    info('RESPONSE OF SMARTBIT',response)
    return (response)
  } catch (error) {
    return error
  }
}
function parseValueCrypto(response: webRequest.Response<string>): Array<any> {
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
  arr.push('BTC')
  arr.push(Number(balance.toFixed(8)))
  let answer = { 'BTC': balance }
  info('ANSWERING IN PARSEVALUE CRYPTO',arr,answer,arr[1])
  return arr
}

export async function initBitcoinAddress() {
  info('INITING BTC ADDRESS')

  return new Promise(async (resolve) => {
    let status = false
    while (!status) {
      info('Status', status)
      let answer = await getAddressPCSC(0)
      info('GOT MYADDR ANSWER', answer)
      info('My addr length', answer[0].length)
      if (answer[0].length > 16 && answer[0].includes('BTC')) {
        status = true
        info('status after reset', status)
        info('MY ADDRESS BITCOIN: ' + myAddr)
        info('resolving')
        setMyAddress(answer[0].substring(3,answer[0].length))
        setMyPubKey(answer[1])
        resolve(0)
      }
    }

  })
}
export function setMyAddress(address: string) {
  myAddr = address
  info('MY ADDRESS BITCOIN:' + myAddr)
}
export function setMyPubKey(pubKey: Buffer) {

    myPubKey[0] = 0x02 + pubKey[64]%2

    for(let i = 0; i < 32; i++)
    {
        myPubKey[i+1] = pubKey[i+1]
    }
    info('MY PUBKEY BITCOIN FULL:', pubKey.toString('hex'))
    info('MY PUBKEY BITCOIN     :', myPubKey.toString('hex'))
}

export default function getBitcoinAddress() {
  return myAddr
}
export function getBitcoinPubKey() {
    return myPubKey
}


export async function getBitcoinLastTx(): Promise<any> {
  info('CALLING BTC')
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddr
    info('My req url: ' + requestUrl)
    let response = await webRequest.get(requestUrl)
    return response
  } catch (err) {
    info(err)
  }
}
export async function getFee() {
  const requestUrl = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'
  try {
    const response = await webRequest.get(requestUrl)
    return response.content
  } catch (error) {
    info(error)
  }
}
// We`re Bob. Bob send`s BTC to Alice
export async function getBTCBalance(): Promise<Array<any>> {
  /* Задаём параметры запроса
    Network - тип сети, testnet или mainnet
    myAddr - наш адрес
    0 - количество подтверждений транзакций
  */
  // rootURL + 'get_address_balance/' + myAddr
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 0
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
  let requestUrl = 'https://chain.so/api/v2/get_tx_unspent/' + NETWORK + '/' + myAddr
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

 function ReplaceAt(input: any, search: any, replace: any, start: any, end: any) {
  info('FIRST SLICE:' + input.slice(0, start))
  info('SECOND SLICE ' + input.slice(start, end).replace(search, replace))
  info('THIRD SLICE: ' + input.slice(end))
  return input.slice(0, start)
      + input.slice(start, end).replace(search, replace)
      + input.slice(end)
}

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
    let { inputs, outputs, fee } = coinSelect(utxos, targets, 10)
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
            outputs[out].address = myAddr
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

    info('HASHARRAY: ', hashArray[0])
    info('HASHARRAY len: ', hashArray[0].length)
    let data = await getSignaturePCSC(0, hashArray, paymentAdress, satoshi.toBitcoin(transactionAmount), transaction.tx.ins.length)

    transaction.inputs.forEach((input, index) => {
        info('Input', input)
        info('Index', index)
        info('SIGNATURE DATA', data[index].toString('hex'))
        unbuildedTx = unbuildedTx.replace('00000000ff','000000' + data[index].toString('hex') + 'ff')
        info('Unbuilded step',index, 'tx', unbuildedTx)
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

function sendTransaction(transactionHex: string, redirect: any) {
  info('url transaction: ' + urlChainSo + NETWORK)
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
     //info(body)
     //info(res), info(err)
     let bodyStatus = body.status
     info('RESULT TRANSACTION CHAIN: ', bodyStatus)
     if (bodyStatus === 'fail') {
       //info('ERROR IN SEND BITCOIN', err)
      // sendByBlockcypher(transactionHex, redirect)
     } else {
       if (bodyStatus.toString() === 'success') {
         redirect()
       } else {
         //info(body.error.message)
         //alert('Error occured: ' + body.error.message)
       }
     }
   })
}

function sendByBlockcypher(transactionHex: string, redirect: any) {
  Request.post({
    url: 'https://api.blockcypher.com/v1/btc/main/txs/push',
    headers: {
      'content-type': 'application/json'
    },
    body : { 'tx': transactionHex },
    json: true
  },
        (res,err,body) => {
          //info(body)
          //info(res), info(err)
          let bodyStatus = body
          info('RESULT TRANSACTION BLOCK : ', bodyStatus.tx.confirmations)
          if (res !== null) {
            //info('ERROR IN SEND BY BLOCKCYPHER', err)
            //alert(err)
          } else {
            try {
              if (body.tx.confirmations === 0) {
                 alert('Transaction sended! Hash: ' + Object(body).tx.hash)
                redirect()
              }
            } catch (error) {
              //alert('Error occured: ' + Object(body).error)
            }
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
    info(body)
    info(res), info(err)
    let bodyStatus = body.success
    if (bodyStatus.toString() === 'true') {
      alert('Transaction sended! Hash: ' + body.txid)

    } else {
      info(body.error.message)
      alert('Error occured: ' + body.error.message)
    }
  })
}
*/
export function handle(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
  info('In handle')
  // let code = 128
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
/* export function handle(paymentAdress: string, amount: number, transactionFee: number) {
  info('In handle')
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    info('RespData: ' + respData.data)
    info('Resp status: ' + respData.status)
    let utxos = []
    for (let utxo in respData.data.txs) {
      let temp = respData.data.txs[utxo].value
      respData.data.txs[utxo].value = toSatoshi(temp)
      info('My value: ' + respData.data.txs[utxo].value)
      utxos.push(respData.data.txs[utxo])
      info('Utxo: ' + utxo)
      info('Utxos: ' + utxos)
    }
    let targets = {
      address: paymentAdress,
      value: toSatoshi(Number(amount))
    }
    let tx = createTransaction(paymentAdress, toSatoshi(Number(amount)), transactionFee, utxos)
    sendTransaction(tx)
    info(tx)
    let { inputs, outputs, fee } = coinSelect(utxos, targets, Number(transactionFee))
    info(fee)
    info('Inputs in handle: ' + inputs)
    info('Outputs in handle:' + outputs)

    if (!inputs || !outputs) return
    let txb = new TransactionBuilder(network)
    // inputs = JSON.parse(inputs)
    for (let input in inputs) {
      txb.addInput(inputs[input].txid, inputs[input].output_no)
    }
    /* Array(inputs).forEach(input => {
      info('My input: ' + input)
      txb.addInput(Objecttxb(input).txid, Object(input).vout)
    })
    for (let out in outputs) {
      info('Out address: ' + outputs[out].address)
      if (!outputs[out].address) {
        outputs[out].address = myAddr
        info('Added this to change: ' + outputs[out].address)
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
    info('Unbuilded in handle: ' + txb.buildIncomplete().toHex())
    let sig = ''
    txb.inputs.forEach(function(input, index) {
      info('My index: ' + index)
      info('For each')
      info(input)
      info('Utxo script: ' + Object(inputs[index]).script_hex)
      let hashForSig = txb.tx.hashForSignature(index, Buffer.from(Object(inputs[index]).script_hex),Transaction.SIGHASH_ALL)
      info('My hash type: ' + Transaction.SIGHASH_ALL)
      info('Hash for sig: ' + hashForSig.toString('hex'))
      let data = getSign(0, hashForSig.toString('hex'))
      if (index !== 0) {
        sig = sig.concat(Object(inputs[index]).script_hex + data.toString() + 'ffffffff')
        info('My signature: ' + sig)
      } else {
        sig = sig.concat(data.toString() + 'ffffffff')
        info('Concatenate sig: ' + sig)
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
      info(input)
      txb.sign(index, key)
    })
    info('Builder Tx: ' + txb.build().toHex())

  }).catch((error) => {
    info(error)
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
