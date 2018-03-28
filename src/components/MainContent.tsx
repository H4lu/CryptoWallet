import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from './Table'
import { connect } from 'react-redux'

class MainContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.props.refresh()
  }

  render () {
    return (
    <div className = 'main'>
      <div className = 'main-content'>
          <div className = 'currency-block'>
            <header className = 'currencies-header'>Cryptocurrency: </header>
          <div className = 'currencies-container'>
            <Link to = '/btc-window' className = 'card-container'>
              <div className = 'card-upper-block'>
                <img src = 'data:image/png;base64,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'/>
                <p className = 'currency-name'> Bitcoin</p>
              </div>
              <hr/>
              <div className = 'card-bottom-block'>
              <div>
                   <p className = 'currency-amount-crypto text-inline'> {this.props.balance}</p><p className = 'currency-short-name text-inline'>BTC</p>
                  </div>
                  <div className = 'wrap'>
                    {(this.props.btcHourChange > 0) ? (
                      <p className = 'positive-percentage text-inline'>{this.props.btcHourChange}%</p>
                    ) : (
                      <p className = 'negative-percentage text-inline'>{this.props.btcHourChange}%</p>
                    )}
                   <p className = 'currency-amount-fiat text-inline'>{this.props.btcPrice}$</p>
                   </div>
              </div>
            </Link>
            <Link to = '/eth-window' className = 'card-container'>
              <div className = 'card-upper-block'>
                <img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUwSURBVHgBzZd7UFRVHMd/5959wKKjCOpkog4+iJ6G2jjaS8dyxsqcSZ1eDAM5TA6NEygNOk1ATI7IM2oEtnJhrMyG0iE16THZVFQMDNpfmI8W47nQwsKyu3f3nnP6XcCCBPbeuzT1/eeePed39ve5v/M7v3OuCNMgzjlxOqPMDQ2fUwhRIkyDZs5Zs6rPM5QUYVpVb7d/yyAECRCiKisbLfhab1FJfjVmReRaCFEhA7l8ncn4WMsBzEYBMlJTK40QgkICKij4dB4ILE3JoZEevjVAPE9CCNINpEAwk5gLnMSP6RaR7FBiYvk80CndSR0Rfd96QnghNo2EEHA6XcAo5jOBOaKJzm5uPHcadEhXhPLz35sJnB4BDpaJLVhiSmrpetAhXUBC+NwX8HH35BYkjBP+2t+59S8ClZScnI076kAwO1zFR1JeLH0aNEoTkPLGAVEowuZcNfYIdTB5d1EMaJAmoPyy2q3o5hkNU5bgLszTYK8eqLj43BwCJBub4aBBhJPtKalFG9TaqwaiBulZXIKVNznETskngWfIi5uO3zyRQAQIQs6OHdkmUCFVdSj/yKk4YMIxbFpGnQzL6/FBe3s39Dic4OjuhQGXG30LYDAYhp9jFGOOMLmaG7/4MZivoBFSElmgYg42o5Ro4G9wDwzBtau/Q6u9fRhK6VcgGWPg/KMPOtq7wOUaQFs2MoZ+CBf279pVtjCYv6ARmhm9chsy5VFKSR9W466OXqzK/SNVeVSK08HBoWGgUQDweSUYcnshEJBBNIgYNdHCBbZw1oysU3Z7NdMFVFhZG+33suO9vX3Rnbg0brcHEOwvpxMBje1TohkIBBDMAz5JQihjXPR8x4ULTXWXJvNpmIIHWlscsUO+Qd9EuapVks8PXd4er9EgLprKbsoINfxU274mYcNxxsVBDmQpvvTsiewmitA4cS6h0fuMQ+qXZws+A71Ah8tOLo2Kmh//20rLB/SSq8YkCmZMXuUMM6gECmBw6zHfEqlvRsXiFZE8IWHLXc1NdW2T+Zxyl4WBuY2K8NCarnDrvbct4QPOBXvwFrQRCeohiBCkFzjLjIywbDLHLWmKvT0yiciGD2XCr081L+hpbLPZwnoGo77BsC/jhLzhMXdaO5uaAgExPgkYZGJwVigR6ujoBhl3FBbHQZxWIVG5ZOPaWd0djqgHZC4fJBwSGIFHqyoyvpvKX9A6lJyc7KOy8BxWOhnpS2b4bmlZfsdjW9y9t9pIwL8a1ykXzfpxR1GEOcOBrf7qbOEry2IXhbc5Ij+hnH2NR846RiE9GIwqIEX7Mx6/BjJ7nSjpSSAGI3Vi9f3m6vh7li8+at2bA36+zmAk2+2/Sk8tXRjXnbK7JI0w+Bkht+EUEXd/DZXoMTW+VF+gios/DpfFMCvOeP5GH+ZJDyK+K5ho6eXmi26/OGsbYSQLl/BOHCWjNu2c0U1V1n0tavxoutEVlNfNA1n6Ad942bg/EciVKy32qwFZ3jy2HyPkx9MjqeqdjI9UutB2H8rcvdmBhToZPXnHDSiAAtn8T3sEstkvu2pAgzRfYbNe3vo9IcLbKkx/Ab+Qdf58rgwapOuS7xavY4Lz5snGMW+8lNCUqqr0ftAoXUC5aWluAQT8hCbdEwwzJMqrLt/XBDqk+8t1754nLjJGM7DGyONp4LSR978JOhXSt33sAv8JxtnRMV0tRPLuslpzPaBTIQHt3LmTCpawQ1h3WvGnxBk/bLMd6IH/WqUVZx58Kb2i9EYx/F/o4exsA0yD/gS8g0CYzoMt5gAAAABJRU5ErkJggg=='/>
                <p className = 'currency-name'>Ethereum</p>
              </div>
              <hr/>
              <div className = 'card-bottom-block'>
                <div>
                  <p className = 'currency-amount-crypto text-inline'> {this.props.ethBalance}</p><p className = 'currency-short-name text-inline'>ETH </p>
                </div>
                <div className = 'wrap'>
                  {(this.props.ethHourChange > 0) ? (
                    <p className = 'positive-percentage text-inline'>{this.props.ethHourChange}%</p>
                  ) : (
                    <p className = 'negative-percentage text-inline'>{this.props.ethHourChange}%</p>
                  )}
                  <p className = 'currency-amount-fiat text-inline'>{this .props.ethPrice}$</p>
                </div>
              </div>
            </Link>
            <Link to = '/ltc-window' className = 'card-container'>
              <div className = 'card-upper-block'>
                <img src = 'data:image/png;base64,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'/>
                <p className = 'currency-name'>Litecoin</p>
              </div>
              <hr/>
              <div className = 'card-bottom-block'>
                <div>
                   <p className = 'currency-amount-crypto text-inline'> {this.props.ltcBalance}</p><p className = 'currency-short-name text-inline'>LTC </p>
                </div>
                <div className = 'wrap'>

                {(this.props.ltcHourChange > 0) ? (
                  <p className = 'positive-percentage text-inline'>{this.props.ltcHourChange}%</p>
                ) : (
                  <p className = 'negative-percentage text-inline'>{this.props.ltcHourChange}%</p>
                )}
                <p className = 'currency-amount-fiat'>{this.props.ltcPrice}$</p>
                </div>
                </div>
            </Link>
           </div>
           <hr/>
          </div>
         <Table data = {this.props.lastTx} type = 'normal'/>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state: any, IMainContentProps) {
  console.log('MY STATE: ' + state)
  console.log(state)
  console.log(JSON.stringify(state))
  console.log(IMainContentProps)
  console.log('BALANCE STATE: ' + state.getBalance)
  return {
    balance: state.getBalance
  }
}
export default connect(mapStateToProps)(MainContent)
