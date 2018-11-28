import * as webRequest from 'web-request'
import { info } from 'electron-log'
const requestURL = 'https://api.coinmarketcap.com/v1/ticker/'
export default async function getCurrencyRate() {
  try {
    let response = await webRequest.get(requestURL)
    return response
  } catch (error) {
    info(error)
  }
}
