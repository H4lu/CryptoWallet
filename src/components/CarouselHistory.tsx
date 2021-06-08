import React, {PureComponent} from 'react'
import {Carousel} from './Carousel'
import {CarouselTable} from "./CarouselTable";
import { DisplayTransaction, DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils';

interface CarouselHistoryState {
    activeCurrencyIndex: number,
    isNeedShift: boolean
}

interface CarouselHistoryProps {
    setActiveCurrency: (currency: string) => void,
    activeCurrency: DisplayTransactionCurrency, // TODO: store as string, convert to index inside component
    stateSR: (arg: boolean) => void,
    refresh: () => void,
    lastTxBTC: Array<DisplayTransaction>,
    lastTxETH: Array<DisplayTransaction>,
    lastTxLTC: Array<DisplayTransaction>,
    lastTxXRP: Array<DisplayTransaction>
}
export class CarouselHistory extends PureComponent<CarouselHistoryProps, CarouselHistoryState> {
    constructor(props: any) {
        super(props)
        this.props.stateSR(false)
        this.currencyToIndex = this.currencyToIndex.bind(this)
        this.state = {
            activeCurrencyIndex:  this.currencyToIndex(),
            isNeedShift: true
        };
    }

    componentDidMount() {
        if (this.state.isNeedShift) {
            this.setState({activeCurrencyIndex: this.currencyToIndex() + 1})
            this.setState({activeCurrencyIndex: this.currencyToIndex() - 1})//kostil for choosing current active
            this.setState({isNeedShift: false})
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
        return (
            <div className='windowPay'>
                <div className='payWindowTable'>
                    <Carousel
                            setActiveCurrency={this.props.setActiveCurrency}
                            activeCurrencyIndex={this.state.activeCurrencyIndex}
                            />
                    <CarouselTable 
                                activeCurrency={this.props.activeCurrency}
                                refresh={this.props.refresh}
                                lastTxBTC = {this.props.lastTxBTC}
                                lastTxLTC = {this.props.lastTxLTC}
                                lastTxETH = {this.props.lastTxETH}
                                lastTxXRP = {this.props.lastTxXRP}
                                />
                </div>
            </div>
        )
    }
}