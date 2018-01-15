import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { getEthereumSignature } from '../hardwareAPI/GetSignature'
import { PromiEvent, TransactionReceipt } from 'web3/types'
import { keccak256 } from 'js-sha3'
import fs from 'fs'
// const testTokenAdress = '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367'

// const web3 = new Web3('https://api.myetherapi.com/rop')
const ERC20AbiInterface: string = __dirname + '/../erc20abi.json'
const abi = JSON.parse(fs.readFileSync(ERC20AbiInterface, 'utf-8'))
console.log('abi ' + abi.toString())
const myAdress = '0xC7f0d18EdfF316A9cAA5d98fF26369216b38d9e1'
/* const gasPriceConst = 30000000000
const gasLimitConst = 100000*/
const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'))
// const ERC20Contract = new web3.eth.Contract(JSON.parse(abi), testTokenAdress, { from: myAdress })

export function getEthereumBalance() {
  console.log('Web3 version:' + web3.version)
  return web3.eth.getBalance(myAdress)
}

/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая отправляется
*/
function createTransaction (paymentAdress: string, amount: number, gasPrice: number, gasLimit: number): void {
  // Получаем порядковый номер транзакции, т.н nonce
  web3.eth.getTransactionCount(myAdress).then((value) => {
    console.log('Got this values: ' + 'gasPrice: ' + gasPrice + ' gasLimit: ' + gasLimit)
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
      gasPrice: web3.utils.toHex(Number(gasPrice)),
      gasLimit: web3.utils.toHex(Number(gasLimit)),
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
    console.log(web3.utils.toHex(signature[2].readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature[2].readInt32LE(0) + 14),
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
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    })
  }).catch(
    (err) => console.log(err)
  )

}

// Вернёт Promise с результатом запроса
function sendTransaction(transaction: string): PromiEvent<TransactionReceipt> {
  console.log('in sendtransaction')
  return web3.eth.sendSignedTransaction(transaction)
}

export function handleEthereum(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number) {
  let newTx = createTransaction(paymentAdress, amount, gasPrice, gasLimit)
  console.log(newTx)
}

export function balanceOf (tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  totalSupply(tokenAdress)
  return ERC20Token.methods.balanceOf(myAdress).call()
}

export function transferToken(tokenAdress: string, spenderAdress: string, amountToTransfer: number) {
  console.log('Amount to transfer: ' + amountToTransfer)
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress, gas: 1000000 })
  web3.eth.getTransactionCount(myAdress).then(value => {
    let rawTx: any = {
      value: '0x0',
      nonce: value,
      from: myAdress,
      to: tokenAdress,
      gasPrice: web3.utils.toHex(45000000000),
      gasLimit: web3.utils.toHex(100000),
      data: ERC20Token.methods.transfer(spenderAdress, web3.utils.toHex(amountToTransfer)).encodeABI(),
      chainId: web3.utils.toHex(3),
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawTx)
    let txHash = keccak256(tx.serialize())
    let signature: Buffer[] = getEthereumSignature(txHash,1)
    let sig = {
      v : web3.utils.toHex(signature[2].readInt32LE(0) + 14),
      r : signature[1].slice(0,32),
      s : signature[1].slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log(serTx)
    /* sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).catch(err => {
      console.log(err)
    })*/
  }).catch(error => { console.log(error) })
 //  return ERC20Token.methods.transfer(spenderAdress, amountToTransfer).
}

export function totalSupply(tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  ERC20Token.methods.totalSupply().call().then(value => {
    console.log('Total supply: ' + value)
  }).catch(err => console.log(err))
}

/* export function transferFrom(tokenAdress: string, adressFrom: string, adressTo: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
}*/
export function approve(tokenAdress: string, spenderAdress: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  console.log('Allowed amount:' + amount)
  web3.eth.getTransactionCount(myAdress).then(value => {
    let rawTx: any = {
      value: '0x0',
      nonce: value,
      from: myAdress,
      to: tokenAdress,
      gasPrice: web3.utils.toHex(45000000000),
      gasLimit: web3.utils.toHex(100000),
      data: ERC20Token.methods.approve(spenderAdress, web3.utils.toHex(amount)).encodeABI(),
      chainId: web3.utils.toHex(3),
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawTx)
    let txHash = keccak256(tx.serialize())
    let signature: Buffer[] = getEthereumSignature(txHash,1)
    let sig = {
      v : web3.utils.toHex(signature[2].readInt32LE(0) + 14),
      r : signature[1].slice(0,32),
      s : signature[1].slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log(serTx)
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).catch(err => {
      console.log(err)
    })
  }).catch(error => { console.log(error) })
}

export function allowance(tokenAdress: string, ownerAdress: string, spenderAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  ERC20Token.methods.allowance(ownerAdress, spenderAdress).call().then(response => {
    console.log('Response of allowance: ' + response)
  }).catch(err => {
    console.log(err)
  })
}
