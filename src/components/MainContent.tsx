import React from 'react'
import {log} from 'electron-log'
import {getBTCBalanceTarns} from "../API/cryptocurrencyAPI/BitCoin";

import {getETHBalanceTrans} from "../API/cryptocurrencyAPI/Ethereum";
import {getLTCBalanceTrans} from "../API/cryptocurrencyAPI/Litecoin";
import {getXRPBalanceTrans} from "../API/cryptocurrencyAPI/Ripple";

interface IMainContent {
    exAddress: string,
    balance: string,
    transactions: string
}

export default class MainContent extends React.Component<any, IMainContent> {
    classBTC: string;
    classETH: string;
    classLTC: string;
    classXRP: string;
    classActive: string;

    constructor(props: any) {
        super(props)
        this.state = {
            exAddress: '',
            balance: '',
            transactions: ''
        }

        this.props.stateSR(false)
        this.handleClick = this.handleClick.bind(this)
        this.updateStateTransBTC = this.updateStateTransBTC.bind(this)
        this.updateStateTransETH = this.updateStateTransETH.bind(this)
        this.updateStateTransLTC = this.updateStateTransLTC.bind(this)
        this.updateStateTransXRP = this.updateStateTransXRP.bind(this)
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.ex_button = this.ex_button.bind(this)

        this.classBTC = 'click_img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
        this.classActive = 'ex_BTC'

    }

    handleAddressChange(e: any) {
        this.setState({exAddress: e.target.value})
    }

    async ex_button(){
        if(this.state.exAddress != '') {
            switch (this.classActive) {
                case 'ex_BTC': {
                    let arr = await getBTCBalanceTarns(this.state.exAddress)
                    this.setState({balance: (arr[0]).toString() + ' BTC'})
                    this.setState({transactions: (arr[1]).toString()})
                    break
                }
                case 'ex_ETH': {
                    let arr = await getETHBalanceTrans(this.state.exAddress)
                    console.log('3', arr[0])
                    console.log('4', arr[1])
                    this.setState({balance: (arr[0]) + ' ETH'})
                    this.setState({transactions: (arr[1]).toString()})
                    break
                }
                case 'ex_LTC': {
                    let arr = await getLTCBalanceTrans(this.state.exAddress)
                    this.setState({balance: (arr[0]).toString() + ' LTC'})
                    this.setState({transactions: (arr[1]).toString()})
                    break
                }
                case 'ex_XRP': {
                    let arr = await getXRPBalanceTrans(this.state.exAddress)
                    this.setState({balance: (arr[0]).toString() + ' LTC'})
                    this.setState({transactions: (arr[1]).toString()})
                    break
                    break
                }
            }
        }
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
        switch (activeCurrency) {
            case "BTC": {
                log("IN active currency btc")
                this.updateStateTransBTC()
                break
            }
            case "ETH": {
                log("IN active currency eth")
                this.updateStateTransETH()
                break
            }
            case "LTC": {
                log("IN active currency ltc")
                this.updateStateTransLTC()
                break
            }
            case "XRP": {
                log("IN active currency xrp")
                this.updateStateTransXRP()
                break
            }
        }

    }

    updateStateTransBTC() {
        this.props.updateStateBTC()
        this.props.setActiveCurrency("BTC")
        this.classBTC = 'click_img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
        this.classActive = 'ex_BTC'
    }

    updateStateTransETH(){
        this.props.updateStateETH()
        this.props.setActiveCurrency("ETH")
        this.classBTC = 'img_BTC'
        this.classETH = 'click_img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'img_XRP'
        this.classActive = 'ex_ETH'
    }

    updateStateTransLTC(){
        this.props.updateStateLTC()
        this.props.setActiveCurrency("LTC")
        this.classBTC = 'img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'click_img_LTC'
        this.classXRP = 'img_XRP'
        this.classActive = 'ex_LTC'
    }

    updateStateTransXRP() {
        this.props.updateStateXRP()

        this.props.setActiveCurrency("XRP")

        this.classBTC = 'img_BTC'
        this.classETH = 'img_ETH'
        this.classLTC = 'img_LTC'
        this.classXRP = 'click_img_XRP'
        this.classActive = 'ex_XRP'
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
                                        <div className='column_BTC_LTC'>
                                            <div className='but_BTC'>
                                                <div className='clickBTC' onClick={this.updateStateTransBTC}>
                                                    <div className={this.classBTC}>
                                                        <p className='balance'> {this.props.btcBalance}</p>
                                                        <p className='fiat'>{this.props.btcPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='but_LTC'>
                                                <div className='clickLTC' onClick={this.updateStateTransLTC}>
                                                    <div className={this.classLTC}>
                                                        <p className='balance'> {this.props.ltcBalance}</p>
                                                        <p className='fiat'>{this.props.ltcPrice}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='column_2'>
                                        <div className='column_ETH_XRP'>
                                            <div className='but_ETH'>
                                                <div className='clickETH' onClick={this.updateStateTransETH}>
                                                    <div className={this.classETH}>
                                                        <p className='balance'> {this.props.ethBalance}</p>
                                                        <p className='fiat'>{this.props.ethPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='but_XRP'>
                                                <div className='clickXRP' onClick={this.updateStateTransXRP}>
                                                    <div className={this.classXRP}>
                                                        <p className='balance'> {this.props.xrpBalance}</p>
                                                        <p className='fiat'>{this.props.xrpPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='Block_explorer'>
                                <div className='ex_enter_address'>
                                    <div className={this.classActive}/>
                                    <input type='text' className='ex_address' placeholder=' Enter address '
                                           value={this.state.exAddress} onChange={this.handleAddressChange}/>
                                    <button className='ex_button_find' onClick={this.ex_button}/>
                                </div>
                                <p className='ex_balance'>{this.state.balance}</p>
                                <p className='ex_transactions'>{this.state.transactions}</p>
                            </div>
                        </div>
                    </div>
                    <div className='transaction_info'>
                        <div className='tran_cur_info'>
                            <div className='overwiewUpdate'>
                                <div className='overwiewUpdateFlex'>
                                    <div className='overwiew'>Overview</div>
                                    <div className='update' onClick={this.handleUpdateDataClick}/>
                                </div>
                            </div>
                            <div className='current_balance'>
                                <p className='num_transaction'>{this.props.numTr}</p>
                                <p className='general_usd_balance'>{this.props.total}</p>
                            </div>
                            <div className='cryptoCurrency_chart'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



