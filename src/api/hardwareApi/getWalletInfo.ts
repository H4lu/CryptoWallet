// @ts-ignore
import {reader} from './reader'


export function getInfoPCSC(): Promise<number> {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.transmit(Buffer.from([0xB0, 0x10, 0x00, 0x00, 0x00]), 4, 2, async (err, data) => {
            if (err) {
                console.log(err)
                reject(new Error(err))
            } else {
                switch (data.toString('hex')) {
                    case '9000': {
                        try {
                            let realStatus = await getRealState()
                            if (realStatus === '6e00') {
                                resolve(3)
                            } else {
                                resolve(0)
                            }
                        } catch (err) {
                            console.log('ERROR IN GETINFO', err)
                        }
                        break
                    }
                    case '6b80': {
                        resolve(1)
                        break
                    }
                    case '6b81': {
                        resolve(2)
                        break
                    }
                    case '6b82': {
                        resolve(3)
                        break
                    }
                    case '6b83': {
                        resolve(4)
                        break
                    }

                }
            }
        })
    })
}


function getRealState() {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.transmit(Buffer.from([0xB0, 0x10, 0x00, 0x00, 0x00]), 255, 2, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


