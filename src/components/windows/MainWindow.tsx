import React, {Component} from 'react'
import {getBTCBalanceTarns} from "../../api/cryptocurrencyApi/bitcoin";

import {getETHBalanceTrans} from "../../api/cryptocurrencyApi/ethereum";
import {getLTCBalanceTrans} from "../../api/cryptocurrencyApi/ltecoin";
import {getXRPBalanceTrans} from "../../api/cryptocurrencyApi/ripple";
import Chart from "../chart";
import { DisplayTransaction, DisplayTransactionCurrency } from '../../api/cryptocurrencyApi/utils';
import { CryptocurrencyCard } from '../cryptocurrencyCard';
interface MainContentState {
    exAddress: string,
    balance: string,
    transactions: string
}
interface MainContentProps {
    stateSR: (arg: boolean) => void,
    btcBalance: number,
    ltcBalance: number,
    ethBalance: number,
    xrpBalance: number,
    total: number,
    numTr: number,
    btcPrice: number,
    ltcPrice: number,
    ethPrice: number,
    xrpPrice: number,
    btcHourChange: number,
    ltcHourChange: number,
    ethHourChange: number,
    xrpHourChange: number,
    setActiveCurrency: (currency: string) => void,
    lastTx: Array<DisplayTransaction>,
    transactions: () => Promise<void>,
    refresh: () => void,
    chartBTC: Array<any>,
    setChartLen: (arg: number) => void,
    chartLen: number,
    activeCurrency: DisplayTransactionCurrency
}
export default class MainContent extends Component<MainContentProps, MainContentState> {
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
        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.onCardClicked = this.onCardClicked.bind(this)

        this.ex_button = this.ex_button.bind(this)
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
                }
            }
        }
    }

    handleUpdateDataClick() {
        this.props.refresh()
    }

    onCardClicked(currency: DisplayTransactionCurrency) {
        this.props.setActiveCurrency(currency)
        this.classActive = `ex_${currency}`
    }


    render() {
        return (
            <div className='main'>
                <div className='main-content'>
                    <div className='currency-block'>
                        <div className='vert'>
                            <header className='currencies-header'>My wallets</header>
                            <div className='cryptocurrency-container'>
                                <div className='cryptocurrency-row'>
                                    <CryptocurrencyCard 
                                        currency = 'BTC'
                                        onClick = {() => this.onCardClicked('BTC')}
                                        cryptoBalance = {this.props.btcBalance}
                                        fiatBalance = {this.props.btcPrice}
                                        isActive = {this.props.activeCurrency == 'BTC'}
                                    />
                                    <CryptocurrencyCard
                                        currency = 'LTC'
                                        onClick = {() => this.onCardClicked('LTC')}
                                        cryptoBalance = {this.props.ltcBalance}
                                        fiatBalance = {this.props.ltcPrice}
                                        isActive = {this.props.activeCurrency == 'LTC'}
                                    />
                                </div>    
                                <div className = 'cryptocurrency-row 2'>  
                                    <CryptocurrencyCard
                                        currency = 'ETH'
                                        onClick = {() => this.onCardClicked('ETH')}
                                        cryptoBalance = {this.props.ethBalance}
                                        fiatBalance={this.props.ethPrice}
                                        isActive = {this.props.activeCurrency == 'ETH'}
                                    />
                                    <CryptocurrencyCard
                                        currency = 'XRP'
                                        onClick = {() => {this.onCardClicked('XRP')}}
                                        cryptoBalance = {this.props.xrpBalance}
                                        fiatBalance = {this.props.xrpPrice}
                                        isActive = {this.props.activeCurrency == 'XRP'}
                                    />
                                </div>  
                                <div className='cryptocurrency-row 3'>
                                    <CryptocurrencyCard
                                        currency = 'BCH'
                                        onClick = {() => {this.onCardClicked("BCH")}}
                                        cryptoBalance = {0}
                                        fiatBalance = {0}
                                        isActive = {this.props.activeCurrency == 'BCH'}
                                    /> 
                                    <CryptocurrencyCard
                                        currency = 'DOGE'
                                        onClick = {() => {this.onCardClicked("DOGE")}}
                                        cryptoBalance = {0}
                                        fiatBalance = {0}
                                        isActive = {this.props.activeCurrency == 'DOGE'}
                                    />
                                </div>   
                                <div className='cryptocurrency-row 4'>
                                    <CryptocurrencyCard
                                        currency = 'XCH'
                                        onClick = {() => {this.onCardClicked("XCH")}}
                                        cryptoBalance = {0}
                                        fiatBalance = {0}
                                        isActive = {this.props.activeCurrency == 'XCH'}
                                    />
                                    <CryptocurrencyCard
                                        currency = 'MNR'
                                        onClick = {() => {this.onCardClicked("MNR")}}
                                        cryptoBalance = {0}
                                        fiatBalance = {0}
                                        isActive = {this.props.activeCurrency == 'MNR'}
                                    />
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
                                <Chart chartBTC = {this.props.chartBTC}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
