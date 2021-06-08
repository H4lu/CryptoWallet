import React, {FC, useState, useEffect} from 'react'
import { currencyToIndex } from '../core/carouselHelper';
import { DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils';
import { Carousel } from './Carousel'
import {CarouselDesc} from "./CarouselDesc";

interface WalletCarouselProps {
    stateSR: (arg: boolean) => void,
    btcBalance: number,
    ltcBalance: number,
    ethBalance: number,
    btcPrice: number,
    ltcPrice: number,
    ethPrice: number,
}

export const WalletCarousel: FC<WalletCarouselProps> = (props) => {
    const [activeCurrency, setActiveCurrency] = useState<DisplayTransactionCurrency>('BTC')

    useEffect(() => {
        props.stateSR(false);
    }, [])

    return(
        <div className='windowPay'>
            <div className='payWindow'>
                <Carousel 
                    setActiveCurrency = {setActiveCurrency} 
                    activeCurrencyIndex = {currencyToIndex(activeCurrency)}/>
                <CarouselDesc 
                            activeCurrency = {activeCurrency} 
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

