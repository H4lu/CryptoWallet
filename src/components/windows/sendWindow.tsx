import React, {FC, useState, useEffect} from 'react';
import {DisplayTransactionCurrency, FeeTypes, toDisplayCurrencyName} from '../../api/cryptocurrencyApi/utils'
import {sendTransaction} from "../../core/sendTransaction";
import {remote} from "electron"
import {Link} from "react-router-dom";


interface SendProps {
    stateSR: (arg: boolean) => void;
    course: number,
    cryptoBalance: number,
    feeCoeff: number,
    currency: DisplayTransactionCurrency,
    feeMagic: number,
    feeDivider: number
}

export const SendWindow: FC<SendProps> = (props) => {
    const [paymentAddress, setPaymentAddress] = useState("")
    const [amount, setAmount] = useState<number>(null)
    const [fee, setFee] = useState(0)
    const [usd, setUsd] = useState(0)
    const [feeUsd, setFeeUsd] = useState(0)
    const [maxSum, setMaxSum] = useState(0)
    const [feeType, setFeeType] = useState(FeeTypes.MEDIUM)

    useEffect(() => {
        props.stateSR(false);
    }, [])

    useEffect(() => {
        const cryptoFee = (props.feeMagic * props.feeCoeff * feeType) / props.feeDivider
        setFee(cryptoFee)
        setFeeUsd(props.course * cryptoFee)
        setMaxSum(props.cryptoBalance - cryptoFee)
    }, [feeType])
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setAmount(Number(e.target.value))
        setUsd(Number(e.target.value) * props.course)
    }

    const setMax = () => {
        let sum = (Math.floor(maxSum * 1000000)) / props.feeDivider
        if (sum < 0) {
            sum = 0
        }
     
        setAmount(sum)
        setUsd(sum * props.course)
    }

    const getFeeClass = (targetFeeType: FeeTypes): string => {
        return targetFeeType == feeType ? `clickFee${targetFeeType}` : `Fee${targetFeeType}`
    }

    const handleClick = async () => {
        try {
            await sendTransaction(
                'BTC', paymentAddress, amount, feeType, props.course, props.cryptoBalance
                )
        } catch(err) {
            console.error(err)
            remote.dialog.showErrorBox("Send transaction error", err.message)
        }
    }

    
    return (
        <div className='main'>
            <div className='rectangleSR'>
                <div className = {`iconCryptoCurrency${props.currency}`}/>
                <div className='blockSendTransactionAddress'>
                    <div className='iconQr'/>
                    <input 
                        type='text' 
                        className='payment_address' 
                        placeholder = {`  Send to ${toDisplayCurrencyName(props.currency)} address...`}
                        value={paymentAddress} 
                        onChange={e => setPaymentAddress(e.target.value)}
                        />
                </div>
                <div className='blockSendTransactionSum'>
                    <div className = 'iconSum'/>
                    <div className = {`sumField${props.currency}`}>
                        <input type = "number" className = 'payment_sum' 
                               placeholder = {"0.0"}
                               onChange = {handleAmountChange} step = {0.0000001}/>
                        <p className='payment_sumUSD'> {(usd).toFixed(2)}</p>
                    </div>
                    <button className='setMaxSum' onClick={setMax}/>
                </div>

                <div className='blockFee'>
                    <p className='text_Transaction_fee'>Transaction fee</p>
                    <button className={getFeeClass(FeeTypes.LOW)} onClick={_ => setFeeType(FeeTypes.LOW)}/>
                    <button className={getFeeClass(FeeTypes.MEDIUM)} onClick={_ => setFeeType(FeeTypes.MEDIUM)}/>
                    <button className={getFeeClass(FeeTypes.HIGH)} onClick={_ => setFeeType(FeeTypes.HIGH)}/>
                    <p className='sum_Transaction_fee'>{fee.toFixed(8)}</p>
                    <p className='NameCrypto_Transaction_fee'>{props.currency}</p>
                    <p className='USD_icon'>{'$'}</p>
                    <p className='USD_Transaction_fee'>{feeUsd.toFixed(2)}</p>
                </div>

                <div className='blockBalance'>
                    <p className='text_Transaction_fee'>Avalible</p>
                    <p className='sum_Transaction_balance'>{maxSum.toFixed(8)}</p>
                    <p className='NameCrypto_Transaction_fee'>{props.currency}</p>
                    <p className='USD_icon'>{'$'}</p>
                    <p className='USD_Transaction_fee'>{(props.cryptoBalance * props.course).toFixed(2)}</p>
                </div>
                <div className='buttonSendCancelFlex'>
                    <div className='buttonSendBig'>
                        <Link to = '/main'>
                            <button type='submit' className='button-send-transaction' onClick={handleClick}/>
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
