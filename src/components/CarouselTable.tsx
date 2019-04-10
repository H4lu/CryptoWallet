import  React from 'react'
import {Link} from "react-router-dom";
import {log} from 'electron-log'
import {Table} from "./Table";

export class CarouselTable extends React.PureComponent<any, any> {
    currencyName: string
    direct: number
    shouldUpdate: boolean
    tableData:Array<any>
    constructor(props: any) {
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
       // this.getData = this.getData.bind(this)
       this.tableData = new Array<any>()
       this.tableData = this.props.lastTxBTC
    }

    handleUpdateDataClick() {
        this.props.refresh()
    } 

    updateProps() {
        // log(this.shouldUpdate + " updateProps 1")
        // if (!this.shouldUpdate) return
        // log('in update props')
        // this.shouldUpdate = false;
        // log(this.shouldUpdate  + " updateProps 2")
        switch (this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.setState({curTableData: this.props.lastTxBTC, activeCur: 'BTC'}, () => {
                    console.log("parse data case 1")

                    this.parseData()
                    this.getData()
                
                })
                break
                
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.setState({curTableData: this.props.lastTxETH, activeCur: 'ETH'}, () => {
                    console.log("parse data case 2")
                    this.parseData()
                   // this.getData()
                })
            
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.setState({curTableData: this.props.lastTxLTC, activeCur: 'LTC'}, () => {
                    console.log("parse data case 3")
                    this.parseData()
                  //  this.getData()
                })
               
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.setState({curTableData: this.props.lastTxXRP, activeCur: 'XRP'}, () => {
                    console.log("parse data case 4")
                    this.parseData()
                  //  this.getData()
                })
            
                break
            }
        }
    
        log(this.shouldUpdate  + " updateProps 3")

    }

    allDirect() { 
        this.setState({direct: 0}, () => {
            console.log("direct now 0")
            this.tableData = this.state.curTableData
          //  this.setState({classNameAll: 'AlldirectHistory_a',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_p'})
        })
    }

    sendDirect() {
        this.setState({direct: -1}, () => {
            console.log("direct now -1")
            this.tableData = this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")
            //this.setState({classNameAll: 'AlldirectHistory_p', classNameSend: 'SenddirectHistory_a',classNameReceive: 'ReceivedirectHistory_p'})
        })
    }

    receiveDirect() {
        this.setState({direct: 1}, () => {
            console.log("direct now 1")
            this.tableData = this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")
            //this.setState({classNameAll: 'AlldirectHistory_p',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_a' })
        })
    }
    getData() {
        switch (this.state.direct) {
            case -1: {
               
                this.tableData = this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")
                break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")
            }
            case 1: {
                this.tableData = this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")
               break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")
            }
            case 0: {
                this.tableData = this.state.curTableData
                break
            }
        }
    }
    parseData() {

        // if (!this.shouldUpdate) return
        // log('in update props')
        // this.shouldUpdate = false;
        // log(this.shouldUpdate  + " updateProps 2")
        // console.log('parseData In')
        switch (this.state.direct) {
            case -1: {
                this.setState({/*tableData: (this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")),*/classNameAll: 'AlldirectHistory_p', classNameSend: 'SenddirectHistory_a',classNameReceive: 'ReceivedirectHistory_p'},() =>{
                    this.shouldUpdate = true;
                    
                    console.log("direct -1")})
                break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "outgoing")
            }
            case 1: {
                this.setState({/*tableData: (this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")),*/classNameAll: 'AlldirectHistory_p',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_a'},() =>{
                     this.shouldUpdate = true
                    
                     console.log("direct 1")})
                break
               // return this.state.curTableData.filter(curTableData => curTableData.Type === "incoming")
            }
            case 0: {
                this.setState({/*tableData: this.state.curTableData, */classNameAll: 'AlldirectHistory_a',classNameSend: 'SenddirectHistory_p', classNameReceive: 'ReceivedirectHistory_p'},() =>{
                  
                   
                    this.shouldUpdate = true;
                    console.log("direct 0")})
                break
            }
        }
    }


    render() {
        console.log("rerender carousel table",this.state.curTableData, this.tableData)
        
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
                    <Table data={this.tableData} activeCurrency={this.state.activeCur} type='normal'/>
                </div>
            </div>
        )
    }
}