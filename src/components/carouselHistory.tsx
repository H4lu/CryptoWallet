import React, {FC, useEffect} from 'react'
import {Carousel} from './carousel'
import {CarouselTable} from "./carouselTable";
import {DisplayTransaction, DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils';
import {currencyToIndex} from '../core/carouselHelper';

interface CarouselHistoryProps {
    stateSR: (arg: boolean) => void,
    refresh: () => void,
    lastTxBTC: Array<DisplayTransaction>,
    lastTxETH: Array<DisplayTransaction>,
    lastTxLTC: Array<DisplayTransaction>,
    lastTxXRP: Array<DisplayTransaction>,
    activeCurrency: DisplayTransactionCurrency,
    setActiveCurrency: (currency: DisplayTransactionCurrency) => void
}

export const CarouselHistory: FC<CarouselHistoryProps> = (props) => {
    useEffect(() => {
        props.stateSR(false)
    }, [])

    return (
        <div className='windowPay'>
            <div className='payWindowTable'>
                <Carousel
                    setActiveCurrency={props.setActiveCurrency}
                    activeCurrencyIndex={currencyToIndex(props.activeCurrency)}
                />
                <CarouselTable
                    activeCurrency={props.activeCurrency}
                    refresh={props.refresh}
                    lastTxBTC={props.lastTxBTC}
                    lastTxLTC={props.lastTxLTC}
                    lastTxETH={props.lastTxETH}
                    lastTxXRP={props.lastTxXRP}
                />
            </div>
        </div>
    )
}
