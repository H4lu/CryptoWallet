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
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 0
  try {
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

function createTransaction(AliceAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, prevOutScript: string, outNumber: number): string {
  let transaction = new TransactionBuilder(network)
  transaction.addInput(transactionHash, outNumber)
  transaction.addOutput(AliceAdress, transactionAmount)
  console.log(transactionInputAmount, transactionAmount, transactionFee)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  console.log('fee:' + transactionFee * transactionAmount / 100)
  console.log('change: ' + change)
  // Добавляем адрес для "сдачи"
  if (change > 0) {
    transaction.addOutput(myAddr, Math.round(change))
  }
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript.trim(), 'hex'), Transaction.SIGHASH_ALL)
  console.log('Tx hashForSignature: ' + txHashForSignature.toString('hex'))
  let unlockingScript = getSignature(txHashForSignature.toString('hex'), 2)
  let txHex = transaction.tx.toHex()
  // Добавляем UnlockingScript в транзакцию
  let data = txHex.replace('00000000ff','000000' + unlockingScript + 'ff')
  console.log('my txHex: ' + txHex)
  console.log('data: ' + data)
  return data
}

function sendTransaction(transactionHash: string) {
  Request.post({ url: urlSmartbit,
    headers: {
      'content-type': 'application/json'
    },
    body : { 'hex': transactionHash },
    json: true}, (res,err,body) => {
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
