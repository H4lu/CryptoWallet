import { TransactionBuilder, networks, Transaction, ECPair } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
import * as base58 from 'bs58'
// import { getSignaturePCSC } from '../hardwareAPI/GetSignature'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
// import getAddress from '../hardwareAPI/GetAddress'
import * as utils from './utils'
// import * as crypto from 'crypto'
import * as satoshi from 'satoshi-bitcoin'
import * as wif from 'wif'
import { sig } from '../hardwareAPI/GetSignature'
// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.bitcoin
const NETWORK = 'test3'//test3 for testnet; main for mainnet
const rootURL = 'https://chain.so/api/v2'
const token = '4f92f3ddb25241c2a31a7673f824f815'
const BLOCKCYPHER_URL = 'https://api.blockcypher.com/v1/btc/'
let myAddr = ''
let balance: number
let price: number
import { info } from 'electron-log'



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
  console.log('got this response', response.content)
  let parsedResponse = JSON.parse(response.content)
  // console.log('PARSED RESP IN PARSE', parsedResponse)
  // console.log('CONFIRMED BALANCE',Number(parsedResponse.confirmed_balance),parsedResponse.confirmed_balance)
  // console.log('UNCONFIRMED',Number(parsedResponse.unconfirmed_balance),parsedResponse.unconfirmed_balance)
  // let balance = Number(parsedResponse.confirmed_balance) + Number(parsedResponse.unconfirmed_balance)
  // console.log('BALANCE', balance)
  // console.log('BALANCE TO STRING', String(balance))
  // console.log(balance.toString())
  // console.log(Number(balance).toString(10))
  // console.log(Number(balance).toString())
  
  let arr = []
  arr.push('BTC')
  arr.push(Number(satoshi.toBitcoin(parsedResponse.final_balance)))
//  let answer = { 'BTC': balance }
 // console.log('ANSWERING IN PARSEVALUE CRYPTO',arr,answer,arr[1])
  return arr
}

