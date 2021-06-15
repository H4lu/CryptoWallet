import React, {Component} from "react"
import {sendTransaction} from "../../core/sendTransaction";
import {getLitecoinAddress} from "../../api/cryptocurrencyApi/litecoin"
import {Link} from "react-router-dom";
import {remote} from "electron"

interface ILTCSendState {
    address: string,
    paymentAddress: string,
    amount: number,
    usd: number,
    fee: number,
    feeUSD: number,
    balanceUSD: number,
    balance: number,
    maxSum: number,
    amountS: string
}

interface LTCSendProps {
    stateSR: (arg: boolean) => void,
    course: number,
    ltcBalance: number,
    trFee: number,
    setFee: (num: number) => void
}
export class LtcSendWindow extends Component<LTCSendProps, ILTCSendState> {
    strSum: string
    point: number
    classFee1: string;
    classFee2: string;
    classFee3: string;
    feeCoeff = 25

    constructor(props: any) {
        super(props)

        this.props.stateSR(true)
        this.state = {
            address: getLitecoinAddress(),
            paymentAddress: '',
            amount: 0,
            fee: (431 * this.feeCoeff * this.props.trFee) / 100000000,
            usd: 0,
            feeUSD: this.props.course * (431 * this.feeCoeff * this.props.trFee) / 100000000,
            balance: this.props.ltcBalance,
            balanceUSD: this.props.ltcBalance * this.props.course,
            maxSum: this.props.ltcBalance - (431 * this.feeCoeff * this.props.trFee) / 100000000,
            amountS: ''
        }
        console.log("fee usd ltc")
        console.log(this.state.feeUSD)
        this.handleAddressChange = this.handleAddressChange.bind(this)
        this.handleAmountChange = this.handleAmountChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.strSum = ''
        this.point = 0
        this.setMax = this.setMax.bind(this)

        this.changeFee1 = this.changeFee1.bind(this)
        this.changeFee2 = this.changeFee2.bind(this)
        this.changeFee3 = this.changeFee3.bind(this)
        this.setClass1 = this.setClass1.bind(this)
        this.setClass2 = this.setClass2.bind(this)
        this.setClass3 = this.setClass3.bind(this)
        this.setClass = this.setClass.bind(this)
        this.classFee1 = this.setClass1()
        this.classFee2 = this.setClass2()
        this.classFee3 = this.setClass3()

    }

    handleAddressChange(e: any) {
        this.setState({paymentAddress: e.target.value})
    }

    handleAmountChange(e: any) {
        let temp = e.target.value.toString().replace(',', '.')
        if (temp.length > 1) {
            temp = temp.slice(1, 2)
        }
        
        if (temp == '') {
            this.strSum = this.strSum.slice(0, this.strSum.length - 1)
        } else if ((temp >= '0' && temp <= '9') || temp == '.') {
            if (temp == '.') {
                this.point += 1
            }
            if (this.point > 1 && temp == '.') {
                console.log('point: ', this.point)
            } else {
                this.strSum = this.strSum + temp
            }
        }

        if (Number(this.strSum) > this.state.maxSum) {
            this.strSum = this.strSum.slice(0, this.strSum.length - 1)
        }
        this.setState({amountS: this.strSum})
        this.setState({amount: Number(this.strSum)})
        this.setState({usd: (Number(this.strSum) * this.props.course)})
        e.target.value = ' '

    }

    async handleClick() {
        try {
            await sendTransaction(
                'LTC', this.state.paymentAddress, this.state.amount, this.props.trFee, this.props.course, this.props.ltcBalance
                )
        } catch(err) {
            console.error(err)
            remote.dialog.showErrorBox("Send transaction error", err.message)
        }
    }

    setMax() {
        let sum = (Math.floor(this.state.maxSum*1000000))/1000000
        if(sum < 0)
        {
            sum = 0
        }

        this.strSum = sum.toFixed(6).toString()
        this.setState({amount: sum})
        this.setState({usd: (Number(sum) * this.props.course)})
        this.setState({amountS: sum.toFixed(6).toString()})
    }

    changeFee1() {
        this.props.setFee(1)
        this.setState({fee: (431 * this.feeCoeff * 1) / 100000000})
        this.setState({maxSum: this.props.ltcBalance - (431 * this.feeCoeff * 1) / 100000000})
        this.setState({feeUSD: this.props.course * (431 * this.feeCoeff * 1) / 100000000})

    }

    changeFee2() {
        this.props.setFee(2)
        this.setState({fee: (431 * this.feeCoeff * 2) / 100000000})
        this.setState({maxSum: this.props.ltcBalance - (431 * this.feeCoeff * 2) / 100000000})
        this.setState({feeUSD: this.props.course * (431 * this.feeCoeff * 2) / 100000000})
    }

    changeFee3() {
        this.props.setFee(3)
        this.setState({fee: (431 * this.feeCoeff * 3) / 100000000})
        this.setState({maxSum: this.props.ltcBalance - (431 * this.feeCoeff * 3) / 100000000})
        this.setState({feeUSD: this.props.course * (431 * this.feeCoeff * 3) / 100000000})
    }

    setClass1(): string {
        if (this.props.trFee === 1) {
            return 'clickFee1'
        } else {
            return 'Fee1'
        }
    }

    setClass2(): string {
        if (this.props.trFee === 2) {
            return 'clickFee2'
        } else {
            return 'Fee2'
        }
    }

    setClass3(): string {
        if (this.props.trFee === 3) {
            return 'clickFee3'
        } else {
            return 'Fee3'
        }
    }

    setClass() {
        this.classFee1 = this.setClass1()
        this.classFee2 = this.setClass2()
        this.classFee3 = this.setClass3()
    }


    render() {
        this.setClass()
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrencyLTC'/>
                    <div className='blockSendTransactionAddress'>
                        <div className='iconQr'/>
                        <input 
                            type='text' className='payment_address' 
                            placeholder='  Send to Litcoin address...'
                            value={this.state.paymentAddress} onChange={this.handleAddressChange}
                            />
                    </div>
                    <div className='blockSendTransactionSum'>
                        <div className='iconSum'/>
                        <div className='poleSumLTC'>
                            <input type='text' className='payment_sum' placeholder=''
                                   onChange={this.handleAmountChange}/>

                            <p className='payment_sum_'>{this.state.amountS}</p>
                            <p className='payment_sumUSD'>{this.state.usd.toFixed(2)}</p>
                        </div>
                        <button className='setMaxSum' onClick={this.setMax}/>
                    </div>

                    <div className='blockFee'>
                        <p className='text_Transaction_fee'>Transaction fee</p>
                        <button className={this.classFee1} onClick={this.changeFee1}/>
                        <button className={this.classFee2} onClick={this.changeFee2}/>
                        <button className={this.classFee3} onClick={this.changeFee3}/>
                        <p className='sum_Transaction_fee'>{(this.state.fee).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' LTC'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.feeUSD).toFixed(2)}</p>
                    </div>

                    <div className='blockBalance'>
                        <p className='text_Transaction_fee'>Avalible</p>
                        <p className='sum_Transaction_balance'>{Number(this.state.maxSum).toFixed(8)}</p>
                        <p className='NameCrypto_Transaction_fee'>{' LTC'}</p>
                        <p className='USD_icon'>{'$'}</p>
                        <p className='USD_Transaction_fee'>{(this.state.balanceUSD).toFixed(2)}</p>
                    </div>
                    <div className='buttonSendCancelFlex'>
                        <div className='buttonSendBig'>
                            <Link to = '/main'>
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
