import SerialPort from 'serialport'
export let port: SerialPort
export function openPort(portName: string): Promise<SerialPort> {
  port = new SerialPort(portName, { autoOpen: false, baudRate: 115200 })
  port.open()
  return new Promise((resolve, reject) => {
    port.on('open', data => {
      console.log('Port opened! data: ' + data)
      console.log('RESOLVING T?HIS PORT:', port)
      resolve(port)
    })
    port.on('error', error => {
      console.log('Error occured while opening: ' + console.log(error))
      reject(error)
    })
    port.on('disconnect',() => {
      console.log('disconnect detected')
      port.close(() => {
        console.log('Port closed by disconnect!')
      })
    })
    port.on('close', () => {
      console.log('Port closed!')
    })
  })
}
