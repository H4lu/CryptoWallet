import * as React from 'react'
import {Carousel} from './Carousel'
import {log} from 'electron-log'
import {CarouselDesc} from "./CarouselDesc";
import {CarouselTable} from "./CarouselTable";

interface CarouselHistoryState {
    activeCurrency: number,
    needShift: boolean
}

interface CarouselHistoryProps {
    setActiveCurrency: (string) => void,
    getActiveCurrency: () => string,
    activeCurrency: number, // TODO: store as string, convert to index inside component
    stateSR: (boolean) => void,
    refresh: () => void,
    lastTxBTC: Array<any>,
    lastTxETH: Array<any>,
    lastTxLTC: Array<any>,
    lastTxXRP: Array<any>
}
export class CarouselHistory extends React.PureComponent<CarouselHistoryProps, CarouselHistoryState> {
    constructor(props: any) {
        super(props)
        this.props.stateSR(false)
        this.getActive = this.getActive.bind(this)
        this.state = {
            activeCurrency: this.props.activeCurrency,
            needShift: true
        };
        this.chooseActiveCurrency = this.chooseActiveCurrency.bind(this)
        this.mapProps = this.mapProps.bind(this)

    }

    componentDidMount() {
        //this.mapProps()
        log("Carousel active : " + this.state.activeCurrency)
        if (this.state.needShift) {
            log("SHIFTING")
            this.setState({activeCurrency: this.state.activeCurrency + 1})
            this.setState({activeCurrency: this.state.activeCurrency - 1})//kostil for choosing current active
            this.setState({needShift: false})
        }
    }

    chooseActiveCurrency(index: number) {
        this.setState({activeCurrency: index})
    }

    getActive() {
        log("gettign active")
        switch (this.props.getActiveCurrency()) {
            case "BTC": {
                return 1

            }
            case "ETH": {
                return 2
            }
            case "LTC": {
                return 3
            }
            case "XRP": {
                return 4
            }
        }
    }

    mapProps() {
        switch (this.props.getActiveCurrency()) {
            case "BTC": {
                this.setState({activeCurrency: 1})
                break
            }
            case "ETH": {
                this.setState({activeCurrency: 2})
                break
            }
            case "LTC": {
                this.setState({activeCurrency: 3})
                break
            }
            case "XRP": {
                this.setState({activeCurrency: 4})
                break
            }
        }
    }

    render() {
        console.log("History carousel update")
    
        return (
            <div className='windowPay'>
                <div className='payWindowTable'>
                    <Carousel onClicked={this.chooseActiveCurrency} getActiveCurrency={this.props.getActiveCurrency}
                              setActiveCurrency={this.props.setActiveCurrency}
                              activeCurrency={this.state.activeCurrency}/>
                    <CarouselTable activeCurrency={this.props.activeCurrency}
                                   getActiveCurrency={this.props.getActiveCurrency} refresh={this.props.refresh}
                                   lastTxBTC = {this.props.lastTxBTC}
                                   lastTxLTC = {this.props.lastTxLTC}
                                   lastTxETH = {this.props.lastTxETH}
                                   lastTxXRP = {this.props.lastTxXRP}/>
                </div>
            </div>
        )
    }
}