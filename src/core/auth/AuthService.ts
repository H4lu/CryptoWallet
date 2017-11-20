import * as fs from 'fs'

/*interface IAuthProp{

}*/

let fileName: string = __dirname + '/../crip.txt'
let data = fs.readFileSync(fileName)
let cripttxt = data.toString()
let authData = cripttxt.split('\n')

function getPin() {
  let pin: string = authData[0]
  pin = pin.replace('pin:','')
  console.log(pin)
  return pin.trim()
}

export function isValidUser(pin: number) {
  console.log(typeof(pin))
  if (Number(pin) === Number(getPin())) {
    console.log('equal')
    return true
  } else {
    console.log('not equal(')
    return false
  }
}
