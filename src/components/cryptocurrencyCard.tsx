import React, {FC} from 'react';
import {DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils';

interface CryptocurrencyCardProps {
    onClick: () => void,
    cryptoBalance: number,
    fiatBalance: number,
    isActive: boolean,
    currency: DisplayTransactionCurrency
}

export const CryptocurrencyCard: FC<CryptocurrencyCardProps> = (props) => {
    return (
        <div onClick={props.onClick}>
            <div className={props.isActive ? `img_${props.currency}_selected` : `img_${props.currency}`}>
                <p className='balance'>{props.cryptoBalance}</p>
                <p className='fiat'>{props.fiatBalance}</p>
            </div>
        </div>
    )
}
