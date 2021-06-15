import React, {FC, useState, useEffect} from 'react'
import { currencyToIndex } from '../core/carouselHelper';
import { DisplayTransactionCurrency } from '../api/cryptocurrencyApi/utils';
import { Carousel } from './carousel'
import {CarouselDesc} from "./carouselDesc";

interface WalletCarouselProps {
    stateSR: (arg: boolean) => void,
    btcBalance: number,
    ltcBalance: number,
    ethBalance: number,
    btcPrice: number,
    ltcPrice: number,
    ethPrice: number,
    activeCurrency: DisplayTransactionCurrency,
    setActiveCurrency: (currency: DisplayTransactionCurrency) => void
}

export const WalletCarousel: FC<WalletCarouselProps> = (props) => {
    useEffect(() => {
        props.stateSR(false);
    }, [])

    return(
        <div className='windowPay'>
            <div className='payWindow'>
                <Carousel 
                    setActiveCurrency = {props.setActiveCurrency} 
                    activeCurrencyIndex = {currencyToIndex(props.activeCurrency)}/>
                <CarouselDesc 
                            activeCurrency = {props.activeCurrency} 
                            btcBalance={props.btcBalance} 
                            ltcBalance={props.ltcBalance} 
                            ethBalance={props.ethBalance}
                            btcPrice={props.btcPrice} 
                            ltcPrice={props.ltcPrice} 
                            ethPrice={props.ethPrice}/>
            </div>
        </div>
    )
}

