import * as fs from 'fs'

/*interface IAuthProp{

}*/

let fileName: string = 'crip.txt'
let data = fs.readFileSync(fileName)
let cripttxt = data.toString()
let authData = cripttxt.split('\n')

function getLogin() {
  let login: string = authData[0]
  login = login.replace('login:','')
  return login
}
function getPassword() {
  let password: string = authData[1]
  password = password.replace('password:','')
  return password

}
export function isValidUser(name: string, password: string) {
  if (name === getLogin() && password === getPassword()) {
    return true
  }
}
