export function UpdateHWStatus (port, ...data) {
  let startMessage = Buffer.from([ 0x9c,0x9c,0x42 ])
  let endMessage = Buffer.from([ 0x9a,0x9a ])
  let message = new Buffer([])
  for (let item in data) {
    let tempBuffer = new Buffer(16)
    tempBuffer.write(data[item].toString(),0,data[item].length, 'ascii')
    console.log('TEMP BUFFER: ',tempBuffer)
    message = Buffer.concat([message, tempBuffer])
    console.log('MESSAGE BUFFER: ',message)
  }
  let dataToSend = Buffer.concat([startMessage, message, endMessage])
  port.write(dataToSend)
  port.on('data', (data) => {
    console.log('GOT THIS DATA: ' + data.toString('hex'))
    port.close()
  })
}
