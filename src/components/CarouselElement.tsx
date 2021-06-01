import * as React from 'react'
import { BTC_ICON, LTC_ICON, ETH_ICON, XRP_ICON } from "../core/paths"

interface ICarouselProps {
    currencyName: string
    onClicked: Function
}

export default class CarouselElement extends React.Component<ICarouselProps, {}> {
    private currency: string
    constructor(props: any) {
        super(props)

        this.chooseIcon = this.chooseIcon.bind(this)
    }

    chooseIcon() {
        switch(this.props.currencyName) {
            case "BTC": {
                this.currency = BTC_ICON
                break
            }
            case "LTC": {
                this.currency = LTC_ICON
                break
            }
            case "ETH": {
                this.currency = ETH_ICON
                break
            }
            case "XRP": {
                this.currency = XRP_ICON
                break
            }
        }
    }

    render() {
      this.chooseIcon()
        return(
            <div>
             
                <img
                    src = {this.currency}
                    style={{ display: 'block', width: '50%' }}
                    onClick = {() => this.props.onClicked()}/>
            </div>

        )
    }

}