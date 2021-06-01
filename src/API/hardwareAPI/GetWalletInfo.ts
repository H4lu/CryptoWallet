import { reader } from './Reader'
import { info } from 'electron-log'

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
 export function waitForConnection() {
  let connection = false
  while (!connection) {
    setTimeout(() => {

    },1000)
  }
}

