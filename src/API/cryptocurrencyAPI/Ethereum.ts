import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { getSig, openPort } from '../hardwareAPI/GetSignature'
// import { PromiEvent, TransactionReceipt } from 'web3/types'
import { keccak256 } from 'js-sha3'
// import fs from 'fs'
import getAddress from '../hardwareAPI/GetAddress'
import * as webRequest from 'web-request'
// import getAddress from '../hardwareAPI/GetAddress'
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/hgAaKEDG9sIpNHqt8UYM'))
// const testTokenAdress = '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367'
// const apiKeyToken = 'MJTK1MQJIR91D82SMCGC6SU61MGICCJQH2'
// const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/hgAaKEDG9sIpNHqt8UYM'))
// const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'))
/*const ERC20AbiInterface: string = __dirname + '/../erc20abi.json'
const abi = JSON.parse(fs.readFileSync(ERC20AbiInterface, 'utf-8'))
console.log('abi ' + abi)
*/
let myAdress = ''
export function initEthereumAddress() {
  myAdress = web3.utils.toChecksumAddress(getAddress(1))
  console.log('ETH address: ' + myAdress)
}
export function getEthereumAddress() {
  return myAdress
}
export async function getEthereumLastTx(): Promise<any> {
  try {
    const requestURL = 'https://api.ethplorer.io/getAddressTransactions/' + myAdress + '?apiKey=freekey'
    let response = await webRequest.get(requestURL)
    return response
  } catch (err) {
    console.log(err)
  }
}
// const myAdress = '0x033baF5BEdc9fFbf2190C800bfd17e073Bf79D18'
/* const gasPriceConst = 30000000000
const gasLimitConst = 100000*/
// const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))

// const web3 = new Web3('https://ropsten.infura.io/hgAaKEDG9sIpNHqt8UYM')
// const ERC20Contract = new web3.eth.Contract(JSON.parse(abi), testTokenAdress, { from: myAdress })

export function getEthereumBalance() {
  web3.eth.getGasPrice().then(value => console.log(value)).catch(err => console.log(err))
  let resp = web3.eth.getBalance(myAdress)
  console.log('ETH balance: ' + resp)
  return resp
}

