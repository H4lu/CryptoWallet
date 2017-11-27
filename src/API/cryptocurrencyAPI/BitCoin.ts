import { TransactionBuilder, networks, ECPair } from 'bitcoinjs-lib'
import * as Request from 'request'
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
let balance: any
let it = Perform()
let myAddr: string = 'mhyUjiGtUvKQc5EuBAYxxE2NTojZywJ7St'
let lastTransactionHash: string = 'ec70c255d8cdf95a41cc1ef78723311240a4388d49fb1f8c39cf514d98ce0730'
// let prevOutScript = Buffer.from('76a9141af47a856f5f8d0b0b1f37fd6cfe5336cd89324f88ac')
// let BobPrivateKey = 'cVciA2fLpbij4JGpC4k6BwoEVueWFk91F4M7oVfSWZkactZ4HT8f'
let BobPrivateKey = '91h7Hh4QY5rfosztPa7Vqszfabx7Vsy8ronwtAdRo3Zxpa45Rgh'
const BobKeyPair = ECPair.fromWIF(BobPrivateKey, network)
// let publicKey = '045514266b075ea482bb1e833acb7aa7f7815f3e81b8e23f03e4064042df6ec1e23f058d7bb31f9ef2a224c02bc70036449e4bac59f9bed52de1969ef52dc73581'
// let hashForSig = Buffer.from('3e1a51c876a14ea0c09e87d17418910fdc5fb2380af4d040f2b00c2a13906d1c')
// We`re Bob. Bob send`s BTC to Alice
function balanceReq() {
  let requestUrl = 'https://chain.so/api/v2/get_address_balance/' + NETWORK + '/' + myAddr + '/' + 1
  console.log(requestUrl)
  Request.get(requestUrl, {}, (err, res, body) => {
    console.log(err), console.log(res), it.next(body)
  })
}
/* function* main(): any {
  let result = yield balanceReq()
  let resp = JSON.parse(result)
  console.log('balance: ' + resp.ParsedResult.confirmed_balance)
  console.log('Result in *main: ' + result)
  return resp
}*/

function* Perform(): any {
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

function toSatoshi(BTC: number): number {
  return Number(BTC * 100000000)
}

function readLastTransactionHash(): string {

  console.log('Last transaction hash: ' + lastTransactionHash)
  return lastTransactionHash
}

/* function writeLastTransactionHash(transactionHash: string) {
  lastTransactionHash = transactionHash
}*/

/*function createTransaction(AliceAdress: string,transactionHash: string, transactionInputAmount: number,
   transactionAmount: number,transactionFee: number): string {
  let transaction = new TransactionBuilder(network)
  transaction.addInput(transactionHash,0)
  transaction.addOutput(AliceAdress, transactionAmount)
  console.log(transactionInputAmount, transactionAmount, transactionFee)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  console.log('fee:' + transactionFee * transactionAmount / 100)
  console.log('change: ' + change)
  transaction.addOutput(myAddr, Math.round(change))
  let unbuildedTx = transaction.buildIncomplete().toHex()
  unbuildedTx = unbuildedTx.replace('0000000000', '00000000' + prevOutScript.toString())
  unbuildedTx = unbuildedTx.concat('01000000')
  console.log('transaction hex before(build incomplete): ' + unbuildedTx)
  let txHash = crypto.sha256(crypto.sha256(Buffer.from(unbuildedTx)))
  console.log(txHash.toString())
 // transaction.sign(0, BobKeyPair)
  // let hashForSignature = transaction.tx.hashForSignature(0, prevOutScript, Transaction.SIGHASH_ALL)
  // console.log('hash for signature: ' + hashForSignature.toString())
  let signedTx = getSignature(txHash, 2)
  console.log('signed: ' + signedTx)
  return transaction.tx.toHex()
}
*/
function createTransaction(AliceAdress: string,transactionHash: string, transactionInputAmount: number,
  transactionAmount: number,transactionFee: number, BobKeyPair: ECPair): string {
  let transaction = new TransactionBuilder(network)
  transaction.addInput(transactionHash,1)
  transaction.addOutput(AliceAdress, transactionAmount)
  console.log(transactionInputAmount, transactionAmount, transactionFee)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  console.log('fee:' + transactionFee * transactionAmount / 100)
  console.log('change: ' + change)
  transaction.addOutput(myAddr, Math.round(change))
  /* let unbuildedTx = transaction.buildIncomplete().toHex()
  unbuildedTx = unbuildedTx.replace('0000000000', '00000000' + prevOutScript.toString())
  unbuildedTx = unbuildedTx.concat('01000000')
  console.log('transaction hex before(build incomplete): ' + unbuildedTx)
  let txHash = crypto.sha256(crypto.sha256(Buffer.from(unbuildedTx)))*/
  // console.log(txHash.toString())
  let txHex = transaction.tx.toHex()
  console.log('txHex: ' + txHex)
  transaction.sign(0, BobKeyPair)
  console.log('Builded Tx: ' + transaction.build().toHex())
  // let hashForSignature = transaction.tx.hashForSignature(0, prevOutScript, Transaction.SIGHASH_ALL)
  // console.log('hash for signature: ' + hashForSignature.toString())
  // let signedTx = getSignature(txHash, 2)
  // let txHex = transaction.build().toHex()
  return txHex
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
  /* let requestParam: string = 'https://chain.so/api/v2/get_tx_outputs/BTCTEST' + '/' + previousTransactionHash + '/' + 1
  Request.get(requestParam ,{}, (err, res,body) => {
    console.log(err), console.log(res)
    let parsedBodyData = JSON.parse(body)
    console.log('ParsedBodyData: ' + parsedBodyData)
    if (parsedBodyData.status === 'success') {
      let unspentAmount = Number(parsedBodyData.data.outputs['value'])
      amount = toSatoshi(amount), unspentAmount = toSatoshi(unspentAmount)
      createTransaction(paymentAdress, previousTransactionHash, unspentAmount, amount, transactionFee, BobKeyPair)
    //  sendTransaction(tx)
    }
  })*/
  createTransaction(paymentAdress, previousTransactionHash, 799890,toSatoshi(amount),transactionFee, BobKeyPair)
}
