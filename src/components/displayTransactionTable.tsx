import React, {FC} from 'react'
import {DisplayTransaction, DisplayTransactionCurrency} from '../api/cryptocurrencyApi/utils'
import {TableRow} from './displayTransactionTableRow'

interface TableProps {
    data: Array<DisplayTransaction>,
    type: string,
    activeCurrency: DisplayTransactionCurrency
}

export const DisplayTransactionTable: FC<TableProps> = (props) =>
    <div className={props.type === 'normal' ? 'transaction-history' : 'transaction-history-small'}>
        <table>
            <colgroup>
                <col style={{width: "2%"}}/>
                <col style={{width: "11%"}}/>
                <col style={{width: "4%"}}/>
                <col style={{width: "3%"}}/>
                <col style={{width: "33%"}}/>
                <col style={{width: "11%"}}/>
                <col style={{width: "4%"}}/>
                <col style={{width: "2%"}}/>
                <col style={{width: "5%"}}/>
            </colgroup>
            <tbody>
            {props.data
                .map(element => <TableRow
                        data={element}
                        activeCurrency={props.activeCurrency}
                    />
                )}
            </tbody>
        </table>
    </div>
  

