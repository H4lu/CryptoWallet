import * as React from 'react'
import getBitcoinAddress from "../API/cryptocurrencyAPI/BitCoin";
import {log} from "electron-log";

interface IBTCSendState {
    address: string,
    qrcodeAddress: string,
    paymentAddress: string,
    amount: number,
    usd: number,
    fee: number,
    feeUSD: number,
    balanceUSD: number
}

export class BtcSendWindow extends React.Component<any, IBTCSendState> {
    constructor(props: any) {
        super(props)

        this.state = {
            address: getBitcoinAddress(),
            qrcodeAddress: '',
            paymentAddress: '',
            amount: 0,
            fee: 0.00005,
            usd: 0,
            feeUSD: 0,
            balanceUSD: 0
        }
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.setState({balanceUSD: (this.props.btcBalance*this.props.course)})

    }

    handleAddressChange(e: any) {
        this.setState({paymentAddress: e.target.value})
    }

    handleAmountChange(e: any) {
        this.setState({amount: e.target.value})
        this.setState({usd:(e.target.value*this.props.course)})
        this.setState({feeUSD:(this.state.fee*this.props.course)})
        log(this.props.course)
    }

    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrency'/>
                    <div className='blockSendTransactionAddress'>
                        <div className='iconQr'/>
                        <input type='text' className='payment_address' placeholder='  Send to Bitcoin address...'
                               value={this.state.paymentAddress} onChange={this.handleAddressChange}/>
                    </div>
                    <div className='blockSendTransactionSum'>
                        <div className='iconSum'/>
                        <div className='poleSum'>
                            <input type='text' pattern="[0-9]*" className='payment_sum' placeholder='0.00'
                                   onChange={this.handleAmountChange}/>
                            <p className='payment_sumUSD'>{(this.state.usd).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='blockFee'>
                        <p className='text_Transaction_fee'>Transaction fee</p>
                        <p className='sum_Transaction_fee'>{(this.state.fee).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' BTC'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.fee).toFixed(2)}</p>
                    </div>
                    <div className='blockBalance'>
                        <p className='text_Transaction_fee'>Avalible</p>
                        <p className='sum_Transaction_balance'>{(this.props.btcBalance).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' BTC'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.balanceUSD).toFixed(2)}</p>
                    </div>
                    /*To Do Button send Cancel*/
                </div>
            </div>
        )
    }
}
