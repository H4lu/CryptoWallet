import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'

const MyLib = ffi.Library('iTokenDLL', {'get_addressEthereum': ['int', ['int','string','string']],
  'get_address': ['int', ['int','bool','string','int*']],
  'get_addressLitecoin': ['int', ['int','bool','string','int*']]
})

export function getLitecoinAdress(adressNumber: number, keyType: boolean): string {
  let adress = new Buffer(64)
  let length = ref.alloc(ref.types.int)
  let errorCode = MyLib.get_addressLitecoin(adressNumber, keyType, adress, length)
  console.log('LTC adress: ' + adress)
  console.log(errorCode)
  return adress.toString('hex')
}

export function getBitCoinAddress(adressNumber: number, keyType: boolean) {
  let address = new Buffer(64)
  let length = ref.alloc(ref.types.int)
  let errorCode = MyLib.get_address(adressNumber, keyType, address, length)
  console.log('BTC address: ' + address.toString())
  console.log(errorCode)
  return address.toString()
}
