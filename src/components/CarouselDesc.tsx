import * as React from 'react'

export class CarouselDesc extends React.Component<any, any> {
    currencyName:string
    cryptoBalans: string
    fiatBalance: string
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
                this.cryptoBalans = this.props.btcBalance.toString() + ' BTC'
                this.fiatBalance = this.props.btcPrice.toString()
                break
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.cryptoBalans = this.props.ethBalance.toString() + ' ETH'
                this.fiatBalance = this.props.ethPrice.toString()
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.cryptoBalans = this.props.ltcBalance.toString() + ' LTC'
                this.fiatBalance = this.props.ltcPrice.toString()
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.cryptoBalans = this.props.btcBalance.toString() + ' XRP'
                this.fiatBalance = this.props.btcPrice.toString()
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
                <p className='currencyFiatBalance'>{this.fiatBalance}  USD </p>

            </div>
        )
    }
}