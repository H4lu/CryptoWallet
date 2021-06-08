import React, {FunctionComponent} from 'react'

// interface CarouselState {
//     currencyStyle: string
// }
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

export const CarouselElement: FunctionComponent<CarouselProps> = (props: CarouselProps) =>

<div 
    className = {chooseIcon(props.currencyName)}
    onClick = {() => props.onClicked()}
>
</div>



// export default class CarouselElement extends React.Component<CarouselProps, CarouselState> {
//     constructor(props: CarouselProps) {
//         super(props)
//         this.state = {
//             currencyStyle: ''
//         }
//     }

//     componentDidMount() {
//         this.chooseIcon()
//     }

//     chooseIcon = () => {
//         switch(this.props.currencyName) {
//             case "BTC": {
//                 this.setState({ currencyStyle: "carouselBTCIcon" })
//                 break
//             }
//             case "LTC": {
//                 this.setState({ currencyStyle: "carouselLTCIcon" })
//                 break
//             }
//             case "ETH": {
//                 this.setState({ currencyStyle: "carouselETHIcon" })
//                 break
//             }
//             case "XRP": {
//                 this.setState({ currencyStyle: "carouselXRPIcon" })
//                 break
//             }
//         }
//     }

//     render() {
//         return(
//             <div 
//                 className = {this.state.currencyStyle}
//                 onClick = {() => this.props.onClicked()}
//                 >
//             </div>
//         )
//     }

// }