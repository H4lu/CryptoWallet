import React, {FC} from 'react'
import {CarouselElement} from './CarouselElement'
import Coverflow from "../react-coverflow.js"

interface CarouselProps {
    setActiveCurrency: (currency: string) => void,
    activeCurrencyIndex: number
}

export const Carousel: FC<CarouselProps> = (props: CarouselProps) => {
    return (
        <div>
            <Coverflow width={1000}
                height={180}
                clickable = {true}
                displayQuantityOfSide={4}
                navigation={false}
                enableHeading={false}
                active={props.activeCurrencyIndex}
            >
                <CarouselElement currencyName = "BTC" onClicked = {() => props.setActiveCurrency("BTC")} />
                <CarouselElement currencyName = "ETH" onClicked = {() => props.setActiveCurrency("ETH")} />
                <CarouselElement currencyName = "LTC" onClicked = {() => props.setActiveCurrency("LTC")} />
                <CarouselElement currencyName = "XRP" onClicked = {() => props.setActiveCurrency("XRP")} />
            </Coverflow>
        </div>    
    )
}


