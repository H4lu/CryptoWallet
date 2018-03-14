import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'
import SerialPort from 'serialport'
/* import * as Path from 'path'
// declare var __dirname: string
// let path = __dirname + './../../iTokenDLL'
const path = Path.join(__dirname,'../..','iTokenDLL')
const kernelPath = Path.join(__dirname, '../..', 'kernel32')
console.log('path is:' + path)
const kernel = ffi.Library(kernelPath, {'SetDllDirectoryW': ['bool', ['string']]
})
console.log('before set dll')
kernel.SetDllDirectoryW(Path.join(__dirname, '../..','mtoken_stb.dll'))
console.log('after set dll')
const MyLib = ffi.Library(path, { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })
*/
const pin = Buffer.from('12345678')
/* Создаём объект, содержащий название библиотеки для взаимодействие с крипоустройством
   и описание её интерфейса (тип возвращаемого возвращаемого параметра и аргументы функций)
*/
const MyLib = ffi.Library('iTokenDLL', { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']],
  'getSignEthereum': ['int', ['string','int','char*','string','string','int*']] })

/*  Функция цифровой подписи для Bitcoin
    Принимает на вход хэш неподписанной транзакции и номер адреса
    на криптоустройстве
    Отдаст сериализованную подпись + публичный ключ в hex - формате
*/
export function getSignature(transactionHash: string, adressNumber: number) {
  // Выделяем участок памяти, куда будет записан UnlocingScript
  let unlockingScriptHex = new Buffer(282)
  let unlockingScriptHexLength = ref.alloc('int')
  let errorCode = MyLib.get_dataForTransaction(transactionHash, adressNumber, pin, unlockingScriptHex,
                                              unlockingScriptHexLength)
  /* При удачном вызове функция вернёт код ошибки 0, если этого не произошло
     то по коду ошибки выясняем причину сбоя и сообщаем об этом пользователю
  */

  if (errorCode !== 0) {
    switch (errorCode) {
    case 1: {
      alert('Invalid PIN')
      break
    }
    case 2: {
      alert('Device is not connected')
      break
    }
    case 3: {
      alert('The signature is not correct')
      break
    }
    }
  }
  // Получаем unlockingScript для транзакции. Он включает в себя подпись в DER формате + публичный ключ + байты, отвечающие за размер
  let loweredScriptHex = unlockingScriptHex.toString().toLowerCase()
  let scriptLength = ref.deref(unlockingScriptHexLength)
  // Убираем лишние нули, если размер скрипта < 280
  if (scriptLength < 282) {
    loweredScriptHex = loweredScriptHex.substring(0, scriptLength)
  }
  return loweredScriptHex
}
const cryptoLib = ffi.Library('CWAPI',{ 'getSign': ['int', ['int','string','int','int*','string']] })
const MAX_LENGTH = 214

export function getEthereumSignature(transactionHash: string): Buffer {
  let id = 1
  let length = ref.alloc(ref.types.int)
  let sig = new Buffer(65)
  let messageLen: number = 64
  const errorCode = cryptoLib.getSign(messageLen, transactionHash, id, length, sig)
  console.log(errorCode)
  /*let sValue = new Buffer(64)
  let sig = new Buffer(64)
  let vValue = ref.alloc('int')
  let errorCode = MyLib.getSignEthereum(transactionHash, adressNumber, pin, sig, sValue, vValue)
  if (errorCode !== 1) {
    switch (errorCode) {
    case 2: alert('Device is not connected')
      break
    case 3: alert('The signature is not correct')
      break
    }
  }
  console.log(vValue.readInt32LE(0))
  // console.log('r value: ' + rValue.toString('hex') + 's value: ' + sValue.toString('hex') + 'v Value: ' + ref.deref(vValue))
  return new Array(sig, sValue, vValue)
  */
  return sig
}

export default function getSign(id: number, message: string) {
  let length = ref.alloc(ref.types.int)
  let sig = new Buffer(MAX_LENGTH)
  let messageLen: number = 64
  const errorCode = cryptoLib.getSign(messageLen, message, id, length, sig)
  console.log(errorCode)
  let lengthValue = ref.deref(length)
  if (id !== 1) {
    let serializedSig: string
    if (lengthValue < MAX_LENGTH) {
      serializedSig = sig.toString().substring(0, lengthValue)
      console.log(serializedSig)
      return serializedSig.toLowerCase()
    } else {
      serializedSig = sig.toString()
      console.log('Serialized sig: ' + serializedSig)
      return serializedSig.toLowerCase()
    }
  } else {
    return sig
  }
}
const PORT_PATH = 'COM25'
let port = new SerialPort(PORT_PATH, { autoOpen: false, baudRate: 115200 })
export function openPort() {
  port.open()
  return new Promise((resolve, reject) => {
    port.on('open', data => {
      console.log('Port opened! data: ' + data)
      resolve()
    })
    port.on('error', error => {
      console.log('Error occured while opening: ' + console.log(error))
      reject(error)
    })
    port.on('disconnect',() => {
      console.log('disconnect detected')
      port.close(() => {
        console.log('Port closed by disconnect!')
      })
    })
    port.on('close', () => {
      console.log('Port closed!')
    })
  })
}
export function getSig(id: number, message: string, address: string, amount: number): Promise<Buffer> {
  let currencyId: number = 0x00
  switch (id) {
  case 0: {
    currencyId = 0x00
    break
  }
  case 1: {
    currencyId = 0x01
    break
  }
  case 2: {
    currencyId = 0x02
    break
  }
  }
  console.log('Currency id:' + currencyId)
  let startMessageBuf = Buffer.from([0x9c, 0x9c, 0x53, currencyId])
  let hashBuf = Buffer.from(message, 'hex')
  let amountBuf = new Buffer(4)
  amountBuf.writeInt32BE(amount,0)
  let addressBuf = Buffer.from(address)
  let endMessageBuf = Buffer.from([0x9a, 0x9a])
  let messageBuf = Buffer.concat([startMessageBuf,hashBuf,amountBuf,addressBuf,endMessageBuf])
  console.log('message buf : ' + messageBuf)
  return new Promise((resolve, reject) => {
    let writeStatus = port.write(messageBuf)
    console.log('Write status: ' + writeStatus)
    port.on('data', data => {
      console.log('GOT this data: ' + data.toString('hex'))
      resolve(data)
      port.close()
      port.removeAllListeners()
    })
    port.on('error', data => {
      reject(data)
    })
  })
}
