import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import { getSignature } from '../hardwareAPI/GetSignature'
import * as webRequest from 'web-request'

const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const network = networks.testnet
const NETWORK = 'BTCTEST'

export const myAddr: string = 'mhyUjiGtUvKQc5EuBAYxxE2NTojZywJ7St'

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
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      console.log(error)
    })
  }
}

function createTransaction(paymentAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number): string {
  // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  let transaction = new TransactionBuilder(network)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  transaction.addInput(transactionHash, outNumber)
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  // Добавляем адрес для "сдачи"
  if (change > 0) {
    transaction.addOutput(myAddr, Math.round(change))
  }
  // Вычисляем хэш неподписанной транзакции
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript.trim(), 'hex'), Transaction.SIGHASH_ALL)
  // Вызываем функции подписи на криптоустройстве, передаём хэш и номер адреса
  let unlockingScript = getSignature(txHashForSignature.toString('hex'), 2)
  // Сериализуем неподписаннуб транзакцию
  let txHex = transaction.tx.toHex()
  // Добавляем UnlockingScript в транзакцию
  let data = txHex.replace('00000000ff','000000' + unlockingScript + 'ff')
  // Возвращаем готовую к отправке транзакцию
  return data
}

// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
function sendTransaction(transactionHex: string) {
  // формируем запрос
  Request.post({
    url: urlSmartbit,
    headers: {
      'content-type': 'application/json'
    },
    body : { 'hex': transactionHex },
    json: true
  },
  // Обрабатываем ответ
   (res,err,body) => {
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

export function handle(paymentAdress: string, amount: number, transactionFee: number) {
  getLastTransactionData().then(Response => {
    let respData = JSON.parse(Response.content)
    if (respData.status === 'success') {
      for (let tx in respData.data.txs) {
        if (respData.data.txs[tx].value >= amount + amount * transactionFee) {
          console.log('respData: ' + respData.data.txs[tx])
          let prevOutScript: string = respData.data.txs[tx].script_hex
          let prevHash: string = respData.data.txs[tx].txid
          let unspentTxAmount: number = respData.data.txs[tx].value
          let outNumber: number = respData.data.txs[tx].output_no
          console.log('Hash: ' + prevHash + 'Amount: ' + unspentTxAmount + 'outScript: ' + prevOutScript + 'out_no: ' + outNumber)
          console.log('Types:' + typeof(prevHash) + typeof(prevOutScript) + typeof(unspentTxAmount) + typeof(outNumber))
          amount = toSatoshi(amount), unspentTxAmount = toSatoshi(unspentTxAmount)
          let transaction = createTransaction(paymentAdress, prevHash, unspentTxAmount, amount, transactionFee, prevOutScript, outNumber)
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
