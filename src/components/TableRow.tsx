import * as React from 'react'

interface iTableRowState {
  statusClassName: string
}
export class TableRow extends React.Component<any, iTableRowState> {
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
        <td>{this.props.data.Currency}</td>
        <td className = {this.state.statusClassName}>{this.props.data.Amount}</td>
        <td className = {this.state.statusClassName}>{this.props.data.Address}</td>
        <td className = {this.state.statusClassName}>{this.props.data.Status}</td>
        )}
      </tr>
    )
  }
}
