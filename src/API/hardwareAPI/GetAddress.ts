import Web3 from 'web3'
//const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/hgAaKEDG9sIpNHqt8UYM'))
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/960cbfb44af74f27ad0e4b070839158a'))
import { Buffer } from 'buffer'
import { reader } from './Reader'
import { info } from 'electron-log'

export function get() {
  return new Promise((resolve,reject) => {
    reader.transmit(Buffer.from([0xB0,0x20,0x00,0x00,0x01]), 4, 2, (err,data) => {
      if (err) {
        info(err)
        reject(err)
      } else {
        info('GOT THIS DATA',data.toString('hex'))
        resolve(data.toString('hex'))
      }
    })
  })

}
export function getREALSTATUS() {
  return new Promise((resolve,reject) => {
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
export function getAnswer(id: Number): Promise<Buffer> {
  return new Promise(async (resolve,reject) => {
    reader.transmit(Buffer.concat([Buffer.from([0xB0,0x30,0x00]),Buffer.from([id]),Buffer.from([0x00])]),255,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
export function getAddressPCSC(id: number): Promise<[string, Buffer]> {
  return new Promise(async (resolve, reject) => {
    let currencyId: number
    let dataToSend = new Buffer(5)
    switch (id) {
    case 0: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x00,0x00])
      currencyId = 0x00
      break
    }
    case 1: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x01,0x00])
      currencyId = 0x01
      break
    }
    case 2: {
      dataToSend = Buffer.from([0xB0,0x30,0x00,0x02,0x00])
      currencyId = 0x02
      break
    }
   /* case 3: {
        dataToSend = Buffer.from([0xB0,0x30,0x00,0x03,0x00])
        currencyId = 0x03
        break
    }*/
    }
    info('Currency id:', currencyId)
    info('DATA TO SEND',dataToSend)
    reader.transmit(dataToSend,255,2,(err,data) => {
      if (err) {
        reject(err)
      } else {
        info('ADDRESS ANSWER', data.toString())
         if(currencyId == 1) {
            let forkeccak = (data.slice(data[0] + 2, data[0] + 66)).toString('hex')
            let ethAdr = web3.utils.soliditySha3({t: 'bytes', v: forkeccak})
            info('Keccak_web3', ethAdr)
            ethAdr = 'ETH0x' + ethAdr.substr(26,40)
             resolve([ethAdr, data.slice(data[0]+1, data[0]+66)])
         }else {
             resolve([data.slice(1, data[0] + 1).toString(), data.slice(data[0] + 1, data[0] + 66)])
         }
      }
    })
  })
}
