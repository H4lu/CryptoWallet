import * as React from 'react'

export class TableRow extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return(
      <tr>
        <td>{this.props.data.Date}</td>
        {(this.props.data.Type === 'incoming') ? (
          <td className = 'text-confirmed'>{this.props.data.Amount}</td>
        ): (
          <td className = 'text-unconfirmed'>{this.props.data.Amount}</td>
        )}
        <td>{this.props.data.Address}</td>
        {(this.props.data.Status === 'confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Status}</td>
        ): (
          <td className = 'text-unconfirmed'>{this.props.data.Status}</td>
        )}
      </tr>
    )
  }
}