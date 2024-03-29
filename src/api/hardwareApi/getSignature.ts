import {Buffer} from 'buffer'
// @ts-ignore
import {reader} from './reader'
import {getBitcoinPubKey} from "../cryptocurrencyApi/bitcoin";
import {getEthereumPubKey} from "../cryptocurrencyApi/ethereum";
import {getLitecoinPubKey} from "../cryptocurrencyApi/ltecoin";

import ffi from 'ffi-napi'
// import * as Path from 'path'
// const path = Path.join(__dirname,'../..','lib32.dll')
const libdll = ffi.Library('./resources/lib32.dll', {'signParse': ['void', ['string', 'int', 'string', 'string', 'string']]})


export function getSignaturePCSC(id: number, message: Array<Buffer>, address: string, amount: number, numberOfInputs: number, course: number, fee: number, balance: number): Promise<Array<Buffer>> {
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
        let numberOfInputsBuf = Buffer.from([numberOfInputs])

        let idBuf = Buffer.from([currencyId])

        let le = Buffer.from(address).length + 48
        let leBuf = Buffer.from([le])

        let amountBuf = getSumAsBuf(amount, course)
        let feeBuf = getSumAsBuf(fee, course)
        let balanceBuf = getSumAsBuf(balance, course)
        // @ts-ignore
        reader.transmit(Buffer.concat([Buffer.from([0xb0, 0x40]), numberOfInputsBuf, idBuf, leBuf, amountBuf, feeBuf, balanceBuf, Buffer.from(address)]), 4, 2, async (err, data) => {
            if (err) {
                reject(err)
            } else {
                let timerId = setInterval(() => {
                    // @ts-ignore
                    reader.transmit(Buffer.concat([Buffer.from([0xb0, 0x42, 0x00, 0x00, 0x00])]), 4, 2, async (err: any, data: { toString: { (arg0: string): void; (arg0: string): string; (arg0: string): string; }; }) => {
                        if (err) {
                            reject(err)
                        } else {
                            if (String(data.toString('hex')) === String('9000')) {
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
                                    let nullBuff = Buffer.alloc(1)
                                    nullBuff[0] = 0x00
                                    resolve(sigArray)
                                    clearInterval(timerId)
                                }
                            }
                        }
                    })
                }, 1000, [])
            }
        })
    })
}

function sendDataMessage(inputNumber: Buffer, currencyId: Buffer, hash: Buffer): Promise<Buffer> {

    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.transmit(Buffer.concat([Buffer.from([0xb0, 0x41]), Buffer.from(inputNumber), Buffer.from(currencyId), Buffer.from(hash)]), 110, 2, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let curId = currencyId[0]
                let pubKey
                if (curId == 0) {
                    pubKey = getBitcoinPubKey()
                }
                if (curId == 1) {
                    pubKey = getEthereumPubKey()
                }
                if (curId == 2) {
                    pubKey = getLitecoinPubKey()
                }
                let outData = Buffer.allocUnsafe(110)
                libdll.signParse(data, curId, pubKey, hash, outData)

                let lenOut: number
                if (curId != 1) {
                    lenOut = outData[0] + 1
                } else {
                    lenOut = 65
                }
                let sig = Buffer.allocUnsafe(lenOut)
                for (let i = 0; i < lenOut; i++) {
                    sig[i] = outData[i]
                }
                resolve(sig)
            }
        })
    })
}

function getSumAsBuf(sum: number, course: number): Buffer {
    let tempI = Math.floor(sum)
    let tempF = (sum - tempI) * 100000000
    let returnBuf = Buffer.alloc(16)

    for (let i = 0; i < 4; i++) {
        returnBuf[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        returnBuf[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    tempI = Math.floor(sum * course)
    tempF = (sum * course - tempI) * 100
    for (let i = 0; i < 4; i++) {
        returnBuf[11 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        returnBuf[15 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    return returnBuf
}