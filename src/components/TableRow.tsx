import * as React from 'react'
import { ARROW_UP_PATH, ARROW_DOWN_PATH } from '../core/paths'
interface ITableRowState {
  statusClassName: string
}
export class TableRow extends React.Component<any, ITableRowState> {
  constructor(props: any) {
    super(props)
    this.state = {
      statusClassName : 'text-confirmed'
    }
  }
  render() {
/* {(this.props.data.Status === 'confirmed') ? (
          this.setState({statusClassName: 'text-confirmed'})) : (
          this.setState({statusClassName: 'text-unconfirmed'}))
        }
*/
    return(
         <tr>
        <td>{this.props.data.Date}</td>
        {(this.props.data.Type === 'incoming') ? (
          <td><img src = {ARROW_UP_PATH}/>{this.props.data.Currency}</td>
        ) : (
          <td><img src = {ARROW_DOWN_PATH}/>{this.props.data.Currency}</td>
        )}
        {(this.props.data.Status === 'Confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Amount}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Amount}</td>
        )}
        {(this.props.data.Status === 'Confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Address}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Address}</td>
        )}
        {(this.props.data.Status === 'Confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Status}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Status}</td>
        )}
      </tr>
    )
  }
}
