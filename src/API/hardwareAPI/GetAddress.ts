import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'
import SerialPort from 'serialport'
const MyLib = ffi.Library('iTokenDLL', {'get_addressEthereum': ['int', ['int','string','string']],
  'get_address': ['int', ['int','bool','string','int*']],
  'get_addressLitecoin': ['int', ['int','bool','string','int*']]
})

export function getLitecoinAddress(adressNumber: number, keyType: boolean): string {
  let address = new Buffer(64)
  let length = ref.alloc(ref.types.int)
  let errorCode = MyLib.get_addressLitecoin(adressNumber, keyType, address, length)
  let lengthValue = ref.deref(length)
  console.log('Length value' + lengthValue)
  console.log('Address value: ' + address.toString().length)
  let addrString = address.toString()
  console.log('Address string: ' + addrString)
  console.log('Addr utf8: ' + address.toString())
  if (address.toString().length > lengthValue) {
    console.log('cutting')
    addrString = address.toString().substring(0,lengthValue)
  }
  console.log('LTC adress: ' + address)
  console.log(errorCode)
  return addrString
}

export function getBitCoinAddress(adressNumber: number, keyType: boolean) {
  let address = new Buffer(64)
  let length = ref.alloc(ref.types.int)
  let errorCode = MyLib.get_address(adressNumber, keyType, address, length)
  let lengthValue = ref.deref(length)
  console.log('Length value' + lengthValue)
  console.log('Address value: ' + address.toString().length)
  let addrString = address.toString()
  console.log('Address string: ' + addrString)
  console.log('Addr utf8: ' + address.toString())
  if (address.toString().length > lengthValue) {
    console.log('cutting')
    addrString = address.toString().substring(0,lengthValue)
  }
  console.log('BTC address: ' + address.toString())
  console.log(errorCode)
  return addrString
}

export function getEthereumAddres(addressNumber: number) {
  let address = new Buffer(40)
  let pubKeyHex = new Buffer(128)
  let errorCode = MyLib.get_addressEthereum(addressNumber, address, pubKeyHex)
  console.log(errorCode)
  console.log('Address output: ' + address.toString('hex'))
  console.log(address.toString('hex'))
  return '0x' + address.toString().toLowerCase()
}

const cryptoLib = ffi.Library('CWAPI',{ 'get_CurrencyInfo': ['int', ['int','int*','byte*']] })

export default function getAddress(id: number) {
  let length = ref.alloc(ref.types.int)
  let address = new Buffer(50)
  let errorCode = cryptoLib.get_CurrencyInfo(id,length,address)
  let lengthValue = ref.deref(length)
  console.log('Length value' + lengthValue)
  console.log('Address value: ' + address.toString().length)
  let addrString = address.toString()
  console.log('Address string: ' + addrString)
  if (address.toString().length > lengthValue) {
    console.log('cutting')
    addrString = address.toString().substring(4,lengthValue)
  }
  console.log(errorCode)
  console.log('Address string: ' + addrString)
  return addrString
}
let port = new SerialPort('COM5', { autoOpen: false, baudRate: 115200 })
export function getAddr(id: number) {
  port.open()
  port.on('open', data => {
    console.log('Port opened!' + data)
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
    console.log(id)
    let messageBuf = Buffer.from([0x9c,0x9c,0x43,currencyId,0x9a,0x9a])
    console.log(messageBuf)
    port.write(messageBuf)
    port.on('data', data => {
      console.log('Got this data: ' + data.toString())
      port.close()
      port.removeAllListeners()
    })
  })
  port.on('error', error => {
    console.log('Error: ' + error)
  })
}
