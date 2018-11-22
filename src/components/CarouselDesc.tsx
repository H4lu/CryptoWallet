import * as React from 'react'
import {Link} from "react-router-dom";

export class CarouselDesc extends React.Component<any, any> {
    currencyName:string
    cryptoBalans: string
    fiatBalance: string
    pathSend: string
    pathRecive: string
    state = {
    activeCurrency:this.props.activeCurrency
    }
    constructor(props: any) {
        super(props)

        this.updateProps = this.updateProps.bind(this)
    }
    updateProps(){
        switch(this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.cryptoBalans = this.props.btcBalance.toString() + '  BTC'
                this.fiatBalance = this.props.btcPrice.toString()
                this.pathSend = '/btc-window'
                this.pathRecive = '/btc-window'
                break
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.cryptoBalans = this.props.ethBalance.toString() + '  ETH'
                this.fiatBalance = this.props.ethPrice.toString()
                this.pathSend = '/eth-window'
                this.pathRecive = '/eth-window'
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.cryptoBalans = this.props.ltcBalance.toString() + '  LTC'
                this.fiatBalance = this.props.ltcPrice.toString()
                this.pathSend = '/ltc-window'
                this.pathRecive = '/ltc-window'
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.cryptoBalans = this.props.btcBalance.toString() + '  XRP'
                this.fiatBalance = this.props.btcPrice.toString()
                this.pathSend = '/btc-window'
                this.pathRecive = '/btc-window'
                break
            }
        }

    }
/*componentDidMount(){
    this.updateProps()
}*/
    render() {
        return (
            <div>
                {this.updateProps()}
                <p className='currencyName'>{this.currencyName}</p>
                <p className='currencyCryptoBalance'>{this.cryptoBalans}</p>
                <p className='currencyFiatBalance'>{this.fiatBalance}   USD </p>
                <div className='blockButtonSendRecieve'>
                    <Link to={this.pathSend}>
                        <button className='sendCurrencybutton'/>
                    </Link>
                    <Link to={this.pathRecive}>
                        <button className='recieveCurrencybutton'/>
                    </Link>
                </div>
            </div>
        )
    }
}