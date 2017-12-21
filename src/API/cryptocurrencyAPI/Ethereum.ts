import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { getEthereumSignature } from '../hardwareAPI/GetSignature'
import { PromiEvent, TransactionReceipt } from 'web3/types'
import { keccak256 } from 'js-sha3'

// const web3 = new Web3('https://api.myetherapi.com/rop')
const myAdress = '0xC7f0d18EdfF316A9cAA5d98fF26369216b38d9e1'
const gasPriceConst = 25000000000
const gasLimitConst = 21000
const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'))
export function getVersion() {
  console.log('Web3 version:' + web3.version)
  web3.eth.getBalance(myAdress).then((value) => console.log('Balance: ' + value)).catch(error => console.log(error))
}

async function getNonce(adress: string) {
  try {
    let response = await web3.eth.getTransactionCount(adress)
    console.log('Response: ' + response)
    let value = Promise.resolve(response)
    console.log('Promise.resolve: ' + value)
    return response
  } catch (error) {
    console.log(error)
  }
}
/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая
*/
function createTransaction (paymentAdress: string, amount: number): void {
  console.log(amount)
  getNonce(myAdress).catch((error) => console.log(error))
  console.log('nonce:' + web3.eth.getTransactionCount(myAdress))
  web3.eth.getTransactionCount(myAdress).then((value) => {
    console.log('value: ' + web3.utils.toHex(value))
    let rawtx = {
      nonce: web3.utils.toHex(value),
      gasPrice: web3.utils.toHex(gasPriceConst),
      gasLimit: web3.utils.toHex(gasLimitConst),
      value: web3.utils.toHex(100000),
      to: paymentAdress,
      chainId: web3.utils.toHex(3),
      data: '0x',
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawtx)
    console.log('Serialized: ' + tx.serialize().toString('hex'))
    let txHash = keccak256(tx.serialize())
    console.log('ChainId before sig: ' + tx.getChainId())
    console.log('Hash without signature:' + txHash + 'length: ' + txHash.length)
    let signature: Buffer[] = getEthereumSignature(txHash, 1)
    console.log('R value: ' + signature[0].slice(0,32).toString('hex') + ' Length: ' + signature[0].slice(0,32).toString('hex').length + ' S value: ' + signature[0].slice(32,64).toString('hex') + ' length: '
     + signature[0].slice(32,64).toString('hex').length + 'buffer length: ' + signature[0].slice(0,32).length)
    console.log('From second: ' + signature[1].slice(0,32).toString('hex') + ' Length: ' + signature[1].slice(0,32).toString('hex').length + ' S value: ' + signature[1].slice(32,64).toString('hex') + ' length: '
     + signature[1].slice(32,64).toString('hex').length)
    let sig = {
      v : '0x2a',
      r : signature[1].slice(0,32),
      s : signature[1].slice(32,64)
    }
    Object.assign(tx, sig)
    console.log('chainid after assign:' + tx.getChainId())
     // console.log('Signature: ' + 'r: ' + '0x' + signature.slice(0,64) + ' s: ' + '0x' + signature.slice(64,128))
    /* let testTx: any = {
      nonce: web3.utils.toHex(value + 1),
      gasPrice: web3.utils.toHex(gasPriceConst),
      gasLimit: web3.utils.toHex(gasLimitConst),
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      to: paymentAdress,
      chainId: web3.utils.toHex(3),
      data: '0x',
      v : '0x2a',
      r : signature[0].slice(0,32),
      s : signature[0].slice(32,64)
    }*/
    /*rawtx.v = '2a'
    rawtx.r = signature.slice(0,32)
    rawtx.s = signature.slice(32,64)*/
    // let newtx = new Transaction(testTx)
    // console.log('ChainId: ' + newtx.getChainId())
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log('Serialized tx: ' + serTx)
    sendTransaction(serTx).on('receipt', console.log)
  }).catch(
    (err) => console.log(err)
  )
  /*let rawtx: any = {
    nonce: web3.eth.getTransactionCount(myAdress),
    gasPrice: web3.utils.toHex(gasPriceConst),
    gasLimit: web3.utils.toHex(gasLimitConst),
    from: myAdress,
    to: paymentAdress,
    value: web3.utils.toWei(amount, 'ether'),
    chainId: 3
  }*/

  /* let signedTx = {
    nonce: web3.eth.getTransactionCount(myAdress),
    gasPrice: web3.utils.toHex(gasPriceConst),
    gasLimit: web3.utils.toHex(gasLimitConst),
    from: myAdress,
    to: paymentAdress,
    value: web3.utils.toWei(amount, 'ether'),
    chainId: 3,
    v: signature[2],
    r: signature[0],
    s: signature[1]
  }*/

}

// Вернёт Promise с результатом запроса
function sendTransaction(transaction: string): PromiEvent<TransactionReceipt> {
  console.log('in sendtransaction')
  return web3.eth.sendSignedTransaction(transaction)
}

export function handleEthereum(paymentAdress: string, amount: number) {
  let newTx = createTransaction(paymentAdress, amount)
  console.log(newTx)
  /* sendTransaction(newTx).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })*/
}
