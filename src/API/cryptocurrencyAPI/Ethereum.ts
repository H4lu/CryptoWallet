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
  getNonce(myAdress).catch((error) => console.log(error))
  console.log('nonce:' + web3.eth.getTransactionCount(myAdress))
  web3.eth.getTransactionCount(myAdress).then((value) => {
    console.log('value: ' + web3.utils.toHex(value))
    let rawtx: any = {
      nonce: web3.utils.toHex(value),
      from: myAdress,
      to: paymentAdress,
      gasPrice: web3.utils.toHex(gasPriceConst),
      gasLimit: web3.utils.toHex(gasLimitConst),
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      chainId: 3
    }
    let tx = new Transaction(null)
    console.log('Serialized: ' + tx.serialize().toString('hex'))
    let txHash = keccak256(tx.serialize())
    console.log('Hash without signature:' + txHash + 'length: ' + txHash.length)
    let signature: string[] = getEthereumSignature(txHash, 1)
    console.log('Signature: ' + 'r: ' + web3.utils.toHex(signature[0]) + 's: ' + web3.utils.toHex(signature[1])
     + web3.utils.toHex(signature[2]))
    rawtx.r = web3.utils.toHex(signature[0])
    rawtx.s = web3.utils.toHex(signature[1])
    rawtx.v = '0x1b'
    console.log('Raw tx: ' + rawtx)
    let newtx = new Transaction(rawtx)
    let serTx = '0x' + newtx.serialize().toString('hex')
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
