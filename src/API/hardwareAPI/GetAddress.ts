
import { Buffer } from 'buffer'
// import { port } from './OpenPort'
import { reader } from './Reader'

export function get() {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xb1,0x20,0x00,0x00,0x01]), 4, 2, (err,data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('GOT THIS DATA',data.toString('hex'))
        resolve(data.toString('hex'))
      }
    })
  })

}
export function getREALSTATUS() {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xB0,0x10,0x00,0x00,0x00]), 255,2,(err,data) => {
      if (err) {
        console.log('ERROR IN REALSTATUS', err)
        reject(err)
      } else {
        console.log('REALSTATUS', data.toString('hex'))
        resolve(data)
      }
    })
  })
}

export function getAddressPCSC(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let currencyId: number = 0x00
    console.log(currencyId)
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
    reader.transmit(Buffer.from([0xB1,0x30,0x00,0x00,0x00]),60,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        console.log('ADDRESS ANSWER', data.toString('hex'))
        resolve(data.toString('hex').substring(0, data.indexOf('9000', 30)))
      }
    })
  })

}
/* export function getAddr(id: number) {
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
*/
