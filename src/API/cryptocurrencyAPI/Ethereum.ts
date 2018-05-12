import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import { sig } from '../hardwareAPI/GetSignature'
// import { PromiEvent, TransactionReceipt } from 'web3/types'
// import { keccak256 } from 'js-sha3'
// import fs from 'fs'
import * as webRequest from 'web-request'
import { getAddressPCSC } from '../hardwareAPI/GetAddress'
import { info } from 'electron-log'
// import getAddress from '../hardwareAPI/GetAddress'
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/hgAaKEDG9sIpNHqt8UYM'))
// const testTokenAdress = '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367'
// const apiKeyToken = 'MJTK1MQJIR91D82SMCGC6SU61MGICCJQH2'
// const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/hgAaKEDG9sIpNHqt8UYM'))
// const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'))
/*const ERC20AbiInterface: string = __dirname + '/../erc20abi.json'
const abi = JSON.parse(fs.readFileSync(ERC20AbiInterface, 'utf-8'))
info('abi ' + abi)
*/
import Container from '../../ui/Index'
let myAdress = ''
let balance: number
let price: number
export function setETHBalance(bal: number) {
  balance = bal
}
export function getETBalance() {
  return balance
}
export function setETHPrice(priceToSet: number) {
  price = priceToSet
}
export function getETHPrice() {
  return price
}
export async function initEthereumAddress() {
  info('INITING ETH ADDRESS')

  return new Promise(async (resolve) => {
    let status = false
    while (!status) {
      info('Status', status)
      let answer = await getAddressPCSC(1)
      info('GOT MYADDR ANSWER', answer)
      info('My addr length', answer.length)
      if (answer.length > 16 && answer.includes('ETH')) {
        status = true
        info('status after reset', status)
        info('resolving')
        setAddress(answer.substring(3,answer.length).toLowerCase())
        resolve(0)
      }
    }
  })
}

function setAddress(address: string) {
  myAdress = web3.utils.toChecksumAddress('0x' + address)
  info('ETH ADDRESS', myAdress)
}
export function getEthereumAddress() {
  return myAdress
}
export async function getEthereumLastTx(): Promise<any> {
  info('GETTING ETH')
  try {
    const requestURL = 'https://api.ethplorer.io/getAddressTransactions/' + myAdress + '?apiKey=freekey&limit=50'
    let response = await webRequest.get(requestURL)
    info('GOT THIS',response)
    return response
  } catch (err) {
    info(err)
  }
}
// const myAdress = '0x033baF5BEdc9fFbf2190C800bfd17e073Bf79D18'
/* const gasPriceConst = 30000000000
const gasLimitConst = 100000*/
// const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))

// const web3 = new Web3('https://ropsten.infura.io/hgAaKEDG9sIpNHqt8UYM')
// const ERC20Contract = new web3.eth.Contract(JSON.parse(abi), testTokenAdress, { from: myAdress })

export async function getETHBalance() {
  web3.eth.getGasPrice().then(value => info(value)).catch(err => info(err))
  let resp = await web3.eth.getBalance(myAdress)
  info('ETH balance: ' + resp)
  return parseValueCrypto(resp)
}

function parseValueCrypto(amount: number): Array<Number | String> {
  let ethValue = convertFromWei(amount)
  let arr = []
  arr.push('ETH')
  arr.push(Number(Number(ethValue).toFixed(8)))
  let answer = 'ETH' + ethValue.toString()
  info('RETURNING ETH BALANCE',answer)
  return arr
}

export function convertFromWei(amount: number) {
  return web3.utils.fromWei(amount, 'ether')
}
/*async function getGas(tx: any) {
  try {
    let response = await web3.eth.estimateGas(tx)
    return response
  } catch (error) {
    info(error)
  }
}
*/
/* async function getNonce() {
  try {
    let response = await web3.eth.getTransactionCount(myAdress)
    info('Nonce response: ' + response)
    info('Response to string: ' + response.toString())
    return response
  } catch (error) {
    info(error)
  }
}
*/
/* Сначала создаёт неподписанную транзакцию, после чего вычисляет её хэш и отправляет на подпись устройству
   После чего получанная подпись вставляется в новую транзакцию, которая отправляется
*/
function createTransaction (paymentAdress: string, amount: number, gasPrice: number, gasLimit: number, redirect: any) {
  info(redirect)
  web3.eth.getTransactionCount(myAdress).then((value) => {
  // Получаем порядковый номер транзакции, т.н nonce
    info('Got this values: ' + 'gasPrice: ' + gasPrice + 'gasLimit: ' + gasLimit)
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
      gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'shannon')),
      gasLimit: web3.utils.toHex(24000),
      chainId: web3.utils.toHex(1),
      data: '0x',
      v: web3.utils.toHex(1),
      r: 0,
      s: 0
    }
    info('Gas price: ' + rawtx.gasPrice)
    info('tx value: ' + rawtx.value)
    for (let item in rawtx) {
      info('item : ' + Object(rawtx)[item])
    }
      // С помощью ethereumjs-tx создаём объект транзакции
    let tx = new Transaction(rawtx)
    let txCost = tx.getUpfrontCost()
    info('Transaction cost: ' + web3.utils.fromWei(txCost, 'ether'))
    info('Unsigned: ' + tx.serialize().toString('hex'))
      // Получаем хэш для подписи
    // let txHash = keccak256(tx.serialize())
    // info('Tx hash: ' + txHash.toString())
      // Отправляем на подпись
    info('Pass this to amount: ' + amount)
    info('Amount type: ' + typeof(amount))
    // let hash = Buffer.from(txHash, 'hex')
    // let arr = [hash]
    sig(1, paymentAdress, amount).then(data => {
      /*
      info('data length: ' + sign.length)
      info(web3.utils.toHex(sign[69]))
      info('r: ' + sign.slice(5,37).toString('hex'))
      info('s: ' + sign.slice(37,69).toString('hex'))
      info('v: ' + sign[69])
      */
          // создаём объект подписи
          // cost: 600000130000000
      /*let sig = {
        v : web3.utils.toHex(sign[69] + 10),
        r : sign.slice(5,37),
        s : sign.slice(37,69)
      }*/
      info('SIGNING BY THIS KEY', data.slice(3,35))
      tx.sign(data.slice(3,35))
      // info('V in sig: ' + sig.v)
          // Вставляем подпись в транзакцию
      // Object.assign(tx, sig)
          // Приводим транзакцию к нужному для отправки виду
      let serTx = '0x' + tx.serialize().toString('hex')
      info(serTx)
      web3.eth.sendSignedTransaction(serTx).on('receipt', info).on('transactionHash', function(hash) {
        info('Transaction sended: ' + hash)
        info('CONTAINER', Container)
        redirect()
      }).on('error', console.error).catch(err => info(err))
        // Отправляем

    }).catch(err => info(err))
  }).catch(err => info(err))
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
  info('in sendtransaction')
  return web3.eth.sendSignedTransaction(transaction).on('receipt', info).on('transactionHash', function(hash) {
    info('Hash: ' + hash)
  }).on('error', console.error)
}

