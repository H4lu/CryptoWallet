import * as React from 'react'
import {Link} from "react-router-dom";
import {log} from 'electron-log'
import {Table} from "./Table";

export class CarouselTable extends React.Component<any, any> {
    currencyName: string
    pathSend: string
    pathRecive: string
    direct: number
    curTableData


    constructor(props: any) {
        super(props)

        this.curTableData = this.props.lastTxBTC
        this.state = {
            activeCurrency: this.props.activeCurrency,
            classNameAll: 'AlldirectHistory_a',
            classNameSend: 'SenddirectHistory_p',
            classNameReceive: 'ReceivedirectHistory_p',
            direct: 0,
            /*curTableData: this.props.lastTxBTC*/
        }

        this.updateProps = this.updateProps.bind(this)
        this.allDirect = this.allDirect.bind(this)
        this.sendDirect = this.sendDirect.bind(this)
        this.receiveDirect = this.receiveDirect.bind(this)
        this.choeceDirect = this.choeceDirect.bind(this)
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
    }

    handleUpdateDataClick() {
        this.props.refresh()
    }

    updateProps() {
        log('in update props')
        switch (this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.pathSend = '/btc-window-send'
                this.pathRecive = '/btc-window-recieve'
               /* this.setState({curTableData: this.props.lastTxBTC})*/
                this.curTableData = this.props.lastTxBTC
                break
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.pathSend = '/eth-window-send'
                this.pathRecive = '/eth-window-recieve'
                /*this.setState({curTableData: this.props.lastTxETH})*/
                this.curTableData = this.props.lastTxETH
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.pathSend = '/ltc-window-send'
                this.pathRecive = '/ltc-window-recieve'
                /*this.setState({curTableData: this.props.lastTxLTC})*/
                this.curTableData = this.props.lastTxLTC
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.pathSend = '/xrp-window-send'
                this.pathRecive = '/xrp-window-recieve'
                /*this.setState({curTableData: this.props.lastTxXRP})*/
                this.curTableData = this.props.lastTxXRP
                break
            }
        }

    }

    allDirect() {
        this.setState({direct: 0}, this.choeceDirect)
        //  this.updateProps()
        // this.choeceDirect()
    }

    sendDirect() {
        this.setState({direct: -1}, this.choeceDirect)
        // this.updateProps()
        // this.choeceDirect()
    }

    receiveDirect() {
        this.setState({direct: 1}, this.choeceDirect)
        // this.updateProps()
        // this.choeceDirect()
    }


    choeceDirect() {
        log('choose direct')
        switch (this.state.direct) {
            case -1: {
                log('case -1')
                this.setState({classNameAll: 'AlldirectHistory_p'})
                this.setState({classNameSend: 'SenddirectHistory_a'})
                this.setState({classNameReceive: 'ReceivedirectHistory_p'})
                break
            }
            case 1: {
                log('case 1')
                this.setState({classNameAll: 'AlldirectHistory_p'})
                this.setState({classNameSend: 'SenddirectHistory_p'})
                this.setState({classNameReceive: 'ReceivedirectHistory_a'})
                break
            }
            case 0: {
                log('case 0')
                this.setState({classNameAll: 'AlldirectHistory_a'})
                this.setState({classNameSend: 'SenddirectHistory_p'})
                this.setState({classNameReceive: 'ReceivedirectHistory_p'})
                break
            }
        }
    }


    render() {
        {
            this.updateProps()
        }
        return (
            <div>
                <p className='currencyNameHistory'>{this.currencyName}</p>
                <div className='buttonHistoryFlex'>
                    <button className={this.state.classNameAll} onClick={this.allDirect}>All</button>
                    <button className={this.state.classNameSend} onClick={this.sendDirect}>Send</button>
                    <button className={this.state.classNameReceive} onClick={this.receiveDirect}>Receive</button>
                    <div className='updateTable' onClick={this.handleUpdateDataClick}/>
                </div>
                <hr className='hrLine'/>
                <Table data = {this.props.lastTxBTC/*this.state.curTableData*/} type = 'normal'/>
            </div>
        )
    }
}