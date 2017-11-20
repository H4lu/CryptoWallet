import { TransactionBuilder, ECPair, networks } from 'bitcoinjs-lib'
import * as Request from 'request'
// import * as fs from 'fs'
// import * as RequestPromise from 'request-promise'

// const pathToFile = __dirname + '/../crip.txt'
let urlSmartbit = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx'
const network = networks.testnet
// const urlAPI = 'https://chain.so/api/v2/'
// mocks

let lastTransactionHash: string = '4b8f2a36bc95c313b4d843e71fc27817abd880d334ea263e23b3f0f94af75b26'

let BobPrivateKey = 'cVciA2fLpbij4JGpC4k6BwoEVueWFk91F4M7oVfSWZkactZ4HT8f'
let BobKeyPair = ECPair.fromWIF(BobPrivateKey , network)

// We`re Bob. Bob send`s BTC to Alice

function toSatoshi(BTC: number): number {
  return Number(BTC * 100000000)
}

function readLastTransactionHash(): string {

  console.log('Last transaction hash: ' + lastTransactionHash)
  return lastTransactionHash
}

function writeLastTransactionHash(transactionHash: string) {
  lastTransactionHash = transactionHash
}

function createTransaction(AliceAdress: string,transactionHash: string, transactionInputAmount: number,
   transactionAmount: number,transactionFee: number, BobKeyPair: ECPair): string {
  let transaction = new TransactionBuilder(network)
  transaction.addInput(transactionHash,1)
  transaction.addOutput(AliceAdress, transactionAmount)
  console.log(transactionInputAmount, transactionAmount, transactionFee)
  let change: number = transactionInputAmount - transactionAmount - transactionFee * transactionAmount / 100
  console.log('fee:' + transactionFee * transactionAmount / 100)
  console.log('change: ' + change)
  transaction.addOutput(BobKeyPair.getAddress(), Math.round(change))
  transaction.sign(0, BobKeyPair)
  console.log(transaction.build().toHex())
  return transaction.build().toHex()
}

function sendTransaction(transactionHash: string) {
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

export function handle(paymentAdress: string, amount: number, transactionFee: number) {
  let previousTransactionHash = readLastTransactionHash()
  let requestParam: string = 'https://chain.so/api/v2/get_tx_outputs/BTCTEST' + '/' + previousTransactionHash + '/' + 1
  Request.get(requestParam ,{}, (err, res,body) => {
    console.log(err), console.log(res)
    let parsedBodyData = JSON.parse(body)
    if (parsedBodyData.status === 'success') {
      let unspentAmount = Number(parsedBodyData.data.outputs['value'])
      amount = toSatoshi(amount), unspentAmount = toSatoshi(unspentAmount)
      let tx = createTransaction(paymentAdress, previousTransactionHash, unspentAmount, amount, transactionFee, BobKeyPair)
      sendTransaction(tx)
    }
  })

}
