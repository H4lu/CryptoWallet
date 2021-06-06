import * as React from 'react'
import CarouselElement from './CarouselElement'
import Coverflow from "../../react-coverflow.js"

interface CarouselProps {
    setActiveCurrency(currency: string) => void
}

export class Carousel extends React.PureComponent<CarouselProps, any> {

    constructor(props: any) {
        super(props)
    }
   
    render() {
        return(
            <div>{}
                <Coverflow width={1000}
                height={180}
                clickable = {true}
                displayQuantityOfSide={4}
                navigation={false}
                enableHeading={false}
                active={this.props.activeCurrency}
            >{/* TODO: map from currency list from HOC(App.tsx or CarouselHOC) */}
                <CarouselElement currencyName = "BTC" onClicked = {() => this.props.setActiveCurrency("BTC")} />
                <CarouselElement currencyName = "ETH" onClicked = {() => this.props.setActiveCurrency("ETH")} />
                <CarouselElement currencyName = "LTC" onClicked = {() => this.props.setActiveCurrency("LTC")} />
                <CarouselElement currencyName = "XRP" onClicked = {() => this.props.setActiveCurrency("XRP")} />
            </Coverflow>

        </div>
        )
    }
}