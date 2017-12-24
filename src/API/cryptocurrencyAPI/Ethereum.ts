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

/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая отправляется
*/
function createTransaction (paymentAdress: string, amount: number): void {
  // Получаем порядковый номер транзакции, т.н nonce
  web3.eth.getTransactionCount(myAdress).then((value) => {
    /* Создаём неподписанную транзакцию. Она включает в себя:
       nonce - порядковый номер
       gasPrice и gasLimit - константы, использующиеся для подсчёта комиссии
       value - сумма транзакции в wei
       to - адрес получателя
       chainId - обозначает сеть, в которой будет отправлена траназкция
       К примеру, ropsten - 3, mainnet - 1, значение согласно EIP155
       data - содержит собой код, но т.к у нас обычная транзакция, то это поле пусто
       v,r,s - данные цифровой подписи, согласно EIP155 r и s - 0, v  = chainId
    */
    let rawtx = {
      nonce: web3.utils.toHex(value),
      gasPrice: web3.utils.toHex(gasPriceConst),
      gasLimit: web3.utils.toHex(gasLimitConst),
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      to: paymentAdress,
      chainId: web3.utils.toHex(3),
      data: '0x',
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    // С помощью ethereumjs-tx создаём объект транзакции
    let tx = new Transaction(rawtx)
    // Получаем хэш для подписи
    let txHash = keccak256(tx.serialize())
    // Отправляем на подпись
    let signature: Buffer[] = getEthereumSignature(txHash, 1)
    // создаём объект подписи
    let sig = {
      v : signature[2],
      r : signature[1].slice(0,32),
      s : signature[1].slice(32,64)
    }
    // Вставляем подпись в транзакцию
    Object.assign(tx, sig)
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
    // Приводим транзакцию к нужному для отправки виду
    let serTx = '0x' + tx.serialize().toString('hex')
    // Отправляем
    sendTransaction(serTx).on('receipt', console.log)
  }).catch(
    (err) => console.log(err)
  )

}

// Вернёт Promise с результатом запроса
function sendTransaction(transaction: string): PromiEvent<TransactionReceipt> {
  console.log('in sendtransaction')
  return web3.eth.sendSignedTransaction(transaction)
}

export function handleEthereum(paymentAdress: string, amount: number) {
  let newTx = createTransaction(paymentAdress, amount)
  console.log(newTx)
}
