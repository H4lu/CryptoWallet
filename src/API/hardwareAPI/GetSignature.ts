import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'
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
const MyLib = ffi.Library('iTokenDLL', { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']],
  'getSignEthereumHex': ['int', ['string','int','char*','string','string','int*']] })

// const MyLib = ffi.Library('iTokenDLL', { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })
export function getSignature(transactionHash: string, adressNumber: number) {

  let unlockingScriptHex = new Buffer(280)
  let unlockingScriptHexLength = ref.alloc('int')
  let errorCode = MyLib.get_dataForTransaction(transactionHash, adressNumber, pin, unlockingScriptHex,
                                              unlockingScriptHexLength)
  console.log('Error code: ' + errorCode)
  // Получаем unlocingScript для транзакции. Он включает в себя подпись в DER формате + публичный ключ + байты, отвечающие за размер
  let loweredScriptHex = unlockingScriptHex.toString().toLowerCase()
  let scriptLength = ref.deref(unlockingScriptHexLength)
  console.log('Script length: ' + scriptLength)
  // Убираем лишние нули, если размер скрипта < 280
  console.log('script length: ' + scriptLength)
  if (scriptLength < 280) {
    loweredScriptHex = loweredScriptHex.substring(0, scriptLength)
  }
  console.log('My signature ' + loweredScriptHex)
  return loweredScriptHex
}

export function getEthereumSignature(transactionHash: string, adressNumber: number): string[] {
  let rValue = new Buffer(32)
  let sValue = new Buffer(32)
  let vValue = ref.alloc('int')
  let errorCode = MyLib.getSignEthereumHex(transactionHash, adressNumber, pin, rValue, sValue, vValue)
  if (errorCode !== 1) {
    console.log('Error code: ' + errorCode)
  }
  console.log('r value: ' + rValue.toString('hex') + 's value: ' + sValue.toString('hex') + 'v Value: ' + ref.deref(vValue))
  return new Array(rValue.toString('hex'),sValue.toString('hex'),vValue.toString('hex'))
}
