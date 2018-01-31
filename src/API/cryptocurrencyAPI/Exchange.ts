import WebRequest from 'web-request'
// import Request from 'request'
export async function initialTransaction(withdrawal: string, pair: string, exchangeAmount: number, returnAddress: string) {
  const requestURL = 'https://shapeshift.io/shift'
  console.log(exchangeAmount)
  try {
    const response = await WebRequest.post(requestURL,{headers: {
      'content-type': 'application/json'
    },
      json: true,
      body: {
        'withdrawal': withdrawal,
        'pair': pair,
        returnAddress: returnAddress
      }})
    console.log(response.content)
    let respData: any = response.content
    console.log('Deposit by object: ' + Object(response.content).deposit)
    let deposit = respData.deposit
    console.log('Deposit: ' + deposit)
    // console.log(response)
    console.log('Response content: ' + response.content)
    // console.log(responseBody)
    console.log('Response content valueOf ' + JSON.stringify(response.content)[2])
    console.log(JSON.parse(response.content))
    /*
apiPubKey:"shapeshift"
deposit:"3QsTmBVtsr43DkFwS4K9HenScdmagRa6tY"
depositType:"BTC"
orderId:"539cba48-b48b-4acd-8e15-09b9db9aab0e"
public:null
returnAddress:"12TH5YZ3LyiLPiCM1WXNzYMJVobEhbYHgT"
returnAddressType:"BTC"
withdrawal:"0xc7f0d18edff316a9caa5d98ff26369216b38d9e1"
withdrawalType:"ETH"
    console.log('Response of shapeShif: ' + response.content)
    console.log('Response: ' + response)
    console.log(' Respsss: ' + response.message._read(response.contentLength))
    console.log('Deposit address: ' + response.content)
    console.log('Parsed : ' + JSON.parse(response.content))
    console.log('Parsed: ' + JSON.parse(response.method.toString()))
    // console.log('Parsed response deposit:' + JSON.parse(response.content.toString()))
    */
  } catch (error) {
    console.log(error)
  }
}

export async function getRate(firstCurrency: string, secondCurrency: string) {
  const requestURL = 'https://shapeshift.io/rate/' + firstCurrency + '_' + secondCurrency
  try {
    const response = await WebRequest.get(requestURL)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function getMarketInfo(firstCurrency: string, secondCurrency: string) {
  const request = 'https://shapeshift.io/marketinfo/' + firstCurrency + '_' + secondCurrency
  try {
    const response = await WebRequest.get(request)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function getSupportedCoins() {
  const requestURL = 'https://shapeshift.io/getcoins'
  try {
    const response = await WebRequest.get(requestURL)
    console.log('Response of supported coins: ' + response.content)
    let parsedCoins = JSON.parse(response.content)
    for (let coin in parsedCoins) {
      console.log('Parsed coins: ' + parsedCoins[coin].status)
    }
    return response
  } catch (error) {
    console.log(error)
  }
}
