import { Buffer } from 'buffer'
// import { port } from './OpenPort'
import { reader } from '../hardwareAPI/Reader'
import { info } from 'electron-log'
import { getAnswer } from './GetAddress'
import { UpdateHWStatusPCSC } from './UpdateHWStatus'
import {getBalance, getBitcoinPubKey, getBTCPrice} from '../cryptocurrencyAPI/BitCoin'
import { getETBalance, getETHPrice } from '../cryptocurrencyAPI/Ethereum'
import { getLTalance,getLTCPrice } from '../cryptocurrencyAPI/Litecoin'
import {bufferutils} from "bitcoinjs-lib";
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
    let message = Buffer.concat([Buffer.from([0xB0,0x40,0x00]),Buffer.from([xor]),Buffer.from([0x60]),Buffer.from([code]),Buffer.from([id]),amountBuf,Buffer.from(address)])
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
  info("inputs length", numberOfInputs)
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
    let numberOfInputsBuf = Buffer.from([numberOfInputs])
    info('NUMBER OF INPUTS', numberOfInputsBuf)
    let idBuf = Buffer.from([currencyId])
    info('ID BUF',idBuf)
    let Le = Buffer.from(address).length + /*xorBuf.length +*/ amountBuf.length
    let LeBuf = Buffer.from([Le])
    info('Le',LeBuf)
      info('40: ',Buffer.concat([Buffer.from([0xb0,0x40]),Buffer.from([numberOfInputs]),Buffer.from(idBuf),Buffer.from(LeBuf),Buffer.from(amountBuf),Buffer.from(address)]).toString('hex'))
    reader.transmit(Buffer.concat([Buffer.from([0xb0,0x40]),Buffer.from([numberOfInputs]),Buffer.from(idBuf),Buffer.from(LeBuf),Buffer.from(amountBuf),Buffer.from(address)]), 4, 2, async (err, data) => {
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
      //  sendFinalMessage()
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
    info('41: ', Buffer.concat([Buffer.from([0xb0,0x41]),Buffer.from(inputNumber), Buffer.from(currencyId), Buffer.from([0x20]), Buffer.from(hash)]).toString('hex'))
  return new Promise((resolve, reject) => {
    reader.transmit(Buffer.concat([Buffer.from([0xb0,0x41]),Buffer.from(inputNumber), Buffer.from(currencyId), Buffer.from([0x20]), Buffer.from(hash)]), 110, 2, (err, data) => {
      if (err) {
        info('ERROR IN SEND HASH',err)
        reject(err)
      } else {
        info('GOT THIS DATA',data)
        info('TO STRING',data.toString('hex'))
          let lenData = data[1]
          info('len data', lenData)
          let publicKey = getBitcoinPubKey()

          let datas = Buffer.allocUnsafe(data.length+35)
          datas[0]=(0x6a + lenData - 0x44)
          datas[1]=(0x47 + lenData - 0x44)
          for( let i = 0; i < data.length - 2; i++)
          {
              datas[i+2] = data[i]
          }
          datas[data.length] = 0x01;
          datas[data.length +1] = 0x021;
          for( let i = 0; i < 33; i++)
          {
              datas[data.length+2 + i] = publicKey[i]
          }
          info('sign transaction ', datas.toString('hex'))
        resolve(datas)
      }
    })
  })
}

