import React, {FunctionComponent} from 'react'
import { DisplayTransaction, DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils'
import {TableRow} from './DisplayTransactionTableRow'

interface TableProps {
    data: Array<DisplayTransaction>,
    type: string,
    activeCurrency: string
}

export const DisplayTransactionTable = (props: TableProps) =>        
            <div className={props.type === 'normal' ? 'transaction-history' : 'transaction-history-small' }>
                <table>
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
  

