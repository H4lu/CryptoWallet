import React from 'react'
import {Link} from 'react-router-dom'
import {Table} from './Table'
import { log } from 'electron-log'

export default class MainContent extends React.Component<any, any> {
    classBTC : string;
    classETH : string;
    classLTC : string;
    classXRP : string;

    constructor(props: any) {
        super(props)

        this.props.stateSR(false)
        this.handleClick = this.handleClick.bind(this)
        this.updateStateTransBTC = this.updateStateTransBTC.bind(this)
        this.updateStateTransETH = this.updateStateTransETH.bind(this)
        this.updateStateTransLTC = this.updateStateTransLTC.bind(this)
        this.updateStateTransXRP = this.updateStateTransXRP.bind(this)
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)

        this.classBTC = 'click_img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
    }


handleUpdateDataClick() {
    this.props.refresh()
}

    handleClick() {
        this.props.refresh()
    }
    componentDidMount() {//TODO maybe avoid implicit call of updateState<curr_name> 
        let activeCurrency: string = this.props.getActiveCurrency()
        log("ACtive currency: " + activeCurrency)
        switch(activeCurrency) {
            case "BTC":{
                log("IN active currency btc")
                this.updateStateTransBTC()
                break
            }
            case "ETH":{
                log("IN active currency eth")
                this.updateStateTransETH()
                break
            }
            case "LTC":{
                log("IN active currency ltc")
                this.updateStateTransLTC()
                break
            }
            case "XRP":{
                log("IN active currency xrp")
                this.updateStateTransXRP()
                break
            }
        }

    }
    updateStateTransBTC(){
        this.props.updateStateBTC()
        this.props.setActiveCurrency("BTC")
        this.classBTC = 'click_img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
  

    }
  
    updateStateTransETH(){
        this.props.updateStateETH()
        this.props.setActiveCurrency("ETH")
        this.classBTC = 'img_BTC'
        this.classETH = 'click_img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
    

    }
    updateStateTransLTC(){
        this.props.updateStateLTC()
        this.props.setActiveCurrency("LTC")
        this.classBTC = 'img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'click_img_LTC'
        this.classXRP = 'img_XRP'
      
     
    }
    updateStateTransXRP(){
        this.props.updateStateXRP()

        this.props.setActiveCurrency("XRP")

        this.classBTC = 'img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'click_img_XRP'
      
    }

  
    render() {
        return (
            <div className='main'>
                <div className='main-content'>
                    <div className='currency-block'>
                        <div className='vert'>
                            <header className='currencies-header'>My wallets</header>
                            <div className='cryptocurrency'>
                                <div className='cryptocurrency_flex'>
                                    <div className='column_1'>
                                        <div className='column_BTC_ETH'>
                                            <div className='but_BTC'>
                                                <div className='clickBTC' onClick = {this.updateStateTransBTC}>
                                                    <div className={this.classBTC}>
                                                    <p className='balance'> {this.props.btcBalance}</p>
                                                    <p className='fiat'>{this.props.btcPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='but_ETH'>
                                                <div className='clickETH' onClick = {this.updateStateTransETH}>
                                                    <div className={this.classETH}>
                                                    <p className='balance'> {this.props.ethBalance}</p>
                                                    <p className='fiat'>{this.props.ethPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='column_2'>
                                        <div className='column_LTC_XRP'>
                                            <div className='but_LTC'>
                                                <div className= 'clickLTC' onClick = {this.updateStateTransLTC}>
                                                    <div className={this.classLTC}>
                                                    <p className='balance'> {this.props.ltcBalance}</p>
                                                    <p className='fiat'>{this.props.ltcPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='but_XRP'>
                                                <div className='clickXRP' onClick = {this.updateStateTransXRP}>
                                                    <div className={this.classXRP}>
                                                    <p className='balance'> {this.props.btcBalance}</p>
                                                    <p className='fiat'>{this.props.btcPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='Block_explorer'/>
                        </div>
                    </div>
                    <div className='transaction_info'>
                        <div className='tran_cur_info'>
                            <div className='overwiewUpdate'>
                                <div className='overwiewUpdateFlex'>
                                      <div className='overwiew'>Overview</div>
                                      <div className='update' onClick = {this.handleUpdateDataClick}/>
                                </div>
                            </div>
                            <div className='current_balance'>
                                <p className='num_transaction'>0</p>
                                <p className='general_usd_balance'>{this.props.total}</p>
                            </div>
                            <div className = 'cryptoCurrency_chart'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



