import React, {PureComponent} from 'react'
import {DisplayTransactionTable} from "./DisplayTransactionTable";
import { DisplayTransaction, DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils';

export interface  CarouselTableState {
    activeCurrency: number,
    classNameAll: string,
    classNameSend: string,
    classNameReceive: string,
    direct: number,
    curTableData: Array<DisplayTransaction>,
    tableData: Array<DisplayTransaction>
    activeCur: DisplayTransactionCurrency
}

export interface CarouselTableProps {
    activeCurrency: number,
    getActiveCurrency: () => string,
    refresh: () => void,
    lastTxBTC: Array<DisplayTransaction>,
    lastTxETH: Array<DisplayTransaction>,
    lastTxLTC: Array<DisplayTransaction>,
    lastTxXRP: Array<DisplayTransaction>,
}

export class CarouselTable extends PureComponent<CarouselTableProps, CarouselTableState> {
    currencyName: string
    direct: number
    shouldUpdate: boolean
    tableData:Array<any>
    constructor(props: CarouselTableProps) {
        super(props)
        this.shouldUpdate = true;

        this.state = {
            activeCurrency: this.props.activeCurrency,
            classNameAll: 'AlldirectHistory_a',
            classNameSend: 'SenddirectHistory_p',
            classNameReceive: 'ReceivedirectHistory_p',
            direct: 0,
            curTableData: this.props.lastTxBTC,
            tableData: this.props.lastTxBTC,
            activeCur: 'BTC'
        }

        this.updateProps = this.updateProps.bind(this)
        this.allDirect = this.allDirect.bind(this)
        this.sendDirect = this.sendDirect.bind(this)
        this.receiveDirect = this.receiveDirect.bind(this)
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
        this.parseData = this.parseData.bind(this)
        this.tableData = new Array<any>()
        this.tableData = this.props.lastTxBTC
    }

    handleUpdateDataClick() {
        this.props.refresh()
    } 

    updateProps() {
        switch (this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.setState({
                    curTableData: this.props.lastTxBTC,
                    activeCur: 'BTC'
                }, () => {
                    this.parseData()
                    this.getData()
                })
                break
            }
            case 2: {
                this.currencyName = 'Ethereum'
                this.setState({
                    curTableData: this.props.lastTxETH,
                    activeCur: 'ETH'
                }, () => {
                    this.parseData()
                })
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.setState({
                    curTableData: this.props.lastTxLTC, 
                    activeCur: 'LTC'
                }, () => {
                    this.parseData()
                })
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.setState({
                    curTableData: this.props.lastTxXRP,
                    activeCur: 'XRP'
                }, () => {
                    this.parseData()
                })
                break
            }
        }
    }

    allDirect() { 
        this.setState({direct: 0}, () => {
            this.tableData = this.state.curTableData
        })
    }

    sendDirect() {
        this.setState({direct: -1}, () => {
            this.tableData = this.state.curTableData
                .filter(curTableData => curTableData.type === "outgoing")
        })
    }

    receiveDirect() {
        this.setState({direct: 1}, () => {
            this.tableData = this.state.curTableData.filter(curTableData => curTableData.type === "incoming")
        })
    }
    getData() {
        switch (this.state.direct) {
            case -1: {
                this.tableData = this.state.curTableData.filter(curTableData => curTableData.type === "outgoing")
                break
            }
            case 1: {
                this.tableData = this.state.curTableData.filter(curTableData => curTableData.type === "incoming")
               break
            }
            case 0: {
                this.tableData = this.state.curTableData
                break
            }
        }
    }
    parseData() {
        switch (this.state.direct) {
            case -1: {
                this.setState({
                    classNameAll: 'AlldirectHistory_p', 
                    classNameSend: 'SenddirectHistory_a',
                    classNameReceive: 'ReceivedirectHistory_p'
                }, () => {
                    this.shouldUpdate = true;
                })
                break
            }
            case 1: {
                this.setState({
                    classNameAll: 'AlldirectHistory_p',
                    classNameSend: 'SenddirectHistory_p', 
                    classNameReceive: 'ReceivedirectHistory_a'
                },() => {
                    this.shouldUpdate = true
                })
                break
            }
            case 0: {
                this.setState({
                    classNameAll: 'AlldirectHistory_a',
                    classNameSend: 'SenddirectHistory_p', 
                    classNameReceive: 'ReceivedirectHistory_p'
                },() => {
                    this.shouldUpdate = true;
                })
                break
            }
        }
    }


    render() {
        this.updateProps()
        this.getData()
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
                <div className='table_content'>
                    <DisplayTransactionTable 
                        data={this.tableData} 
                        activeCurrency={this.state.activeCur} 
                        type='normal'
                        />
                </div>
            </div>
        )
    }
}