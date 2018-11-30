import  React from 'react'
import {Link} from "react-router-dom";
import {log} from 'electron-log'
import {Table} from "./Table";

export class CarouselTable extends React.PureComponent<any, any> {
    currencyName: string
    direct: number
    shouldUpdate: boolean
    constructor(props: any) {
        super(props)
        this.shouldUpdate = true;
        //this.curTableData = this.props.lastTxBTC
        this.state = {
            activeCurrency: this.props.activeCurrency,
            classNameAll: 'AlldirectHistory_a',
            classNameSend: 'SenddirectHistory_p',
            classNameReceive: 'ReceivedirectHistory_p',
            direct: 0,
            curTableData: this.props.lastTxBTC,
            tableData: this.props.lastTxBTC,
            activeCur: 'BTC',
            numb: []
        }

        this.updateProps = this.updateProps.bind(this)
        this.allDirect = this.allDirect.bind(this)
        this.sendDirect = this.sendDirect.bind(this)
        this.receiveDirect = this.receiveDirect.bind(this)
        this.choeceDirect = this.choeceDirect.bind(this)
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
        this.parseData = this.parseData.bind(this)
    }

    handleUpdateDataClick() {
        this.props.refresh()
    } 

    updateProps() {
        log(this.shouldUpdate)
        if (!this.shouldUpdate) return
        log('in update props')
        this.shouldUpdate = false;
        log(this.shouldUpdate)
        switch (this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.setState({curTableData: this.props.lastTxBTC, activeCur: 'BTC'})
              //  this.setState({activeCur: 'BTC'})
                this.parseData()
                break
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.setState({curTableData: this.props.lastTxETH, activeCur: 'ETH'})
               // this.setState({activeCur: 'ETH'})
                this.parseData()
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.setState({curTableData: this.props.lastTxLTC, activeCur: 'LTC'})
                //this.setState({activeCur: 'LTC'})
                this.parseData()
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.setState({curTableData: this.props.lastTxXRP, activeCur: 'XRP'})
                //this.setState({activeCur: 'XRP'})
                this.parseData()
                break
            }
        }
    
        log(this.shouldUpdate)

    }

    allDirect() {
        this.setState({direct: 0}, () => {
            this.choeceDirect()
        })
    }

    sendDirect() {
        this.setState({direct: -1}, () => {
            this.choeceDirect()
        })
    }

    receiveDirect() {
        this.setState({direct: 1}, () => {
            this.choeceDirect()
        
        })
    }

    parseData() {

        log('parseData In')
        switch (this.state.direct) {
            case -1: {
                this.setState({tableData: (this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing"))},() =>{
                    this.shouldUpdate = true;
                    log("in callback")})
                break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")
            }
            case 1: {
                this.setState({tableData: (this.state.curTableData.filter(curTableData => curTableData.Type === "incoming"))},() =>{
                     this.shouldUpdate = true;
                     log("in callback")})
                break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")
            }
            case 0: {
                this.setState({tableData: this.state.curTableData},() =>{
                    this.shouldUpdate = true;
                    log("in callback")})
                break
                //return this.state.curlTableData
            }
        }
    }
   
    choeceDirect() {
        log('choose direct')
        switch (this.state.direct) {
            case -1: {
                log('case -1')
                this.setState({classNameAll: 'AlldirectHistory_p', classNameSend: 'SenddirectHistory_a',classNameReceive: 'ReceivedirectHistory_p'})
                // this.setState({classNameSend: 'SenddirectHistory_a'})
                // this.setState({classNameReceive: 'ReceivedirectHistory_p'})
                break
            }
            case 1: {
                log('case 1')
                this.setState({classNameAll: 'AlldirectHistory_p',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_a' })
                // this.setState({classNameSend: 'SenddirectHistory_p'})
                // this.setState({classNameReceive: 'ReceivedirectHistory_a'})
                break
            }
            case 0: {
                log('case 0')
                this.setState({classNameAll: 'AlldirectHistory_a',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_p'})
                // this.setState({classNameSend: 'SenddirectHistory_p'})
                // this.setState({classNameReceive: 'ReceivedirectHistory_p'})
                break
            }
        }
        this.parseData()
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
                <div className='table_content'>
                    <Table data={this.state.tableData} activeCurrency={this.state.activeCur} type='normal'/>
                </div>
            </div>
        )
    }
}