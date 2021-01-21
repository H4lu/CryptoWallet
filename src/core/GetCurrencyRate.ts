import * as webRequest from 'web-request'

const requestURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
export default async function getCurrencyRate(): Promise<any> {
  try {
    let response = await webRequest.json(requestURL, {
      headers: { 'X-CMC_PRO_API_KEY': '3a1e2713-dedf-4ac1-80e4-ae983b275f9f' }
    })
    console.log('GET CURRENCY RATE', response)
    return response as any
  } catch (error) {
    console.log(error)
  }
}
