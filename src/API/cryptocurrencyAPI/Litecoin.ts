import getAddress from '../hardwareAPI/GetAddress'
import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
// import { Transaction, TransactionBuilder, networks } from 'bitcoinjs-lib'
import { openPort, getSig } from '../hardwareAPI/GetSignature'
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
}
export async function getLitecoinLastTx(): Promise<any> {
  try {
    const requestUrl = rootURL + '/address/' + NETWORK + '/' + address
    let response = await webRequest.get(requestUrl)
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

function createTransaction(paymentAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number): void {
  console.log('Transaction amount: ' + transactionAmount)
  // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  let transaction = new TransactionBuilder(network)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  transaction.addInput(transactionHash, outNumber)
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  // Добавляем адрес для "сдачи"
  if (change > 0) {
    transaction.addOutput(address, Math.round(change))
  }
  console.log('Build incomplete: ' + transaction.buildIncomplete().toHex())
  // Вычисляем хэш неподписанной транзакции
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript.trim(), 'hex'), Transaction.SIGHASH_ALL)
  console.log('Hash for sig: ' + txHashForSignature.toString('hex'))
  console.log('Hash for sig length: ' + txHashForSignature.length)
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  openPort().then(() => {
    getSig(0, txHashForSignature.toString('hex'), paymentAdress, transactionAmount).then(value => {
      console.log('Suppposed to be sig: ' + value.slice(4,value.length).toString('hex'))
      // Сериализуем неподписанную транзакцию
      let txHex = transaction.tx.toHex()
      // Добавляем UnlockingScript в транзакцию
      let data = txHex.replace('00000000ff','000000' + value.slice(4,value.length).toString('hex') + 'ff')
      console.log('Final transaction: ' + data)
      // Возвращаем готовую к отправке транзакцию
      sendTransaction(data.trim())
    }).catch(err => {
      throw(err)
    })
  }).catch(err => {
    throw(err)
  })

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
     let bodyStatus = body.status
     console.log(bodyStatus)
     if (bodyStatus.toString() === 'success') {
       alert('Transaction sended! Hash: ' + body.txid)
     } else {
       console.log(body.error.message)
       alert('Error occured: ' + body.error.message)
     }
   })
}

export function handleLitecoin(paymentAdress: string, amount: number, transactionFee: number) {
  console.log('In handle')
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    console.log('RespData: ' + respData.data)
    console.log('Resp status: ' + respData.status)
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
          console.log('Types:' + typeof(prevHash) + typeof(prevOutScript) + typeof(unspentTxAmount) + typeof(outNumber))
          amount = toSatoshi(amount), unspentTxAmount = toSatoshi(unspentTxAmount)
          createTransaction(paymentAdress, prevHash, unspentTxAmount, amount, transactionFee, prevOutScript, outNumber)
        }
      }
    } else {
      alert('Error provided by internet connection')
    }
  }).catch((error) => {
    console.log(error)
  })
}
