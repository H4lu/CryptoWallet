import * as React from 'react'
//import Coverflow from 'react-coverflow'
import { log } from 'electron-log'
import { BTC_ICON, LTC_ICON, XRP_ICON } from "../core/paths"
import CarouselElement from './CarouselElement'
import Coverflow from "../../react-coverflow.js"
export class Carousel extends React.Component<any, any> {
    
    constructor(props: any) {
        super(props)
    }

    render() {
        return(
            <div>

                <Coverflow width={1080}
                height={106}
                clickable = {true}
                displayQuantityOfSide={4}
                navigation={false}
                enableHeading={false}
                active={3}
                otherFigureScale={0.7}
              
            >{/* TODO: map from currency list from HOC(App.tsx or CarouselHOC) */}

                <CarouselElement currencyName = "BTC" onClicked = {() => { log("BTC CLICKED!") }} />
                <CarouselElement currencyName = "LTC" onClicked = {() => { log("LTC CLICKED!") }} />
                <CarouselElement currencyName = "ETH" onClicked = {() => { log("ETH CLICKED!") }} />
                <CarouselElement currencyName = "XRP" onClicked = {() => { log("XRP CLICKED!") }} />
                
                
        
            </Coverflow>

        </div>

        )
    }
}