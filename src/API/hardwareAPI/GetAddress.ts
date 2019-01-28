
import { Buffer } from 'buffer'
// import { port } from './OpenPort'
import { reader } from './Reader'
import { info } from 'electron-log'

export function get() {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xB0,0x20,0x00,0x00,0x01]), 4, 2, (err,data) => {
      if (err) {
        info(err)
        reject(err)
      } else {
        info('GOT THIS DATA',data.toString('hex'))
        resolve(data.toString('hex'))
      }
    })
  })

}
export function getREALSTATUS() {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xB0,0x10,0x00,0x00,0x00]), 255,2,(err,data) => {
      if (err) {
        info('ERROR IN REALSTATUS', err)
        reject(err)
      } else {
        info('REALSTATUS', data.toString('hex'))
        resolve(data)
      }
    })
  })
}
export function getAnswer(id: Number): Promise<Buffer> {
  return new Promise(async (resolve,reject) => {
    reader.transmit(Buffer.concat([Buffer.from([0xB0,0x30,0x00]),Buffer.from([id]),Buffer.from([0x00])]),255,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
export function getAddressPCSC(id: number): Promise<[string, Buffer]> {
  return new Promise(async (resolve, reject) => {
    let currencyId: number
    let dataToSend
    switch (id) {
    case 0: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x00,0x00])
      currencyId = 0x00
      break
    }
    case 1: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x01,0x00])
      currencyId = 0x01
      break
    }
    case 2: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x02,0x00])
      currencyId = 0x02
      break
    }
    }
    info('Currency id:', currencyId)
    info('DATA TO SEND',dataToSend)
    reader.transmit(dataToSend,255,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        info('ADDRESS ANSWER', data.toString())
        console.log('RESOLVING', data.slice(4, data[0]+1).toString())
        console.log('LENGTH', data[0])

          console.log('pub',data.slice(data[0]+1, data[0]+66).toString('hex') )
        resolve([data.slice(1, data[0]+1).toString(), data.slice(data[0]+1, data[0]+66)])
      }
    })//data.length - 3
  })

}
/*
function sendData(currencyId: number) {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xB1,0x30,0x00,currencyId,0x00]),60,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        info('ADDRESS ANSWER', data.toString('hex'))
        resolve(data.toString('hex').substring(0, data.indexOf('9000', 30)))
      }
    })
  })
}
*/
/* export function getAddr(id: number) {
  port.open()
  port.on('open', data => {
    info('Port opened!' + data)
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
    info(id)
    let messageBuf = Buffer.from([0x9c,0x9c,0x43,currencyId,0x9a,0x9a])
    info(messageBuf)
    port.write(messageBuf)
    port.on('data', data => {
      info('Got this data: ' + data.toString())
      port.close()
      port.removeAllListeners()
    })
  })
  port.on('error', error => {
    info('Error: ' + error)
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
  info('PORT WRITED')
  return new Promise((resolve) => {
    port.on('data', (data) => {
      info('PORT IN ADDRESS:',port)
      info('GOT THIS DATA IN GET ADDRESS BY COM:',data.toString())
      port.removeAllListeners('data')
      resolve(data.toString().substring(7, data.length))
    })
  })

}
*/
