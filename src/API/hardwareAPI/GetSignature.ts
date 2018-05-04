import { Buffer } from 'buffer'
// import { port } from './OpenPort'
import { reader } from '../hardwareAPI/Reader'
import { info } from 'electron-log'
/* import * as Path from 'path'
// declare var __dirname: string
// let path = __dirname + './../../iTokenDLL'
const path = Path.join(__dirname,'../..','iTokenDLL')
const kernelPath = Path.join(__dirname, '../..', 'kernel32')
info('path is:' + path)
const kernel = ffi.Library(kernelPath, {'SetDllDirectoryW': ['bool', ['string']]
})
info('before set dll')
kernel.SetDllDirectoryW(Path.join(__dirname, '../..','mtoken_stb.dll'))
info('after set dll')
const MyLib = ffi.Library(path, { 'get_dataForTransaction': ['int', ['string','int','char*','string','int*']] })
*/
/*let port: SerialPort
export function openPort(portName: string): Promise<SerialPort> {
  port = new SerialPort(portName, { autoOpen: false, baudRate: 115200 })
  info(portName)
  port.open()
  return new Promise((resolve, reject) => {
    port.on('open', data => {
      info('Port opened! data: ' + data)
      info('RESOLVING T?HIS PORT:', port)
      resolve(port)
    })
    port.on('error', error => {
      info('Error occured while opening: ' + info(error))
      reject(error)
    })
    port.on('disconnect',() => {
      info('disconnect detected')
      port.close(() => {
        info('Port closed by disconnect!')
      })
    })
    port.on('close', () => {
      info('Port closed!')
    })
  })
}
*/
export function getSignaturePCSC(id: number, message: Array<Buffer>, address: string, amount: number, numberOfInputs: number): Promise<Array<Buffer>> {
  return new Promise((resolve, reject) => {
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
    info('LENGTH OF MESSAGE', message.length)
    let amountBuf = new Buffer(16)
    amountBuf.write(amount.toString(),0,amount.toString().length, 'ascii')
    info('Number of inputs:', Number('0x' + numberOfInputs))
    let xor = 0
    let data = Buffer.concat([amountBuf,Buffer.from(address)])
    for (let i in data) {
      xor ^= Number(amount.toString().charCodeAt(Number(i)).toString(16))
    }
    info('XOR RESUL',xor)
    reader.transmit(Buffer.from([0xb1,0x40,Number('0x' + numberOfInputs),currencyId,message.length,amountBuf,Buffer.from(address),Number('0x' + xor)]), 4, 2, async (err, data) => {
      if (err) {
        info('ERROR IN FIRST MMESSAGE',err)
        reject(err)
      } else {
        info('DATA IN FIRST MESSAGE', data.toString('hex'))
        let sigArray: Array<Buffer> = []
        info(data)
        for (let i = 0; i < numberOfInputs; i++) {
          let answer = await sendDataMessage(Number('0x' + i), currencyId, message[i])
          sigArray.push(answer)
        }
        resolve(sigArray)
      }
    })
  })
}

function sendDataMessage(inputNumber: number, currencyId: number, hash: Buffer): Promise<Buffer> {
  info('GOT THIS INPUT NUMBER: ' + inputNumber)
  info('GOT THIS CURRENCY ID: ' + currencyId)
  return new Promise((resolve, reject) => {
    reader.transmit(Buffer.from([0xb1,0x41,inputNumber, currencyId,0x20,hash]), 110, 2, (err, data) => {
      if (err) {
        info('ERROR IN SEND HASH',err)
        reject(err)
      } else {
        info('GOT THIS DATA',data)
        info('TO STRING',data.toString('hex'))
        resolve(data)
      }
    })
  })
}

/* export function getSig(id: number, message: Buffer, address: string, amount: number, numberOfInputs: number): Promise<Buffer> {
  info(numberOfInputs)
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
  info('Currency id:' + currencyId)
  let numberOfIns = Number('0x' + numberOfInputs)
  info('NUMBER OF INPUTS: ' + numberOfIns)
  let startMessageBuf = Buffer.from([0x9c, 0x9c, 0x53, currencyId, numberOfIns])
  let amountBuf = new Buffer(16)
  info('WRITE THIS AMOUNT: ' + amount)
  amountBuf.write(amount.toString(),0,amount.toString().length, 'ascii')
  let addressBuf = Buffer.from(address)
  let endMessageBuf = Buffer.from([0x9a, 0x9a])
  let messageBuf = Buffer.concat([startMessageBuf,message,amountBuf,addressBuf,endMessageBuf])
  info('message buf : ', messageBuf)
  info('LENGTH OF MESSAGE BUF: ' + messageBuf.length)
  return new Promise((resolve) => {
    info('PORT IN GET SIGNATURE',port)
    port.write(messageBuf)
    port.on('data', data => {
      info('GOT this data: ' + data.toString('hex'))
      port.removeAllListeners('data')
      resolve(data)
    })
  })
}*/
