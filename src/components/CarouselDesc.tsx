import React, {FC} from 'react'
import {Link} from "react-router-dom";
import { DisplayTransactionCurrency, toDisplayCurrencyName } from '../API/cryptocurrencyAPI/utils';

interface CarouselDescProps {
    activeCurrency: DisplayTransactionCurrency,
    btcBalance: number,
    ltcBalance: number,
    ethBalance: number,
    btcPrice: number,
    ltcPrice: number,
    ethPrice: number,
}

const getCryptoBalance = (props: CarouselDescProps): number => {
    switch(props.activeCurrency) {
        case "BTC": return props.btcBalance;
        case "ETH": return props.ethBalance;
        case "LTC": return props.ltcBalance;
        default: return 0
    }
} 

const getFiatBalance = (props: CarouselDescProps): number => {
    switch(props.activeCurrency) {
        case "BTC": return props.btcPrice;
        case "ETH": return props.ethPrice;
        case "LTC": return props.ltcPrice;
        default: return 0;
    }
}

const getPathSend = (activeCurrency: DisplayTransactionCurrency): string => {
    switch(activeCurrency) {
        case "BTC": return "/btc-window-send";
        case "ETH": return "/eth-window-send";
        case "LTC": return "/ltc-window-send";
        default: return "#"
    }
}

const getPathReceive = (activeCurrency: DisplayTransactionCurrency): string => {
    switch(activeCurrency) {
        case "BTC": return "/btc-window-receive";
        case "ETH": return "/eth-window-receive";
        case "LTC": return "/ltc-window-receive";
        default: return "#"
    }
}

export const CarouselDesc: FC<CarouselDescProps> = (props: CarouselDescProps) => {
    // TODO: store balances as map and get by active currency
    return (
        <div>
            <p className='currencyName'>{toDisplayCurrencyName(props.activeCurrency)}</p>
            <p className='currencyCryptoBalance'>{getCryptoBalance(props)}</p>
            <p className='currencyFiatBalance'>{getFiatBalance(props)}   USD </p>
            <div className='blockButtonSendRecieve'>
                <Link to={getPathSend(props.activeCurrency)}>
                    <button className='sendCurrencybutton'/>
                </Link>
                <Link to={getPathReceive(props.activeCurrency)}>
                    <button className='recieveCurrencybutton'/>
                </Link>
            </div>
        </div>
        )
}