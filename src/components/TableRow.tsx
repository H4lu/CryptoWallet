import * as React from 'react'
import { DisplayTransaction, DisplayTransactionCurrency } from '../API/cryptocurrencyAPI/utils'

interface TableRowState {
    classImg: string
}

interface TableRowProps {
    data: DisplayTransaction,
    activeCurrency: DisplayTransactionCurrency
}

export class TableRow extends React.PureComponent<TableRowProps, TableRowState> {
    constructor(props: any) {
        super(props)
        this.state = {
            classImg: 'BTCimg'
        }
        this.updateCryptoimg = this.updateCryptoimg.bind(this)
    }

    updateCryptoimg() {
        this.setState({classImg: (this.props.activeCurrency + 'img')})
    }

    render() {
        {
            console.log("rerender table row")
            this.updateCryptoimg()
        }
        return (
            <tr>
                <td><div className='numTransactoion'>#</div></td>

                <td><div className='dateTransactoion'>{this.props.data.displayDate}</div></td>

                <td><div className={this.state.classImg}/></td>

                {(this.props.data.type === 'incoming') ? (
                    <td><div className='income'/> </td>
                ) : (
                    <td><div className='outcome'/> </td>
                )}

                <td><div  className='addressTransaction'>{this.props.data.address}</div></td>


                <td ><div className='amountTransaction'>{this.props.data.amount}</div></td>

                <td><div className='currencyTransaction'>{this.props.data.currency}</div></td>

                {(this.props.data.status === 'Finished') ? (
                    <td><div className='pointConfirmed'/></td>
                ) : (
                    <td><div className='pointUnConfirmed'/></td>
                )}

                {(this.props.data.status === 'Finished') ? (
                    <td><div className='confirmedTransaction'>{this.props.data.status}</div></td>
                ) : (
                    <td><div className='unconfirmedTransaction'>{this.props.data.status}</div></td>
                )}



            </tr>
        )
    }
}
