import * as React from 'react'
import {getEthereumAddress} from '../API/cryptocurrencyAPI/Ethereum'
import {info, log} from "electron-log";
import {sendTransaction} from "../core/SendTransaction";
import {Link} from "react-router-dom";

interface IETHSendState {
    address: string,
    paymentAddress: string,
    amount: number,
    usd: number,
    fee: number,
    feeUSD: number,
    balanceUSD: number
}

export class EthSendWindow extends React.Component<any, IETHSendState> {
    constructor(props: any) {
        super(props)

        this.props.stateSR(true)
        this.state = {
            address: getEthereumAddress(),
            paymentAddress: '',
            amount: 0,
            fee: 0.00042,
            usd: 0,
            feeUSD: 0.00042 * this.props.course,
            balanceUSD: 0
        }
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.setState({balanceUSD: (this.props.btcBalance * this.props.course)})
        this.handleClick = this.handleClick.bind(this)

    }

    handleAddressChange(e: any) {
        this.setState({paymentAddress: e.target.value})
    }

    handleAmountChange(e: any) {
        this.setState({amount: e.target.value})
        this.setState({usd: (e.target.value * this.props.course)})
        this.setState({feeUSD: (this.state.fee * this.props.course)})
    }

    handleClick() {
        if (this.state.paymentAddress != '') {
            sendTransaction('ethereum', this.state.paymentAddress, this.state.amount, this.state.fee, /*this.props.redirect*/0, this.props.course, this.props.btcBalance)
        }
    }

    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrencyETH'/>
                    <div className='blockSendTransactionAddress'>
                        <div className='iconQr'/>
                        <input type='text' className='payment_address' placeholder='  Send to Ethereum address...'
                               value={this.state.paymentAddress} onChange={this.handleAddressChange}/>
                    </div>
                    <div className='blockSendTransactionSum'>
                        <div className='iconSum'/>
                        <div className='poleSumETH'>
                            <input type='text' pattern="[0-9]*" className='payment_sum' placeholder='0.00'
                                   onChange={this.handleAmountChange}/>
                            <p className='payment_sumUSD'>{(this.state.usd).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='blockFee'>
                        <p className='text_Transaction_fee'>Transaction fee</p>
                        <p className='sum_Transaction_fee'>{(this.state.fee).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' ETH'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.fee).toFixed(2)}</p>
                    </div>
                    <div className='blockBalance'>
                        <p className='text_Transaction_fee'>Avalible</p>
                        <p className='sum_Transaction_balance'>{(this.props.btcBalance).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' ETH'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.balanceUSD).toFixed(2)}</p>
                    </div>
                    <div className='buttonSendCancelFlex'>
                        <div className='buttonSendBig'>
                            <Link to={'/main'}>
                                <button type='submit' className='button-send-transaction' onClick={this.handleClick}/>
                            </Link>
                        </div>
                        <div className='buttonCancelBig'>
                            <Link to={'/currency-carousel'}>
                                <div className='button-cancel-transaction'/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}