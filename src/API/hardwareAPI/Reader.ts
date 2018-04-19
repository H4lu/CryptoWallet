import * as pcsc from 'pcsclite'

let reader: pcsc
export { reader }
export function setReader(readerObject) {
  reader = readerObject
}
