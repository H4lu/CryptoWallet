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
import {getXRPalance, getXRPPrice} from "../cryptocurrencyAPI/Ripple";
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
              UpdateHWStatusPCSC(getBalance(),getBTCPrice(),getETBalance(),getETHPrice(),getLTalance(),getLTCPrice(),getXRPalance(),getXRPPrice())
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
        //sendFinalMessage()
        resolve(sigArray)
      }
    })
  })
}
function sendFinalMessage() {
  reader.transmit(Buffer.from([0xB0,0x42,0x00,0x00,0x00]),4,2,(err,data) => {
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
        info('TO STRING',data.toString('hex'))
          let lenData = data[1] + 2
          info('len data', lenData)
          let publicKey = getBitcoinPubKey()

          if((data[5+data[3]]) == 0x21)
          {
            info('S_LEN:  ', data[5+data[3]])
            data[5+data[3]] = 0x20
            let hi_s = Buffer.alloc(32)
            for (let i = 0; i<32; i++)
            {
              hi_s[i] = data[6+data[3] +i+1]
            }
            let lo_s = transfomS(hi_s)
            for (let i = 0; i<32; i++)
            {
                data[6+data[3] +i] = lo_s[i]
            }
            lenData--
            data[1]--
          }

          let datas = Buffer.allocUnsafe(lenData+2+35)
          datas[0]=(0x6a + lenData - 0x46)
          datas[1]=(1 + lenData)
          for( let i = 0; i < lenData; i++)
          {
              datas[i+2] = data[i]
          }
          datas[lenData + 2] = 0x01;
          datas[lenData + 3] = 0x021;
          for( let i = 0; i < 33; i++)
          {
              datas[lenData + 4 + i] = publicKey[i]
          }
          info('sign transaction ', datas.toString('hex'))
        resolve(datas)
      }
    })
  })
}


function transfomS(sign: Buffer): Buffer {

    let n = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
        0xBA, 0xAE, 0xDC, 0xE6, 0xAF, 0x48, 0xA0, 0x3B,
        0xBF, 0xD2, 0x5E, 0x8C, 0xD0, 0x36, 0x41, 0x41])

    let lo_s = Buffer.alloc(32)

    for (let i = 31; i > 0; i--) {
        if (n[i] < sign[i]) {
            lo_s[i] = 256 + n[i] - sign[i]
            n[i - 1]--
        }
        else {
            lo_s[i] = n[i] - sign[i]
        }
    }
    lo_s[0] = n[0] - sign[0]
    return lo_s
}