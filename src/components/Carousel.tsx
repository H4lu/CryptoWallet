import * as React from 'react'
//import Coverflow from 'react-coverflow'
import { log } from 'electron-log'
import { BTC_ICON, LTC_ICON, XRP_ICON } from "../core/paths"
import CarouselElement from './CarouselElement'
import Coverflow from "../../react-coverflow.js"
export class Carousel extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props)

   
    }


   
    render() {
        return(
            <div>
                <Coverflow width={1000}
                height={106}
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