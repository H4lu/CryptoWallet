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
  let xorData = []
  for (let item in data) {
    xorData.push(data[item].toString())
  }
  info('GOT THIS DATA', data)
  for (let item in data) {
    info('DATA',data[item])
    let tempBuffer = new Buffer(16)
    tempBuffer.write(data[item].toString(),0,data[item].length, 'ascii')
    info('TEMP BUFFER: ',tempBuffer)
    message = Buffer.concat([message, tempBuffer])
    info('MESSAGE BUFFER: ',message)
  }
  info('DATA TO XOR',data)
  let xor = 0
  for (let i in xorData) {
    for (let j in xorData[i]) {
      info('SECOND FOR',xorData[i][j].toString().charCodeAt(0))
      xor = xor ^ xorData[i][j].toString().charCodeAt(0)
      info('XOR',xor)
    }
  }
  let xorBuf = Buffer.from(xor.toString(16),'hex')
  info('XOR BUF',xorBuf)
  let Buff = Buffer.concat([Buffer.from([0xB1,0x50,0x00]),xorBuf,Buffer.from([0x60]),message])
  info('DATA',Buff)
  reader.transmit(Buff,20,2, (err, data) => {
    info('ERROR IN UPDATEHW',err)
    info('DAA IN UPDATE HW',data)
  })

}
