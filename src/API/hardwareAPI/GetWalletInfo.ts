// import SerialPort from 'serialport'
// import { port } from './OpenPort'
import { reader } from './Reader'
import { info } from 'electron-log'
export async function wrapper(): Promise<any> {
  try {
    const res = await Promise.resolve()
    return res
  } catch (err) {
    throw err
  }
}
export function getInfoPCSC(): Promise<Number> {
  info('TRANSMITTING')

  return new Promise((resolve, reject) => {
    reader.transmit(Buffer.from([0xB0,0x10,0x00,0x00,0x00]),4,2, async(err, data) => {
      if (err) {
        info(err)
        reject(new Error(err))
      } else {
        info('STATUS DATA:',data.toString('hex'))
        switch (data.toString('hex')) {
        case '9000': {
          try {
            let realStatus = await getRealState()
            if (realStatus === '6e00') {
              resolve(3)
              info('resolve 3', realStatus)
            } else {
              info('resolve 0', realStatus)
              resolve(0)
            }
          } catch (err) {
            info('ERROR IN GETINFO', err)
          }
          break
        }
        case '6b80': {
          resolve(1)
          break
        }
        case '6b81': {
          resolve(2)
          break
        }
        case '6b82': {
          resolve(3)
          break
        }
        case '6b83': {
          resolve(4)
          break
        }

        }
      }
    })
  })
}


function getRealState() {
  return new Promise((resolve, reject) => {
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
/* export function waitForConnection() {
  let connection = false
  while (!connection) {
    setTimeout(() => {
      findDevice().then(value => {
        if (value !== undefined) {
          info(value)
          info('CONNECTED')
          connection = true
        } else {
          info('DISCONNECTED')
        }
      }).catch(err => info(err))
    },1000)
  }
}
*/
/* export async function findDevice(): Promise<any> {
  return new Promise((resolve, reject) => {
    SerialPort.list().then(result => {
      info(result.find())
      for (let item in result) {
        info('VENDOR ID: ' + result[item].vendorId)
        if (result[item].vendorId === '1FC9') resolve(result[item].comName)
      }
      reject('NO DEVICES FOUND')
    }).catch(error => info(error))
  }).catch(error => {
    info(error)
  })
}
*/
/*export async function getWalletStatus() {
  let startMessage = Buffer.from([0x9c,0x9c])
  let bodyMessage = Buffer.from([0x50,0x00])
  let endMessage = Buffer.from([0x9a,0x9a])
  let message = Buffer.concat([startMessage, bodyMessage, endMessage])
  port.write(message)
  return new Promise((resolve) => {
    port.on('data', data => {
      info('got this answer:',data)
      info('value in swith: ' + data[5])
      switch (data[5]) {
      case 0x00: {
        port.removeAllListeners('data')
        resolve(0)
        break
      }
      case 0x01: {
        resolve(1)
        break
      }
      case 0x02: {
        resolve(2)
        break
      }
      case 0x03: {
        resolve(3)
        break
      }
      case 0x04: {
        resolve(4)
        break
      }
      case 0x05: {
        resolve(5)
        break
      }
      }
    })
  })

}
*/
