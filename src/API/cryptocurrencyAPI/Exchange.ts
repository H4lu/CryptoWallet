import WebRequest from 'web-request'
// import Request from 'request'
export async function initialTransaction(withdrawal: string, pair: string, exchangeAmount: number, returnAddress: string) {
  const requestURL = 'https://shapeshift.io/shift'
  console.log(exchangeAmount)
  /* Request.post({
    url: requestURL,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      'withdrawal': withdrawal,
      'pair': pair,
      returnAddress: returnAddress
    },
    json: true
  },
  (res, err, body) => {
    console.log(res)
    console.log(err)
    console.log(body)
  })
}*/
  try {
    const response = await WebRequest.post(requestURL,{headers: {
      'content-type': 'application/json'
    }, json: true, body: {
      'withdrawal': withdrawal,
      'pair': pair,
      returnAddress: returnAddress
    }})
    console.log(response)
    let respData = response.content
    console.log('Deposit address: ' + JSON.parse(respData))
    console.log(response.content)
    console.log('Message: ' + response.message)

    /*
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

export async function getSupportedCoins() {
  const requestURL = 'https://shapeshift.io/getcoins'
  try {
    const response = await WebRequest.get(requestURL)
    console.log('Response of supported coins: ' + response.content)
  } catch (error) {
    console.log(error)
  }
}
