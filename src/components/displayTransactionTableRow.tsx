import React, {FC} from 'react'
import {DisplayTransaction, DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils'

interface TableRowProps {
    data: DisplayTransaction,
    activeCurrency: DisplayTransactionCurrency
}

export const TableRow: FC<TableRowProps> = (props) =>
    <tr>
        <td>#</td>
        <td>{props.data.displayDate}</td>
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
        <td>{props.data.address}</td>
        <td>{props.data.amount}</td>
        <td>{props.data.currency}</td>
        {(props.data.status === 'Finished') ? (
            <td>
                <div className='pointConfirmed'/>
            </td>
        ) : (
            <td>
                <div className='pointUnConfirmed'/>
            </td>
        )}
        <td>{props.data.status}</td>
    </tr>
