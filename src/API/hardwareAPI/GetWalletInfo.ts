import SerialPort from 'serialport'
import * as ffi from 'ffi'

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
