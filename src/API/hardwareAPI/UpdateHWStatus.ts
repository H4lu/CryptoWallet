import {reader} from './Reader'
import {Buffer} from "buffer";


export function UpdateHWStatusPCSC(BTC_BAL: number, BTC_USD: number, ETH_BAL: number, ETH_USD: number, LTC_BAL: number, LTC_USD: number, XRP_BAL: number, XRP_USD: number, numTr: number) {

    let tempBufferBTC = new Buffer(16)
    let tempBufferETH = new Buffer(16)
    let tempBufferLTC = new Buffer(16)
    let tempBufferXRP = new Buffer(16)

    let tempBufferWallet = new Buffer(16)
    let USD = BTC_USD + ETH_USD + LTC_USD + XRP_USD
    let tempI = Math.floor(USD)
    let tempF = (USD - tempI) * 100

    let numTrans = numTr
    for (let i = 0; i < 4; i++) {
        tempBufferWallet[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferWallet[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256

        tempBufferWallet[11 - i] = numTrans % 256
        numTrans = (numTrans - numTrans % 256) / 256
    }

    tempBufferWallet[15] = 4


    // BTC
    tempI = Math.floor(BTC_BAL)
    tempF = (BTC_BAL - tempI) * 100000000
    for (let i = 0; i < 4; i++) {
        tempBufferBTC[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferBTC[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    tempI = Math.floor(BTC_USD)
    tempF = (BTC_USD - tempI) * 100
    for (let i = 0; i < 4; i++) {
        tempBufferBTC[11 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferBTC[15 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    let BuffBTC = Buffer.concat([Buffer.from([0xB0, 0x50, 0x00]), Buffer.from([0x00]), Buffer.from([0x10]), tempBufferBTC, tempBufferWallet])

    reader.transmit(BuffBTC, 20, 2, (err, data) => {
    })

    // ETH
    tempI = Math.floor(ETH_BAL)
    tempF = (ETH_BAL - tempI) * 100000000
    for (let i = 0; i < 4; i++) {
        tempBufferETH[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferETH[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    tempI = Math.floor(ETH_USD)
    tempF = (ETH_USD - tempI) * 100
    for (let i = 0; i < 4; i++) {
        tempBufferETH[11 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferETH[15 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    let BuffETH = Buffer.concat([Buffer.from([0xB0, 0x50, 0x00]), Buffer.from([0x01]), Buffer.from([0x10]), tempBufferETH, tempBufferWallet])

    reader.transmit(BuffETH, 20, 2, (err, data) => {
    })


    // LTC
    tempI = Math.floor(LTC_BAL)
    tempF = (LTC_BAL - tempI) * 100000000
    for (let i = 0; i < 4; i++) {
        tempBufferLTC[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferLTC[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    tempI = Math.floor(LTC_USD)
    tempF = (LTC_USD - tempI) * 100
    for (let i = 0; i < 4; i++) {
        tempBufferLTC[11 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferLTC[15 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    let BuffLTC = Buffer.concat([Buffer.from([0xB0, 0x50, 0x00]), Buffer.from([0x02]), Buffer.from([0x10]), tempBufferLTC, tempBufferWallet])

    reader.transmit(BuffLTC, 20, 2, (err, data) => {
    })

    // XRP
    tempI = Math.floor(XRP_BAL)
    tempF = (XRP_BAL - tempI) * 100000000
    for (let i = 0; i < 4; i++) {
        tempBufferXRP[3 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferXRP[7 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    tempI = Math.floor(XRP_USD)
    tempF = (XRP_USD - tempI) * 100
    for (let i = 0; i < 4; i++) {
        tempBufferXRP[11 - i] = tempI % 256
        tempI = (tempI - tempI % 256) / 256

        tempBufferXRP[15 - i] = tempF % 256
        tempF = (tempF - tempF % 256) / 256
    }

    let BuffXRP = Buffer.concat([Buffer.from([0xB0, 0x50, 0x00]), Buffer.from([0x03]), Buffer.from([0x10]), tempBufferXRP, tempBufferWallet])

    reader.transmit(BuffXRP, 20, 2, (err, data) => {
    })

}

export async function updateTransactionsPCSC(txBTC: Array<any>, txETH: Array<any>, txLTC: Array<any>, txXRP: Array<any>) {

    let arrTx: Array<Buffer> = []
    for (let index in txBTC) {
        let code = Buffer.from([0x00])

        let type = new Buffer(1)
        if (txBTC[index].Type === 'incoming') {
            type[0] = 0x01
        } else {
            type[0] = 0x00
        }

        let status = new Buffer(1)
        if (txBTC[index].Status === 'Finished') {
            status[0] = 0x01
        } else {
            status[0] = 0x00
        }
        let unixTime = new Buffer(4)
        let time = txBTC[index].DateUnix
        for (let i = 0; i < 4; i++) {
            unixTime[3 - i] = time % 256
            time = (time - time % 256) / 256
        }

        let amount = new Buffer(8)
        let tempI = Math.floor(txBTC[index].Amount)
        let tempF = (txBTC[index].Amount - tempI) * 100000000
        for (let i = 0; i < 4; i++) {
            amount[3 - i] = tempI % 256
            tempI = (tempI - tempI % 256) / 256

            amount[7 - i] = tempF % 256
            tempF = (tempF - tempF % 256) / 256
        }


        let address = Buffer.from(txBTC[index].Address)
        let len = address.length
        len = len + 15

        arrTx.push(Buffer.concat([Buffer.from([0xB0, 0x90, 0x00, 0x00, len]), code, type, status, unixTime, amount, address]))
    }

    for (let index in txETH) {
        let code = Buffer.from([0x01])

        let type = new Buffer(1)
        if (txETH[index].Type === 'incoming') {
            type[0] = 0x01
        } else {
            type[0] = 0x00
        }

        let status = new Buffer(1)
        if (txETH[index].Status === 'Finished') {
            status[0] = 0x01
        } else {
            status[0] = 0x00
        }

        let unixTime = new Buffer(4)
        let time = txETH[index].DateUnix
        for (let i = 0; i < 4; i++) {
            unixTime[3 - i] = time % 256
            time = (time - time % 256) / 256
        }

        let amount = new Buffer(8)
        let tempI = Math.floor(txETH[index].Amount)
        let tempF = (txETH[index].Amount - tempI) * 100000000
        for (let i = 0; i < 4; i++) {
            amount[3 - i] = tempI % 256
            tempI = (tempI - tempI % 256) / 256

            amount[7 - i] = tempF % 256
            tempF = (tempF - tempF % 256) / 256
        }

        let address = Buffer.from(txETH[index].Address)

        let len = address.length
        len = len + 15

        arrTx.push(Buffer.concat([Buffer.from([0xB0, 0x90, 0x00, 0x00, len]), code, type, status, unixTime, amount, address]))
    }

    for (let index in txLTC) {
        let code = Buffer.from([0x02])

        let type = new Buffer(1)
        if (txLTC[index].Type === 'incoming') {
            type[0] = 0x01
        } else {
            type[0] = 0x00
        }

        let status = new Buffer(1)
        if (txLTC[index].Status === 'Finished') {
            status[0] = 0x01
        } else {
            status[0] = 0x00
        }

        let unixTime = new Buffer(4)
        let time = txLTC[index].DateUnix
        for (let i = 0; i < 4; i++) {
            unixTime[3 - i] = time % 256
            time = (time - time % 256) / 256
        }

        let amount = new Buffer(8)
        let tempI = Math.floor(txLTC[index].Amount)
        let tempF = (txLTC[index].Amount - tempI) * 100000000
        for (let i = 0; i < 4; i++) {
            amount[3 - i] = tempI % 256
            tempI = (tempI - tempI % 256) / 256

            amount[7 - i] = tempF % 256
            tempF = (tempF - tempF % 256) / 256
        }

        let address = Buffer.from(txLTC[index].Address)

        let len = address.length
        len = len + 15

        arrTx.push(Buffer.concat([Buffer.from([0xB0, 0x90, 0x00, 0x00, len]), code, type, status, unixTime, amount, address]))
    }

    for (let i = 0; i < arrTx.length; i++) {
        let answer = await sendTX(arrTx[i])
        console.log('OK SEND TX', answer.toString('hex'))

    }

}

function sendTX(bufferTx: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        reader.transmit(bufferTx, 4, 2, (err, data) => {
            if (err) {
                console.log('ERROR SEND TX', err)
                reject(err)
            } else {
               // console.log('OK SEND TX', data.toString('hex'))
                resolve(data)
            }
        })
    })
}