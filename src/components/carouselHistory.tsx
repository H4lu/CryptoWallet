import React, {FC, useState, useEffect} from 'react'
import {Carousel} from './carousel'
import {CarouselTable} from "./carouselTable";
import { DisplayTransaction, DisplayTransactionCurrency } from '../api/cryptocurrencyApi/utils';
import { currencyToIndex } from '../core/carouselHelper';

interface CarouselHistoryProps {
    stateSR: (arg: boolean) => void,
    refresh: () => void,
    lastTxBTC: Array<DisplayTransaction>,
    lastTxETH: Array<DisplayTransaction>,
    lastTxLTC: Array<DisplayTransaction>,
    lastTxXRP: Array<DisplayTransaction>
}

export const CarouselHistory: FC<CarouselHistoryProps> = (props) => {
    const [activeCurrency, setActiveCurrency] = useState<DisplayTransactionCurrency>("BTC")

    useEffect(() => {
        props.stateSR(false)
    }, [])

    return (
        <div className='windowPay'>
            <div className='payWindowTable'>
                <Carousel
                        setActiveCurrency={setActiveCurrency}
                        activeCurrencyIndex={currencyToIndex(activeCurrency)}
                        />
                <CarouselTable 
                            activeCurrency={activeCurrency}
                            refresh={props.refresh}
                            lastTxBTC = {props.lastTxBTC}
                            lastTxLTC = {props.lastTxLTC}
                            lastTxETH = {props.lastTxETH}
                            lastTxXRP = {props.lastTxXRP}
                            />
            </div>
        </div>
    )
}
