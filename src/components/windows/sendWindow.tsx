import React, {FC, useEffect, useState} from 'react';
import {DisplayTransactionCurrency, FeeTypes, toDisplayCurrencyName} from '../../api/cryptocurrencyApi/utils'
import {Link} from "react-router-dom";
import {ipcRenderer, remote} from 'electron'
import {PCSCMessage} from "../../pcsc_helpers";


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
        props.stateSR(true);
    }, [])

    useEffect(() => {
        const cryptoFee = (props.feeMagic * props.feeCoeff * feeType) / props.feeDivider
        setFee(cryptoFee)
        setFeeUsd(props.course * cryptoFee)
        setMaxSum(props.cryptoBalance - cryptoFee)
    }, [feeType])

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "") {
            setAmount(null)
        } else {
            setAmount(Number(e.target.value))
        }

        setUsd(Number(e.target.value) * props.course)
    }

    const setMax = () => {
        const sum = Math.max(Math.floor(maxSum * 1000000) / props.feeDivider, 0)
        setAmount(sum)
        setUsd(sum * props.course)
    }

    const getFeeClass = (targetFeeType: FeeTypes): string => {
        return targetFeeType == feeType ? `clickFee${targetFeeType}` : `Fee${targetFeeType}`
    }

    const handleClick = async () => {
        if (paymentAddress == "") {
            remote.dialog.showErrorBox("Error", "No address provied")
            return
        }
        if (amount <= 0) {
            remote.dialog.showErrorBox("Error", "No amount provided")
            return
        }
        if (amount >= props.cryptoBalance) {
            remote.dialog.showErrorBox("Error", "There is no available amount")
            return
        }
        if (paymentAddress != '') {
            const msg: PCSCMessage = {
                type: 12,
                data: {
                    currency: props.currency,
                    paymentAddress: paymentAddress,
                    amount: amount,
                    fee: feeType,
                    course: props.course,
                    cryptoBalance: props.cryptoBalance
                }
            }
            ipcRenderer.send('pcsc', msg)
        }
    }


    return (
        <div className='main'>
            <div className='rectangleSR'>
                <div className={`iconCryptoCurrency${props.currency}`}/>
                <div className='blockSendTransactionAddress'>
                    <div className='iconQr'/>
                    <input
                        type='text'
                        className='payment_address'
                        placeholder={`  Send to ${toDisplayCurrencyName(props.currency)} address...`}
                        value={paymentAddress}
                        onChange={e => setPaymentAddress(e.target.value)}
                    />
                </div>
                <div className='blockSendTransactionSum'>
                    <div className='iconSum'/>
                    <div className={`sumField${props.currency}`}>
                        <input type="number" className='payment_sum'
                               placeholder={"0.0"} defaultValue={""}
                               value={amount}
                               onChange={handleAmountChange} step={0.0000001}/>
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
                        <button type='submit' className='button-send-transaction' onClick={handleClick}/>
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
