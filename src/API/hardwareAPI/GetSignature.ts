import { Buffer } from 'buffer'
// import { port } from './OpenPort'
import { reader } from '../hardwareAPI/Reader'
import { info } from 'electron-log'
import { getAnswer } from './GetAddress'
import { UpdateHWStatusPCSC } from './UpdateHWStatus'
import { getBalance, getBTCPrice } from '../cryptocurrencyAPI/BitCoin'
import { getETBalance, getETHPrice } from '../cryptocurrencyAPI/Ethereum'
import { getLTalance,getLTCPrice } from '../cryptocurrencyAPI/Litecoin'
// import { UpdateHWStatusPCSC } from './UpdateHWStatus'
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
export function sig(id: number, address: string, amount: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (address.length !== 34 && id !== 1) {
      address = address + '0'
    }
    let xorData: any = address + amount.toString()
    let xor = 0
    for (let i in xorData) {
      xor = xor ^ xorData[i].charCodeAt(0)
    }
    info('FINAL XOR', xor)
    let amountBuf = new Buffer(16)
    amountBuf.write(amount.toString(),0,amount.toString().length, 'ascii')
    let code = 33
    let message = Buffer.concat([Buffer.from([0xB1,0x50,0x00]),Buffer.from([xor]),Buffer.from([0x60]),Buffer.from([code]),Buffer.from([id]),amountBuf,Buffer.from(address)])
    info('MESSAGE TO SEND',message)
    getAnswer(id).then(data => info(data)).catch(err => info(err))
    reader.transmit(message, 4,2, async (err,data) => {
      if (err) {
        info(err)
        reject(err)
      } else {
        info(data)
        let status = false
        let timeout = setTimeout(async () => {
          clearTimeout(timeout)
          while (!status) {
            let res = await getAnswer(id)
            info('GOT PRIVATE RESP', res)
            info('TO HEX', res.toString('hex'))
            info(res[35])
            if (res[35] === 33) {
              status = true
              getAnswer(id).then(data => info(data)).catch(err => info(err))
              UpdateHWStatusPCSC(getBalance(),getBTCPrice(),getETBalance(),getETHPrice(),getLTalance(),getLTCPrice())
              resolve(res)
            } else if (res[35] === 63) {
              status = true
              reject()
            }
          }
        },1000 ,[])
      }
    })
  })

}
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
    let data: any = amount.toString() + address
    for (let i in data) {
      xor ^= data.charCodeAt(i)
      info('XOR', xor)
      info('XOR TO HEX', xor.toString(16))
    }

    info('XOR RESUL',xor.toString(16))
    let xorBuf = Buffer.from([xor])
    let numberOfInputsBuf = Buffer.from([numberOfInputs])
    info('NUMBER OF INPUTS', numberOfInputsBuf)
    let idBuf = Buffer.from([currencyId])
    info('ID BUF',idBuf)
    let Le = Buffer.from(address).length + xorBuf.length + amountBuf.length
    let LeBuf = Buffer.from([Le])
    info('Le',LeBuf)
    reader.transmit(Buffer.from([0xb1,0x40,numberOfInputsBuf,idBuf,LeBuf,amountBuf,Buffer.from(address),xorBuf]), 4, 2, async (err, data) => {
      if (err) {
        info('ERROR IN FIRST MMESSAGE',err)
        reject(err)
      } else {
        info('DATA IN FIRST MESSAGE', data.toString('hex'))
        let sigArray: Array<Buffer> = []
        info(data)
        for (let i = 0; i < numberOfInputs; i++) {
          let answer = await sendDataMessage(Buffer.from([i]), Buffer.from([currencyId]), message[i])
          sigArray.push(answer)
        }
        sendFinalMessage()
        resolve(sigArray)
      }
    })
  })
}
function sendFinalMessage() {
  reader.transmit(Buffer.from([0xB1,0x60,0x00,0x00,0x00]),4,2,(err,data) => {
    if (err) {
      info(err)
    } else {
      info(data)
    }
  })
}
function sendDataMessage(inputNumber: Buffer, currencyId: Buffer, hash: Buffer): Promise<Buffer> {
  info('GOT THIS INPUT NUMBER: ' + inputNumber)
  info('GOT THIS CURRENCY ID: ' + currencyId)
  let xor = 0
  let xorData: any = hash.toString('hex')
  info('XOR DATA', xorData)
  for (let i in xorData) {
    xor ^= xorData[i].charCodeAt(0)
    info('DATA TO XOR',xorData[i].charCodeAt(0))
    info('XOR', xor)
  }
  let xorBuf = Buffer.from([xor])
  info('XOR BUF IN DATA MESSAGE', xorBuf)
  return new Promise((resolve, reject) => {
    reader.transmit(Buffer.from([0xb1,0x41,inputNumber, currencyId,0x20,hash,xorBuf]), 110, 2, (err, data) => {
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
