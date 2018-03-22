import getAddress from '../hardwareAPI/GetAddress'
import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import * as webRequest from 'web-request'
// import { Transaction, TransactionBuilder, networks } from 'bitcoinjs-lib'
import { openPort, getSig } from '../hardwareAPI/GetSignature'
let address = ''
const rootURL = 'https://chain.so/api/v2'
// const urlChainSo = 'https://chain.so/api/v2/send_tx/'
const network = networks.litecoin
const NETWORK = 'LTC'
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
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number, redirect: any): void {
  console.log(transactionFee)
  console.log('Transaction amount: ' + transactionAmount)
  // Создаём новый объект транзакции. Используется библиотека bitcoinjs-lib
  let transaction = new TransactionBuilder(network)
  // Добавляем вход транзакции в виде хэша предыдущей транзакции и номер выхода с нашим адресом
  transaction.addInput(transactionHash, outNumber)
  // Добавляем выход транзакции, где указывается адрес и сумма перевода
  transaction.addOutput(paymentAdress, transactionAmount)
  let change: number = transactionInputAmount - transactionAmount - 6000
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
    getSig(2, txHashForSignature.toString('hex'), paymentAdress, transactionAmount).then(value => {
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

// Функция отправки транзакции, на вход принимает транзакцию в hex- формате
function sendTransaction(transactionHex: string, redirect: any) {
  // формируем запрос
  // Обрабатываем ответ
  Request.post({
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
          if (JSON.parse(body).tx.hash) {
            redirect()
            // alert('Transaction sended! Hash: ' + Object(body).tx.hash)
          }
        } catch (error) {
          alert('Error occured: ' + Object(body).error)
        }
      })

}

export function handleLitecoin(paymentAdress: string, amount: number, transactionFee: number, redirect: any) {
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
          createTransaction(paymentAdress, prevHash, unspentTxAmount, amount, transactionFee, prevOutScript, outNumber, redirect)
        }
      }
    } else {
      alert('Error provided by internet connection')
    }
  }).catch((error) => {
    console.log(error)
  })
}
