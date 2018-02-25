import * as webRequest from 'web-request'

const requestURL = 'https://api.coinmarketcap.com/v1/ticker/'
export default async function getCurrencyRate() {
  try {
    let response = await webRequest.get(requestURL)
    return response
  } catch (error) {
    console.log(error)
  }
}
