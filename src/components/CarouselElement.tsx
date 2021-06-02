import * as React from 'react'
import { BTC_ICON, LTC_ICON, ETH_ICON, XRP_ICON } from "../core/paths"

interface CarouselState {
    currencyStyle: string
}
interface CarouselProps {
    currencyName: string
    onClicked: Function
}

export default class CarouselElement extends React.Component<CarouselProps, CarouselState> {
    constructor(props: any) {
        super(props)
        this.state = {
            currencyStyle: ''
        }
    }

    componentDidMount() {
        this.chooseIcon()
    }

    chooseIcon = () => {
        switch(this.props.currencyName) {
            case "BTC": {
                this.setState({ currencyStyle: "carouselBTCIcon" })
                break
            }
            case "LTC": {
                this.setState({ currencyStyle: "carouselLTCIcon" })
                break
            }
            case "ETH": {
                this.setState({ currencyStyle: "carouselETHIcon" })
                break
            }
            case "XRP": {
                this.setState({ currencyStyle: "carouselXRPIcon" })
                break
            }
        }
    }

    render() {
        return(
            <div 
                className = {this.state.currencyStyle}
                onClick = {() => this.props.onClicked()}
                >
            </div>
        )
    }

}