import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'

const MyLib = ffi.Library('iTokenDLL', { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })

/* export function getSignature(transactionHash: Buffer, addressNumber: number) {
  let signatureBin = ref.alloc(ref.refType('byte'))
  let pin = Buffer.from('12345678')
  let sigHexBuf = new Buffer(200)
  let pubKeyHex = new Buffer(66)
  let lngth = new Buffer(64)
  let signatureBinLength =
  let compressedPubKeyBin = ref.alloc(ref.refType('byte'))
  let compressedPubKeyBinLength = ref.alloc(ref.refType('int'))
  let compressedPubKeyHexLength = ref.alloc(ref.refType('int'))
  let errorCode = MyLib.get_signature(transactionHash, addressNumber,pin, sigHexBuf, signatureBin, lngth, signatureBinLength,
                                      compressedPubKeyBin, compressedPubKeyBinLength, pubKeyHex, compressedPubKeyHexLength)

  console.log('error code: ' + errorCode)
  console.log('sigHexLength: ' + lngth)
  console.log('pubkeyHex length: ' + pubKeyHex)
  console.log('signaturehex lowerCase: ' + sigHexBuf.toString().toLowerCase())
  console.log('pubkeyHex: ' + pubKeyHex)
  return sigHexBuf
}
*/
export function getSignature(transactionHash: string, addressNumber: number) {
  let pin = Buffer.from('12345678')
  let unlockingScriptHex = new Buffer(280)
  let unlockingScriptHexLength = ref.alloc('int')

  let errorCode = MyLib.get_dataForTransaction(transactionHash, addressNumber, pin, unlockingScriptHex,
                                              unlockingScriptHexLength)
  console.log('Error code: ' + errorCode)
  let loweredScriptHex = unlockingScriptHex.toString().toLowerCase()
  console.log('My signature:' + loweredScriptHex)
  console.log('Script length: ' + ref.deref(unlockingScriptHexLength))
  return loweredScriptHex
}
