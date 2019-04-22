import { Buffer } from 'buffer'
import { reader } from '../hardwareAPI/Reader'
import { info } from 'electron-log'
import {getBitcoinPubKey} from "../cryptocurrencyAPI/BitCoin";


export function getSignaturePCSC(id: number, message: Array<Buffer>, address: string, amount: number, numberOfInputs: number, course: number, fee: number,balance: number): Promise<Array<Buffer>> {
  info('inputs length', numberOfInputs)
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
    info('Number of inputs:', Number('0x' + numberOfInputs))
    let numberOfInputsBuf = Buffer.from([numberOfInputs])

    let idBuf = Buffer.from([currencyId])
    info('ID BUF',idBuf)

    let le = Buffer.from(address).length + 48
    let leBuf = Buffer.from([le])
    info('Len data summ', leBuf)

    let amountBuf = getSumAsBuf(amount, course)
    let feeBuf = getSumAsBuf(fee, course)
    let balanceBuf = getSumAsBuf(balance, course)
    info('40: ',Buffer.concat([Buffer.from([0xb0,0x40]), numberOfInputsBuf, idBuf, leBuf, amountBuf, feeBuf, balanceBuf, Buffer.from(address)]).toString('hex'))
    reader.transmit(Buffer.concat([Buffer.from([0xb0,0x40]), numberOfInputsBuf, idBuf, leBuf, amountBuf, feeBuf, balanceBuf, Buffer.from(address)]), 4, 2, async (err, data) => {
      if (err) {
        info('ERROR IN FIRST MMESSAGE',err)
        reject(err)
      } else {
        info('DATA IN FIRST MESSAGE', data.toString('hex'))

            /*  let sigArray: Array<Buffer> = []
              for (let i = 0; i < numberOfInputs; i++) {
                  let answer = await sendDataMessage(Buffer.from([i]), Buffer.from([currencyId]), message[i])
                  sigArray.push(answer)
              }
              resolve(sigArray)*/
        info('in while')
        let timerId = setInterval(() => {
          reader.transmit(Buffer.concat([Buffer.from([0xb0, 0x42, 0x00, 0x00, 0x00])]), 4, 2, async (err: any, data: { toString: { (arg0: string): void; (arg0: string): string; (arg0: string): string; }; }) => {
            if (err) {
              info('ERROR IN 42 MMESSAGE', err)
              reject(err)
            } else {
              info('DATA IN 42 MESSAGE', data.toString('hex'))
              if (String(data.toString('hex')) === String('9000')) {
                info('in if send message')
                let sigArray: Array<Buffer> = []
                for (let i = 0; i < numberOfInputs; i++) {
                  let answer = await sendDataMessage(Buffer.from([i]), Buffer.from([currencyId]), message[i])
                  sigArray.push(answer)
                }
                clearInterval(timerId)
                resolve(sigArray)
              } else {
                if (String(data.toString('hex')) === '6b84') {
                  let sigArray: Array<Buffer> = []
                  let nullBuff = new Buffer(1)
                  nullBuff[0] = 0x00
                  resolve(sigArray)
                  clearInterval(timerId)
                }
              }
            }
          })
        },1000,[])
      }
    })
  })
}

function sendDataMessage(inputNumber: Buffer, currencyId: Buffer, hash: Buffer): Promise<Buffer> {

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

function getSumAsBuf(sum: number, course: number): Buffer{
    let tempI = Math.floor(sum)
    let tempF = (sum - tempI)*100000000
    let returnBuf = new Buffer(16)

    for (let i=0; i<4; i++)
    {
        returnBuf[3-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        returnBuf[7-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    tempI = Math.floor(sum*course)
    tempF = (sum*course - tempI)*100
    for (let i=0; i<4; i++)
    {
        returnBuf[11-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        returnBuf[15-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    return returnBuf
}