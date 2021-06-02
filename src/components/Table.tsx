import React from 'react'
import { DisplayTransaction, DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils'
import {TableRow} from './TableRow'

interface ITableClass {
    dataToRender: Array<any>
}

interface ITableProps {
    data: Array<DisplayTransaction>,
    type: string,
    activeCurrency: DisplayTransactionCurrency
}

export class Table extends React.Component<ITableProps, ITableClass> {
    constructor(props: any) {
        super(props)

        this.state = {
            dataToRender: []
        }
    }

    render() {
        let tableType = (this.props.type === 'normal') ? 'transaction-history' : 'transaction-history-small'
        return (
            <div className={tableType}>
                <table>
                    <tbody>
                       {this.props.data
                           .map((element: DisplayTransaction) => {
                               return <TableRow 
                                        data={element} 
                                        activeCurrency={this.props.activeCurrency}
                                        />
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}
