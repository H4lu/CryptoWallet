import React from 'react'
import {Link} from 'react-router-dom'
import {Table} from './Table'
import {connect} from 'react-redux'
import {ETHEREUM_PATH, BITCOIN_PATH, LITECOIN_PATH} from '../core/paths'

class MainContent extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.refresh()
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
                                                <Link to='/btc-window' className='card-container'>
                                                    <div className='img_BTC'>
                                                    <p className='balance'> {this.props.btcBalance}</p>
                                                    <p className='fiat'>{this.props.btcPrice}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='but_ETH'>
                                                <Link to='/eth-window' className='card-container'>
                                                    <div className='img_ETH'>
                                                    <p className='balance'> {this.props.ethBalance}</p>
                                                    <p className='fiat'>{this.props.ethPrice}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='column_2'>
                                        <div className='column_LTC_XRP'>
                                            <div className='but_LTC'>
                                                <Link to='/ltc-window' className='card-container'>
                                                    <div className='img_LTC'>
                                                    <p className='balance'> {this.props.ltcBalance}</p>
                                                    <p className='fiat'>{this.props.ltcPrice}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='but_XRP'>
                                                <Link to='/btc-window' className='card-container'>
                                                    <div className='img_XRP'>
                                                    <p className='balance'> {this.props.btcBalance}</p>
                                                    <p className='fiat'>{this.props.btcPrice}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='Block_explorer'/>
                        </div>
                    </div>
                    <div className='transaction_info'>

                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any, IMainContentProps) {
    console.log('MY STATE: ' + state)
    console.log(state)
    console.log(JSON.stringify(state))
    console.log(IMainContentProps)
    console.log('BALANCE STATE: ' + state.getBalance)
    return {
        balance: state.getBalance
    }
}

export default connect(mapStateToProps)(MainContent)
