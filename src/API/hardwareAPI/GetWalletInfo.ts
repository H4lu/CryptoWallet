import SerialPort from 'serialport'
import * as ffi from 'ffi'
import { port } from './OpenPort'
export async function wrapper(): Promise<any> {
  try {
    const res = await Promise.resolve()
    return res
  } catch (err) {
    throw err
  }
}
export function waitForConnection() {
  let connection = false
  while (!connection) {
    setTimeout(() => {
      findDevice().then(value => {
        if (value !== undefined) {
          console.log(value)
          console.log('CONNECTED')
          connection = true
        } else {
          console.log('DISCONNECTED')
        }
      }).catch(err => console.log(err))
    },1000)
  }
}
export async function findDevice(): Promise<any> {
  return new Promise((resolve, reject) => {
    SerialPort.list().then(result => {
      console.log(result.find())
      for (let item in result) {
        console.log('VENDOR ID: ' + result[item].vendorId)
        if (result[item].vendorId === '1FC9') resolve(result[item].comName)
      }
      reject('NO DEVICES FOUND')
    }).catch(error => console.log(error))
  }).catch(error => {
    console.log(error)
  })
}
const cryptoLib = ffi.Library('CWAPI',{ 'get_currencyWalletInfo': ['int', []] })
export function checkPin(): boolean {
  let errorCode = cryptoLib.get_currencyWalletInfo()
  console.log(errorCode)
  if (errorCode === 0) {
    return true
  } else {
    return false
  }
}

export async function getWalletStatus() {
  let startMessage = Buffer.from([0x9c,0x9c])
  let bodyMessage = Buffer.from([0x50,0x00])
  let endMessage = Buffer.from([0x9a,0x9a])
  let message = Buffer.concat([startMessage, bodyMessage, endMessage])
  port.write(message)
  return new Promise((resolve) => {
    port.on('data', data => {
      console.log('got this answer:',data)
      console.log('value in swith: ' + data[5])
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
