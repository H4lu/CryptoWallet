import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { getEthereumSignature } from '../hardwareAPI/GetSignature'

const myAdress = '0x619B30BE614ce453035058736cd2B83c34373Ddd'

// const web3 = new Web3('https://api.myetherapi.com/rop')
const gasPriceConst = 25000000000
const gasLimitConst = 21000
const web3 = new Web3('https://api.myetherapi.com/rop')

export function getVersion() {
  console.log('Web3 version:' + web3.version)
  console.log('FROM VALHALLA WITH LOVE')
}
/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая
*/
function createTransaction (paymentAdress: string, amount: number): string {
  console.log('nonce:' + web3.eth.getTransactionCount(myAdress))
  let rawtx = {
    nonce: web3.eth.getTransactionCount(myAdress),
    gasPrice: web3.utils.toHex(gasPriceConst),
    gasLimit: web3.utils.toHex(gasLimitConst),
    from: myAdress,
    to: paymentAdress,
    value: web3.utils.toWei(amount, 'ether'),
    chainId: 3
  }
  let tx = new Transaction.Transaction(rawtx)
  let txHash = tx.hash(false)
  let signature: string[] = getEthereumSignature(txHash.toString('hex'), 1)
  console.log('Hash without signature:' + tx.hash(false).toString('hex'))
  console.log('Signature: ' + signature[0] + ' ' + signature[1] + ' ' + signature[2])
  let signedTx = {
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
  }
  let sigTx = new Transaction.Transaction(signedTx)
  let serTx = sigTx.serialize().toString('hex')
  let dataToTransfer = sigTx.hash(true).toString('hex')
  console.log('Signed transaction:' + dataToTransfer)
  return serTx
}

// Вернёт Promise с результатом запроса
function sendTransaction(transaction: string): Promise<any> {
  return web3.eth.sendSignedTransaction(transaction)
}

export function handleEthereum(paymentAdress: string, amount: number) {
  let newTx = createTransaction(paymentAdress, amount)
  sendTransaction(newTx).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
}