export async function initBitcoinAddress() {
  /*
  myAddr = await getAddressPCSC(0)
  info('BTC ADDRESS', myAddr)
  */
  info('INITING BTC ADDRESS')

  return new Promise(async (resolve) => {
   
    let status = false
    while (!status) {
      info('Status', status)
      let answer = await getAddressPCSC(0)
      info('GOT MYADDR ANSWER', answer)
      info('My addr length', answer.length)
      if (answer.length > 16 && answer.includes('BTC')) {
        status = true
        info('status after reset', status)
        info('MY ADDRESS BITCOIN: ' + myAddr)
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

export function isBTCOutgoing(addresses: Array<any>): Boolean {
  console.log('got this addrsses', addresses)
  return addresses.indexOf(myAddr) > -1
}
function setMyAddress(address: string) {
  myAddr = address
  console.log('MY ADDRESS BITCOIN:' + myAddr)
}
export function getBitcoinAddress() {
  return myAddr
}
export async function getBitcoinLastTx(): Promise<any> {
  console.log('CALLING BTC')
  try {
    const requestUrl = BLOCKCYPHER_URL + NETWORK + '/addrs/' + myAddr + '/full?limit=50'
   // const requestUrl = rootURL + '/address/' + NETWORK + '/' + myAddr
    console.log('My req url: ' + requestUrl)
    let response = await webRequest.get(requestUrl)
    console.log('GOT THIS RESPONSE',response)
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
  console.log('GETTING BTC BALANCE ')
  /* Задаём параметры запроса
    Network - тип сети, testnet или mainnet
    myAddr - наш адрес
    0 - количество подтверждений транзакций
  */
  // rootURL + 'get_address_balance/' + myAddr
  let requestUrl = BLOCKCYPHER_URL + NETWORK + '/addrs/' + myAddr + '/balance'
  console.log(requestUrl)
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
 // let requestUrl = 'https://chain.so/api/v2/get_tx_unspent/' + NETWORK + '/' + myAddr
  let requestUrl = BLOCKCYPHER_URL + NETWORK + '/addrs/' + myAddr + '?unspentOnly=true'
  console.log('request url', requestUrl)
  try {
    const response = await webRequest.get(requestUrl)
    console.log('Raw response: ', response.content)
    //console.log('Response of last tx: ' + JSON.parse(response.content).data.txs)
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      info(error)
    })
  }
}

/* function ReplaceAt(input: any, search: any, replace: any, start: any, end: any) {
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
  console.log(redirect)
  console.log('Tx amount: ' + transactionAmount)
  console.log(transactionFee)
  let targets = {
    address: paymentAdress,
    value: transactionAmount
  }
  console.log('Got this utxos: ' , utxos)
  let { inputs, outputs, fee } = coinSelect(utxos, targets, 70)
  console.log('Got this inputs: ', inputs)
  console.log('got this outputs', outputs)
      // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  console.log(fee)

  let transaction = new TransactionBuilder(network)

  for (let input in inputs) {
    transaction.addInput(inputs[input].tx_hash, inputs[input].tx_output_n)
    console.log('Tx inputs: ', transaction.inputs)
  }
  for (let out in outputs) {
    if (!outputs[out].address) {
      outputs[out].address = myAddr
    }
    transaction.addOutput(outputs[out].address, outputs[out].value)
  }
  let unbuildedTx = transaction.buildIncomplete().toHex()
  console.log('Unbuilded: ' + transaction.buildIncomplete().toHex())
  // let sign: string = ''
  for (let tx in inputs) {
    console.log('Index: ' + tx)
    console.log('utxos',utxos)
    let hashForSig = transaction.tx.hashForSignature(Number(tx), Buffer.from(base58.decode(myAddr)),Transaction.SIGHASH_ALL)
    console.log('Hash for sig in for: ' + hashForSig.toString('hex'))
  }
  let key = await sig(0,paymentAdress,satoshi.toBitcoin(transactionAmount))
  let wifKey = wif.encode(128,key.slice(3,35),true)
  let alice = ECPair.fromWIF(wifKey,network)
  console.log('MY ADDRESS', alice.getAddress())
  transaction.inputs.forEach((value, index) => {
    console.log('THIS SIGNING INDEX',index,'and value',value)
    transaction.sign(index,alice)
  })

  console.log('UNBUILDED TX: ' + unbuildedTx)
  // info('DATA: ' + data)
  // transaction.addOutput(paymentAdress, transactionAmount)
  let final = transaction.build().toHex()
  console.log('FINAL', final)
  sendByBlockcypher(final, redirect)

}


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
       info('ERROR IN SEND BITCOIN', err)
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
    url: BLOCKCYPHER_URL + NETWORK + '/txs/push?token=' + token,
    headers: {
      'content-type': 'application/json'
    },
    body : { 'tx': transactionHex },
    json: true
  },
        (res,err,body) => {
          console.log(body)
          console.log(res),
          console.log(err)    
          if (err == null) {
            redirect()
          } else {
            console.log('ERROR IN SEND BY BLOCKCYPHER', err)
            alert(err.body.error)
          }

        })
}

export function handle(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
  info('In handle')
  // let code = 128
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    console.log('RespData: ' + respData)
      let utxos = []
      for (let utxo in respData.txrefs) {
        let temp = respData.txrefs[utxo].value
       // respData.txrefs[utxo].value = toSatoshi(temp)
        console.log('My value: ' + respData.txrefs[utxo].value)
        utxos.push(respData.txrefs[utxo])
        console.log('Utxo: ' + utxo)
        console.log('Utxos: ' + utxos)
      }
      amount = toSatoshi(amount)
      createTransaction(paymentAdress, amount, transactionFee, redirect, utxos).catch(err => {
        console.log(err)
      })

  }).catch((error: any) => {
    console.log(error)
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
