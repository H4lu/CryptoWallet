// import { port } from './OpenPort'
import { reader } from './Reader'
import { info } from 'electron-log'


//export function UpdateHWStatusPCSC(...data) {
export function UpdateHWStatusPCSC(BTC_BAL: number, BTC_USD: number, ETH_BAL: number, ETH_USD: number, LTC_BAL: number, LTC_USD: number, XRP_BAL: number, XRP_USD: number, ) {

    let tempBufferBTC = new Buffer(16)
    let tempBufferETH = new Buffer(16)
    let tempBufferLTC = new Buffer(16)
    let tempBufferXRP = new Buffer(16)

    // BTC
    let tempI = Math.floor(BTC_BAL)
    let tempF = (BTC_BAL - tempI)*100000000
    for (let i=0; i<4; i++)
    {
      tempBufferBTC[3-i]=tempI%256
      tempI = (tempI - tempI%256)/256

      tempBufferBTC[7-i]=tempF%256
      tempF = (tempF - tempF%256)/256
    }

    tempI = Math.floor(BTC_USD)
    tempF = (BTC_USD - tempI)*100
    for (let i=0; i<4; i++)
    {
        tempBufferBTC[11-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferBTC[15-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    let BuffBTC = Buffer.concat([Buffer.from([0xB0,0x50,0x00]),Buffer.from([0x00]),Buffer.from([0x10]),tempBufferBTC])

    reader.transmit(BuffBTC,20,2, (err, data) => {
    })

    // ETH
    tempI = Math.floor(ETH_BAL)
    tempF = (ETH_BAL - tempI)*100000000
    for (let i=0; i<4; i++)
    {
        tempBufferETH[3-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferETH[7-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    tempI = Math.floor(ETH_USD)
    tempF = (ETH_USD - tempI)*100
    for (let i=0; i<4; i++)
    {
        tempBufferETH[11-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferETH[15-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    let BuffETH = Buffer.concat([Buffer.from([0xB0,0x50,0x00]),Buffer.from([0x01]),Buffer.from([0x10]),tempBufferETH])

    reader.transmit(BuffETH,20,2, (err, data) => {
    })


    // LTC
    tempI = Math.floor(LTC_BAL)
    tempF = (LTC_BAL - tempI)*100000000
    for (let i=0; i<4; i++)
    {
        tempBufferLTC[3-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferLTC[7-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    tempI = Math.floor(LTC_USD)
    tempF = (LTC_USD - tempI)*100
    for (let i=0; i<4; i++)
    {
        tempBufferLTC[11-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferLTC[15-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    let BuffLTC = Buffer.concat([Buffer.from([0xB0,0x50,0x00]),Buffer.from([0x02]),Buffer.from([0x10]),tempBufferLTC])

    reader.transmit(BuffLTC,20,2, (err, data) => {
    })

    // XRP
    tempI = Math.floor(XRP_BAL)
    tempF = (XRP_BAL - tempI)*100000000
    for (let i=0; i<4; i++)
    {
        tempBufferXRP[3-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferXRP[7-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    tempI = Math.floor(XRP_USD)
    tempF = (XRP_USD - tempI)*100
    for (let i=0; i<4; i++)
    {
        tempBufferXRP[11-i]=tempI%256
        tempI = (tempI - tempI%256)/256

        tempBufferXRP[15-i]=tempF%256
        tempF = (tempF - tempF%256)/256
    }

    let BuffXRP = Buffer.concat([Buffer.from([0xB0,0x50,0x00]),Buffer.from([0x03]),Buffer.from([0x10]),tempBufferXRP])

    reader.transmit(BuffXRP,20,2, (err, data) => {
    })

}
