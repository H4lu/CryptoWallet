import React, {FC} from 'react'
import {DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils'

interface CarouselProps {
    currencyName: DisplayTransactionCurrency
    onClicked: () => void
}

export const CarouselElement: FC<CarouselProps> = (props) => {
    return (
        <div
            className={`carousel${props.currencyName}Icon`}
            onClick={() => props.onClicked()}
        />
    )
}

