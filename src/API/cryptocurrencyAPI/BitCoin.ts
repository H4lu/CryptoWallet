import { TransactionBuilder, networks, Transaction } from 'bitcoinjs-lib'
import * as Request from 'request'
import { getSignature } from '../hardwareAPI/GetSignature'
import * as webRequest from 'web-request'

// import { getSignature } from '../hardwareAPI/GetSignature'
// import { Buffer } from 'buffer'
// import * as fs from 'fs'
// import * as RequestPromise from 'request-promise'
// const pathToFile = __dirname + '/../crip.txt'
// const urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const network = networks.testnet
const NETWORK = 'BTCTEST'
// const urlAPI = 'https://chain.so/api/'
// mocks

let myAddr: string = 'mgyENbe2A19bApfxj5VkpTZdMoBweatXkz'
let lastTransactionHash: string = '5340fbb6ea9cba7f41796607323164acd0ad25fb03d213b185bf6593faf9d1e3'
let prevOutScript = '76a9140ff05cc0ca92ed6687b3778708e1334277e5e59888ac'
// let BobPrivateKey = '91jNZuTeUJHpuD9smhJqfQJL9n3C57xqDY7maHWLRUeroFAQBLz'
// let BobPrivateKey = '91h7Hh4QY5rfosztPa7Vqszfabx7Vsy8ronwtAdRo3Zxpa45Rgh'
// const BobKeyPair = ECPair.fromWIF(BobPrivateKey, network)
// let publicKey = '045514266b075ea482bb1e833acb7aa7f7815f3e81b8e23f03e4064042df6ec1e23f058d7bb31f9ef2a224c02bc70036449e4bac59f9bed52de1969ef52dc73581'
// let hashForSig = Buffer.from('3e1a51c876a14ea0c09e87d17418910fdc5fb2380af4d040f2b00c2a13906d1c')
// We`re Bob. Bob send`s BTC to Alice
/*function balanceReq() {
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 1
  console.log(requestUrl)
  Request.get(requestUrl, {}, (err, res, body) => {
    console.log(err), console.log(res), it.next(body)
  })
}*/
export async function getBalance(): Promise<any> {
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 1
  try {
    const response = await webRequest.get(requestUrl)
    console.log('Response content: ' + JSON.parse(response.content).data.confirmed_balance)
    return response
  } catch (error) {
    Promise.reject(error).catch(error => {
      console.log(error)
    })
  }
}
/* function* main(): any {
  let result = yield balanceReq()
  let resp = JSON.parse(result)
  console.log('balance: ' + resp.ParsedResult.confirmed_balance)
  console.log('Result in *main: ' + result)
  return resp
}*/

/* function* Perform(): any {
  let result = yield balanceReq()
  let ParsedResult = JSON.parse(result)
  balance = ParsedResult.data.confirmed_balance
  console.log('Status: ' + ParsedResult.status)
  console.log('balance:' + balance)
  // console.log(balance)
  // console.log(typeof(balance))
  // return balance
}
export function getBalance() {
  it.next()
  let q = it.value
  console.log('balance in getBalance: ' + q)
  return q
}
*/
function toSatoshi(BTC: number): number {
  return Number(BTC * 100000000)
}

function readLastTransactionHash() {
  return lastTransactionHash
}

/* function writeLastTransactionHash(transactionHash: string) {
  lastTransactionHash = transactionHash
}*/

function createTransaction(AliceAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number): string {
  let transaction = new TransactionBuilder(network)
  transaction.addInput(transactionHash,0)
  transaction.addOutput(AliceAdress, transactionAmount)
  console.log(transactionInputAmount, transactionAmount, transactionFee)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  console.log('fee:' + transactionFee * transactionAmount / 100)
  console.log('change: ' + change)
  transaction.addOutput(myAddr, Math.round(change))
  let txHashForSignature = transaction.tx.hashForSignature(0, Buffer.from(prevOutScript, 'hex'), Transaction.SIGHASH_ALL)
  console.log('Tx hashForSignature: ' + txHashForSignature.toString('hex'))
  let unlockingScript = getSignature(txHashForSignature.toString('hex'), 1)
  let txHex = transaction.tx.toHex()
  let data = txHex.replace('00000000','000000' + unlockingScript)
  console.log('my txHex: ' + txHex)
  console.log('data: ' + data)
  return data
}
/*function sendTransaction(transactionHash: string) {
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
      alert('Transaction sended')
      lastTransactionHash = body.txid
    } else {
      alert('Error occured')
    }
    writeLastTransactionHash(lastTransactionHash)
    console.log('Last transaction: ' + lastTransactionHash)
  })
}
*/
export function handle(paymentAdress: string, amount: number, transactionFee: number) {
  let previousTransactionHash = readLastTransactionHash()
  let requestParam: string = 'https://chain.so/api/v2/get_tx_outputs/BTCTEST' + '/' + previousTransactionHash + '/' + 0
  Request.get(requestParam ,{}, (err, res,body) => {
    console.log(err), console.log(res)
    let parsedBodyData = JSON.parse(body)
    console.log('ParsedBodyData: ' + parsedBodyData)
    if (parsedBodyData.status === 'success') {
      let unspentAmount = Number(parsedBodyData.data.outputs['value'])
      amount = toSatoshi(amount), unspentAmount = toSatoshi(unspentAmount)
      createTransaction(paymentAdress, previousTransactionHash, unspentAmount, amount, transactionFee)
    //  sendTransaction(tx)
    }
  })
}
