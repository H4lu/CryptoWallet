import React, {Component} from 'react'
import { DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils';
import { Carousel } from './Carousel'
import {CarouselDesc} from "./CarouselDesc";

interface CarouselHOCState {
    activeCurrencyIndex: number,
    isNeedShift: boolean
}
interface CarouselHOCProps {
    stateSR: (arg: boolean) => void,
    activeCurrency: DisplayTransactionCurrency,
    setActiveCurrency: (currency: DisplayTransactionCurrency) => void,
    btcBalance: number,
    ltcBalance: number,
    ethBalance: number,
    btcPrice: number,
    ltcPrice: number,
    ethPrice: number,
}

export class CarouselHOC extends Component<CarouselHOCProps, CarouselHOCState> {
    constructor(props: any) {
        super(props)
        this.props.stateSR(false)
        this.state = {
            activeCurrencyIndex: this.currencyToIndex(),
            isNeedShift: true
         };
        this.currencyToIndex = this.currencyToIndex.bind(this)
    
    }
    componentDidMount() {
        if (this.state.isNeedShift) {
            this.setState({ activeCurrencyIndex: this.currencyToIndex() + 1 })
            this.setState({ activeCurrencyIndex: this.currencyToIndex() - 1 })//kostil for choosing current active 
            this.setState({ isNeedShift: false })
        }
    }
    currencyToIndex() {
        switch (this.props.activeCurrency) {
            case "BTC": return 1;
            case "ETH": return 2;
            case "LTC": return 3;
            case "XRP": return 4;
            default: return 1;
        }
    }

    render() {
        return(
            <div className='windowPay'>
                <div className='payWindow'>
                    <Carousel 
                        setActiveCurrency = {this.props.setActiveCurrency} 
                        activeCurrencyIndex = {this.state.activeCurrencyIndex}/>
                    <CarouselDesc activeCurrency = {this.props.activeCurrency} 
                                btcBalance={this.props.btcBalance} 
                                ltcBalance={this.props.ltcBalance} 
                                ethBalance={this.props.ethBalance}
                                btcPrice={this.props.btcPrice} 
                                ltcPrice={this.props.ltcPrice} 
                                ethPrice={this.props.ethPrice}/>
                </div>
            </div>
        )
    }

}