import axios from 'axios'
// import Request from 'request'
export async function initialTransaction(withdrawal: string, pair: string, exchangeAmount: number, returnAddress: string) {
  const requestURL = 'https://shapeshift.io/sendamount'
  console.log(exchangeAmount)
  try {
    const response = await axios.post(requestURL,
      {
      'amount': exchangeAmount,
      'withdrawal': withdrawal,
      'pair': pair,
      returnAddress: returnAddress
    }, 
    {headers: {'content-type': 'application/json'}}
    )
    console.log(response.data)
    let respData: any = response.data
    let deposit = respData.deposit
    console.log('Deposit: ' + deposit)
    // console.log(response)
    console.log('Response content: ' + response.data)
    // console.log(responseBody)
    console.log('Response content valueOf ' + JSON.stringify(response.data)[2])
    console.log(JSON.parse(response.data))
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
  const requestURL = `https://shapeshift.io/rate/${firstCurrency}_${secondCurrency}`
  try {
    const response = await axios.get(requestURL)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function getMarketInfo(firstCurrency: string, secondCurrency: string) {
  const request = `https://shapeshift.io/marketinfo/${firstCurrency}_${secondCurrency}`
  console.log('Pairs: ' + firstCurrency + '_' + secondCurrency)
  try {
    const response = await axios.get(request)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function getSupportedCoins() {
  const requestURL = 'https://shapeshift.io/getcoins'
  try {
    const response = await axios.get(requestURL)
    console.log('Response of supported coins: ' + response.data)
    let parsedCoins = JSON.parse(response.data)
    for (let coin in parsedCoins) {
      console.log('Parsed coins: ' + parsedCoins[coin].status)
    }
    return response
  } catch (error) {
    console.log(error)
  }
}
