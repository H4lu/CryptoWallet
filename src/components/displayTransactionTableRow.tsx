import React, {FC} from 'react'
import {DisplayTransaction, DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils'

interface TableRowProps {
    data: DisplayTransaction,
    activeCurrency: DisplayTransactionCurrency
}

export const TableRow: FC<TableRowProps> = (props) =>
    <tr>
        <td>
            <div className='numTransactoion'>#</div>
        </td>
        <td>
            <div className='dateTransactoion'>{props.data.displayDate}</div>
        </td>
        <td>
            <div className={props.activeCurrency + 'img'}/>
        </td>
        {(props.data.type === 'incoming') ? (
            <td>
                <div className='income'/>
            </td>
        ) : (
            <td>
                <div className='outcome'/>
            </td>
        )}
        <td>
            <div className='addressTransaction'>{props.data.address}</div>
        </td>
        <td>
            <div className='amountTransaction'>{props.data.amount}</div>
        </td>
        <td>
            <div className='currencyTransaction'>{props.data.currency}</div>
        </td>
        {(props.data.status === 'Finished') ? (
            <td>
                <div className='pointConfirmed'/>
            </td>
        ) : (
            <td>
                <div className='pointUnConfirmed'/>
            </td>
        )}
        {(props.data.status === 'Finished') ? (
            <td>
                <div className='confirmedTransaction'>{props.data.status}</div>
            </td>
        ) : (
            <td>
                <div className='unconfirmedTransaction'>{props.data.status}</div>
            </td>
        )}
    </tr>
