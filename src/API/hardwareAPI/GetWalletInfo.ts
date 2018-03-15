import SerialPort from 'serialport'

export async function wrapper(): Promise<any> {
  try {
    const res = await Promise.resolve()
    return res
  } catch (err) {
    throw err
  }
}

export async function findDevice(): Promise<any> {
  return new Promise((resolve, reject) => {
    SerialPort.list().then(result => {
      console.log(result.find())
      for (let item in result) {
        console.log('VENDOR ID: ' + result[item].vendorId)
        if (result[item].vendorId === '1FC9') resolve(result[item].comName)
      }
      reject('NO DEVICES FOUND')
    }).catch(error => console.log(error))
  }).catch(error => {
    console.log(error)
  })
}
