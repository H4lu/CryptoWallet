import * as React from 'react'
import {ARROW_UP_PATH, ARROW_DOWN_PATH} from '../core/paths'

interface ITableRowState {
    statusClassName: string,
    classImg: string
}

export class TableRow extends React.PureComponent<any, ITableRowState> {
    constructor(props: any) {
        super(props)
        this.state = {
            statusClassName: 'text-confirmed',
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
                <td>{this.props.data.Date}</td>

                <td><div className={this.state.classImg}/></td>

                {(this.props.data.Type === 'incoming') ? (
                    <td><img src={ARROW_UP_PATH}/>{this.props.data.Currency}</td>
                ) : (
                    <td><img src={ARROW_DOWN_PATH}/>{this.props.data.Currency}</td>
                )}

                {(this.props.data.Status === 'Confirmed') ? (
                    <td className='text-confirmed'>{this.props.data.Amount}</td>
                ) : (
                    <td className='text-unconfirmed'>{this.props.data.Amount}</td>
                )}

                {(this.props.data.Status === 'Confirmed') ? (
                    <td className='text-confirmed'>{this.props.data.Address}</td>
                ) : (
                    <td className='text-unconfirmed'>{this.props.data.Address}</td>
                )}

                {(this.props.data.Status === 'Confirmed') ? (
                    <td className='text-confirmed'>{this.props.data.Status}</td>
                ) : (
                    <td className='text-unconfirmed'>{this.props.data.Status}</td>
                )}
            </tr>
        )
    }
}
