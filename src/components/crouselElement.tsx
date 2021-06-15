import React, {FC} from 'react'

interface CarouselProps {
    currencyName: string
    onClicked: () => void
}

const chooseIcon = (currencyName: string): string => {
    switch(currencyName) {
        case "BTC": {
            return "carouselBTCIcon"
            
        }
        case "LTC": {
            return "carouselLTCIcon"
           
        }
        case "ETH": {
            return "carouselETHIcon"
        }
        case "XRP": {
            return "carouselXRPIcon" 
        }
    }
}

export const CarouselElement: FC<CarouselProps> = (props) => {
    return (
        <div 
            className = {chooseIcon(props.currencyName)}
            onClick = {() => props.onClicked()}
        />
    )
}