/* export async function balanceOf (tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  let balance = await ERC20Token.methods.balanceOf(myAdress).call()
  info('Balance: ' + balance)
  totalSupply(tokenAdress)
  // return ERC20Token.methods.balanceOf(myAdress).call()
  return balance
}
*/
/* export function transferToken(tokenAdress: string, spenderAdress: string, amountToTransfer: number) {
  info('Amount to transfer: ' + amountToTransfer)
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
    info(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    info('Base fee: ' + tx.getBaseFee())
    info('Data fee: ' + tx.getDataFee())
    web3.eth.estimateGas(Object.assign(rawTx, sig), (error, result) => {
      info(error)
      info('Res of estimate gas: ' + result)
    }).catch(error => info(error))
    let serTx = '0x' + tx.serialize().toString('hex')
    info(serTx)
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch(err => {
      info(err)
    })
  }).catch(error => { info(error) })
 //  return ERC20Token.methods.transfer(spenderAdress, amountToTransfer).
}

export function totalSupply(tokenAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  ERC20Token.methods.totalSupply().call().then((value: any) => {
    info('Total supply: ' + value)
  }).catch((err: any) => info(err))
  ERC20Token.methods.name().call().then(value => {
    info('Token name: ' + value)
  }).catch(error => info(error))
  ERC20Token.methods.decimals().call().then(value => {
    info('Decimals: ' + value)
  }).catch(error => info(error))
}

/* export function transferFrom(tokenAdress: string, adressFrom: string, adressTo: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
}*/

/* export function approve(tokenAdress: string, spenderAdress: string, amount: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  info('Allowed amount:' + amount)
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
    info(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    info(serTx)
    ERC20Token.events.Approval({},(error, result) => {
      info('Error: ' + error)
      info('Result: ' + result.returnValues)
    }).on('data', event => {
      info(event.returnValues)
      info(event)
    }).on('changed', event => {
      info(event)
    }).on('error', error => {
      info(error)
    })
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch((err) => {
      info(err)
    })
  }).catch(error => { info(error) })
}

export function allowance(tokenAdress: string, ownerAdress: string, spenderAdress: string) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  ERC20Token.methods.allowance(ownerAdress, spenderAdress).call().then(response => {
    info('Response of allowance: ' + response)
  }).catch(err => {
    info(err)
  })
}

export function transferFrom(tokenAdress: string, adressFrom: string, adressTo: string, amount: number, gasPrice: number, gasLimit: number) {
  let ERC20Token = new web3.eth.Contract(abi, tokenAdress, { from: myAdress })
  info('Allowed amount:' + amount)
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
    info(web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14))
    let sig = {
      v : web3.utils.toHex(signature.slice(64,65).readInt32LE(0) + 14),
      r : signature.slice(0,32),
      s : signature.slice(32,64)
    }
    Object.assign(tx, sig)
    let serTx = '0x' + tx.serialize().toString('hex')
    info(serTx)
    ERC20Token.events.Transfer({},(error, result) => {
      info('Error: ' + error)
      info('Result: ' + result.returnValues)
    }).on('data', event => {
      info(event.returnValues)
      info(event)
    }).on('changed', event => {
      info(event)
    }).on('error', error => {
      info(error)
    })
    sendTransaction(serTx).on('transactionHash', (hash) => {
      alert('Transaction sended! Hash: ' + hash)
    }).on('error', error => {
      alert(error)
    }).catch(err => {
      info(err)
    })
  }).catch(error => { info(error) })
}
*/
