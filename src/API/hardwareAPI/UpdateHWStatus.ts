// import { port } from './OpenPort'
import { reader } from './Reader'
import { info } from 'electron-log'
/* export function UpdateHWStatus (...data) {
  let startMessage = Buffer.from([ 0x9c,0x9c,0x42 ])
  let endMessage = Buffer.from([ 0x9a,0x9a ])
  let message = new Buffer([])
  for (let item in data) {
    let tempBuffer = new Buffer(16)
    tempBuffer.write(data[item].toString(),0,data[item].length, 'ascii')
    info('TEMP BUFFER: ',tempBuffer)
    message = Buffer.concat([message, tempBuffer])
    info('MESSAGE BUFFER: ',message)
  }
  let dataToSend = Buffer.concat([startMessage, message, endMessage])
  port.write(dataToSend)
  port.on('data', (data) => {
    info('GOT THIS DATA: ' + data.toString('hex'))
    port.removeAllListeners('data')
  })
}
*/

export function UpdateHWStatusPCSC(...data) {
  let message = new Buffer([])
  for (let item in data) {
    let tempBuffer = new Buffer(16)
    tempBuffer.write(data[item].toString(),0,data[item].length, 'ascii')
    info('TEMP BUFFER: ',tempBuffer)
    message = Buffer.concat([message, tempBuffer])
    info('MESSAGE BUFFER: ',message)
  }
  let Buff = Buffer.concat([Buffer.from([0xB1,0x50,0x00,0x00,0x60]),message])
  reader.transmit(Buff,20,2, (err, data) => {
    info('ERROR IN UPDATEHW',err)
    info('DAA IN UPDATE HW',data)
    reader.transmit(Buff,20,2, (err, data) => {
      info('ERROR IN UPDATEHW',err)
      info('DAA IN UPDATE HW',data)
      reader.transmit(Buff,20,2, (err, data) => {
        info('ERROR IN UPDATEHW',err)
        info('DAA IN UPDATE HW',data)
        reader.transmit(Buff,20,2, (err, data) => {
          info('ERROR IN UPDATEHW',err)
          info('DAA IN UPDATE HW',data)
        })
      })
    })
  })

}