export function convertFromWei(amount: number) {
  return web3.utils.fromWei(amount, 'ether')
}
/*async function getGas(tx: any) {
  try {
    let response = await web3.eth.estimateGas(tx)
    return response
  } catch (error) {
    console.log(error)
  }
}
*/
/* async function getNonce() {
  try {
    let response = await web3.eth.getTransactionCount(myAdress)
    console.log('Nonce response: ' + response)
    console.log('Response to string: ' + response.toString())
    return response
  } catch (error) {
    console.log(error)
  }
}
*/
/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая отправляется
*/
function createTransaction (paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any) {
  web3.eth.getTransactionCount(myAdress).then((value) => {
  // Получаем порядковый номер транзакции, т.н nonce
    console.log('Got this values: ' + 'gasPrice: ' + gasPrice + 'gasLimit: ' + gasLimit)
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
      value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
      nonce: web3.utils.toHex(value),
      from: myAdress,
      to: paymentAdress,
      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'shannon')),
      gasLimit: web3.utils.toHex(30000),
      chainId: web3.utils.toHex(1),
      data: '0x00',
      v: web3.utils.toHex(1),
      r: 0,
      s: 0
    }
    console.log('Gas price: ' + rawtx.gasPrice)
    console.log('tx value: ' + rawtx.value)
    for (let item in rawtx) {
      console.log('item : ' + Object(rawtx)[item])
    }
      // С помощью ethereumjs-tx создаём объект транзакции
    let tx = new Transaction(rawtx)
    let txCost = tx.getUpfrontCost()
    console.log('Transaction cost: ' + web3.utils.fromWei(txCost, 'ether'))
    console.log('Unsigned: ' + tx.serialize().toString('hex'))
      // Получаем хэш для подписи
    let txHash = keccak256(tx.serialize())
    console.log('Tx hash: ' + txHash.toString())
      // Отправляем на подпись
    openPort().then(() => {
      getSig(1,txHash, paymentAdress, amount).then(sign => {
        console.log('data length: ' + sign.length)
        console.log(web3.utils.toHex(sign[69]))
        console.log('r: ' + sign.slice(5,37).toString('hex'))
        console.log('s: ' + sign.slice(37,69).toString('hex'))
        console.log('v: ' + sign[69])
          // создаём объект подписи
          // cost: 600000130000000
        let sig = {
          v : web3.utils.toHex(sign[69] + 10),
          r : sign.slice(5,37),
          s : sign.slice(37,69)
        }
        console.log('V in sig: ' + sig.v)
          // Вставляем подпись в транзакцию
        Object.assign(tx, sig)
          // Приводим транзакцию к нужному для отправки виду
        let serTx = '0x' + tx.serialize().toString('hex')
        console.log(serTx)
        web3.eth.sendSignedTransaction(serTx).on('receipt', console.log).on('transactionHash', function(hash) {
          console.log('Transaction sended: ' + hash)
          redirect()
        }).on('error', console.error).catch(err => console.log(err))
        // Отправляем

      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}
export function handleEthereum(paymentAdress: string, amount: number, gasPrice: number, gasLimit: number,redirect: any) {
  createTransaction(paymentAdress, amount, gasPrice, gasLimit, redirect)
  /* sendTransaction(newTx).on('transactionHash', (hash) => {
    alert('Transaction sended! Hash: ' + hash)
  }).on('error', error => {
    alert(error)
  })
  */
}
// Вернёт Promise с результатом запроса
/*function sendTransaction(transaction: string): PromiEvent<TransactionReceipt> {
  console.log('in sendtransaction')
  return web3.eth.sendSignedTransaction(transaction).on('receipt', console.log).on('transactionHash', function(hash) {
    console.log('Hash: ' + hash)
  }).on('error', console.error)
}

/* export async function balanceOf (tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  let balance = await ERC20Token.methods.balanceOf(myAdress).call()
  console.log('Balance: ' + balance)
  totalSupply(tokenAdress)
  // return ERC20Token.methods.balanceOf(myAdress).call()
  return balance
}
*/
/* export function transferToken(tokenAdress: string, spenderAdress: string, amountToTransfer: number) {
  console.log('Amount to transfer: ' + amountToTransfer)
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  web3.eth.getTransactionCount(myAdress).then(value => {
    let rawTx: any = {
      value: '0x0',
      nonce: value,
      from: myAdress,
      to: tokenAdress,
      gasPrice: web3.utils.toHex(40000000000),
      gasLimit: web3.utils.toHex(210000),
      data: ERC20Token.methods.transfer(spenderAdress, web3.utils.toHex(amountToTransfer)).encodeABI(),
      chainId: web3.utils.toHex(3),
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawTx)
    let txHash = keccak256(tx.serialize())
    let signature: Buffer = getEthereumSignature(txHash)
    // создаём объект подписи
    console.log(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    console.log('Base fee: ' + tx.getBaseFee())
    console.log('Data fee: ' + tx.getDataFee())
    web3.eth.estimateGas(Object.assign(rawTx, sig), (error, result) => {
      console.log(error)
      console.log('Res of estimate gas: ' + result)
    }).catch(error => console.log(error))
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log(serTx)
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch(err => {
      console.log(err)
    })
  }).catch(error => { console.log(error) })
 //  return ERC20Token.methods.transfer(spenderAdress, amountToTransfer).
}

export function totalSupply(tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  ERC20Token.methods.totalSupply().call().then((value: any) => {
    console.log('Total supply: ' + value)
  }).catch((err: any) => console.log(err))
  ERC20Token.methods.name().call().then(value => {
    console.log('Token name: ' + value)
  }).catch(error => console.log(error))
  ERC20Token.methods.decimals().call().then(value => {
    console.log('Decimals: ' + value)
  }).catch(error => console.log(error))
}

/* export function transferFrom(tokenAdress: string, adressFrom: string, adressTo: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
}*/

/* export function approve(tokenAdress: string, spenderAdress: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  console.log('Allowed amount:' + amount)
  web3.eth.getTransactionCount(myAdress).then(value => {
    let rawTx: any = {
      value: '0x0',
      nonce: value,
      from: myAdress,
      to: tokenAdress,
      gasPrice: web3.utils.toHex(45000000000),
      gasLimit: web3.utils.toHex(60000),
      data: ERC20Token.methods.approve(spenderAdress, web3.utils.toHex(amount)).encodeABI(),
      chainId: web3.utils.toHex(3),
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawTx)
    let txHash = keccak256(tx.serialize())
    let signature: Buffer = getEthereumSignature(txHash)
    // создаём объект подписи
    console.log(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log(serTx)
    ERC20Token.events.Approval({},(error, result) => {
      console.log('Error: ' + error)
      console.log('Result: ' + result.returnValues)
    }).on('data', event => {
      console.log(event.returnValues)
      console.log(event)
    }).on('changed', event => {
      console.log(event)
    }).on('error', error => {
      console.log(error)
    })
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch((err) => {
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

export function transferFrom(tokenAdress: string, adressFrom: string, adressTo: string, amount: number, gasPrice: number, gasLimit: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  console.log('Allowed amount:' + amount)
  web3.eth.getTransactionCount(myAdress).then(value => {
    let rawTx: any = {
      value: '0x0',
      nonce: value,
      from: myAdress,
      to: tokenAdress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      data: ERC20Token.methods.transferFrom(adressFrom,adressTo, web3.utils.toHex(amount)).encodeABI(),
      chainId: web3.utils.toHex(3),
      v: web3.utils.toHex(3),
      r: 0,
      s: 0
    }
    let tx = new Transaction(rawTx)
    let txHash = keccak256(tx.serialize())
    let signature: Buffer = getEthereumSignature(txHash)
    // создаём объект подписи
    console.log(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    console.log(serTx)
    ERC20Token.events.Transfer({},(error, result) => {
      console.log('Error: ' + error)
      console.log('Result: ' + result.returnValues)
    }).on('data', event => {
      console.log(event.returnValues)
      console.log(event)
    }).on('changed', event => {
      console.log(event)
    }).on('error', error => {
      console.log(error)
    })
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch(err => {
      console.log(err)
    })
  }).catch(error => { console.log(error) })
}
*/
