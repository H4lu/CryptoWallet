import * as React from 'react'
import {ARROW_UP_PATH, ARROW_DOWN_PATH} from '../core/paths'

interface ITableRowState {
    classImg: string
}

export class TableRow extends React.PureComponent<any, ITableRowState> {
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
            this.updateCryptoimg()
        }
        return (
            <tr>
                <td><div className='numTransactoion'>#</div></td>

                <td><div className='dateTransactoion'>{this.props.data.Date}</div></td>

                <td><div className={this.state.classImg}/></td>

                {(this.props.data.Type === 'incoming') ? (
                    <td><div className='income'/> </td>
                ) : (
                    <td><div className='outcome'/> </td>
                )}

                <td><div  className='addressTransaction'>{this.props.data.Address}</div></td>


                <td ><div className='amountTransaction'>{this.props.data.Amount}</div></td>

                <td><div className='currencyTransaction'>{this.props.data.Currency}</div></td>

                {(this.props.data.Status === 'Finished') ? (
                    <td><div className='pointConfirmed'/></td>
                ) : (
                    <td><div className='pointUnConfirmed'/></td>
                )}

                {(this.props.data.Status === 'Finished') ? (
                    <td><div className='confirmedTransaction'>{this.props.data.Status}</div></td>
                ) : (
                    <td><div className='unconfirmedTransaction'>{this.props.data.Status}</div></td>
                )}



            </tr>
        )
    }
}
