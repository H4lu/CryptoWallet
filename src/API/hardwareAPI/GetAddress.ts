import * as ffi from 'ffi'
import * as ref from 'ref'
import { Buffer } from 'buffer'
import { port } from './OpenPort'
const cryptoLib = ffi.Library('CWAPI',{ 'get_CurrencyInfo': ['int', ['int','int*','byte*']] })

export default function getAddress(id: number) {
  let length = ref.alloc(ref.types.int)
  let address = new Buffer(50)
  let errorCode = cryptoLib.get_CurrencyInfo(id,length,address)
  let lengthValue = ref.deref(length)
  console.log('Length value' + lengthValue)
  console.log('Address value: ' + address.toString().length)
  let addrString = address.toString()
  console.log('Address string:' + addrString)
  if (address.toString().length > lengthValue) {
    console.log('cutting')
    addrString = address.toString().substring(4,lengthValue)
  }
  console.log(errorCode)
  console.log('Address string:' + addrString)
  return addrString
}
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
export function getAddressByCOM(id: number): Promise<string> {
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
  let startMessage = Buffer.from([0x9c, 0x9c])
  let endMessage = Buffer.from([0x9a, 0x9a])
  let messageBody = Buffer.from([0x43, currencyId])
  let message = Buffer.concat([startMessage,messageBody, endMessage])
  port.write(message)
  console.log('PORT WRITED')
  return new Promise((resolve) => {
    port.on('data', (data) => {
      console.log('PORT IN ADDRESS:',port)
      console.log('GOT THIS DATA IN GET ADDRESS BY COM:',data.toString())
      port.removeAllListeners('data')
      resolve(data.toString().substring(7, data.length))
    })
  })

}
