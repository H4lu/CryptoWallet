import { Buffer } from 'buffer'
import { port } from './OpenPort'
/* import * as Path from 'path'
// declare var __dirname: string
// let path = __dirname + './../../iTokenDLL'
const path = Path.join(__dirname,'../..','iTokenDLL')
const kernelPath = Path.join(__dirname, '../..', 'kernel32')
console.log('path is:' + path)
const kernel = ffi.Library(kernelPath, {'SetDllDirectoryW': ['bool', ['string']]
})
console.log('before set dll')
kernel.SetDllDirectoryW(Path.join(__dirname, '../..','mtoken_stb.dll'))
console.log('after set dll')
const MyLib = ffi.Library(path, { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })
*/
/*let port: SerialPort
export function openPort(portName: string): Promise<SerialPort> {
  port = new SerialPort(portName, { autoOpen: false, baudRate: 115200 })
  console.log(portName)
  port.open()
  return new Promise((resolve, reject) => {
    port.on('open', data => {
      console.log('Port opened! data: ' + data)
      console.log('RESOLVING T?HIS PORT:', port)
      resolve(port)
    })
    port.on('error', error => {
      console.log('Error occured while opening: ' + console.log(error))
      reject(error)
    })
    port.on('disconnect',() => {
      console.log('disconnect detected')
      port.close(() => {
        console.log('Port closed by disconnect!')
      })
    })
    port.on('close', () => {
      console.log('Port closed!')
    })
  })
}
*/
export function getSig(id: number, message: Buffer, address: string, amount: number, numberOfInputs: number): Promise<Buffer> {
  console.log(numberOfInputs)
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
  console.log('Currency id:' + currencyId)
  let numberOfIns = Number('0x' + numberOfInputs)
  console.log('NUMBER OF INPUTS: ' + numberOfIns)
  let startMessageBuf = Buffer.from([0x9c, 0x9c, 0x53, currencyId, numberOfIns])
  let amountBuf = new Buffer(16)
  amountBuf.write(amount.toString(),0,amount.toString().length, 'ascii')
  let addressBuf = Buffer.from(address)
  let endMessageBuf = Buffer.from([0x9a, 0x9a])
  let messageBuf = Buffer.concat([startMessageBuf,message,amountBuf,addressBuf,endMessageBuf])
  console.log('message buf : ', messageBuf)
  console.log('LENGTH OF MESSAGE BUF: ' + messageBuf.length)
  return new Promise((resolve) => {
    console.log('PORT IN GET SIGNATURE',port)
    port.write(messageBuf)
    port.on('data', data => {
      console.log('GOT this data: ' + data.toString('hex'))
      port.removeAllListeners('data')
      resolve(data)
    })
  })
}
