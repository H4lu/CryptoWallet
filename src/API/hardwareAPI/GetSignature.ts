import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'

const MyLib = ffi.Library('iTokenDLL', { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })

export function getSignature(transactionHash: string, addressNumber: number) {
  let pin = Buffer.from('12345678')
  let unlockingScriptHex = new Buffer(280)
  let unlockingScriptHexLength = ref.alloc('int')
  let errorCode = MyLib.get_dataForTransaction(transactionHash, addressNumber, pin, unlockingScriptHex,
                                              unlockingScriptHexLength)
  console.log('Error code: ' + errorCode)
  // Получаем unlocingScript для транзакции. Он включает в себя подпись в DER формате + публичный ключ + байты, отвечающие за размер
  let loweredScriptHex = unlockingScriptHex.toString().toLowerCase()
  let scriptLength = ref.deref(unlockingScriptHexLength)
  console.log('Script length: ' + scriptLength)
  // Убираем лишние нули, если размер скрипта < 280
  if (scriptLength !== 280) {
    loweredScriptHex = loweredScriptHex.substring(0, scriptLength)
  }
  console.log('My signature:' + loweredScriptHex)
  return loweredScriptHex
}
