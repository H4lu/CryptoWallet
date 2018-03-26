import React from 'react'
import { TableRow } from './TableRow'
interface ITableClass {
  dataToRender: Array<any>
}
interface ITableProps {
  data: Array<Object>,
  type: string
}

export class Table extends React.Component<ITableProps,ITableClass> {
  constructor(props: any) {
    super(props)

    this.state = {
      dataToRender: []
    }

  }

  render() {
    let tableType = (this.props.type === 'normal') ? 'transaction-history' : 'transaction-history-small'
    return(
      <div className = {tableType}>
        <p className = 'transaction-history-header'>Transaction History:</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Currency</th>
              <th>Value</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((element: any) => {
              return <TableRow data = {element}/>
            })
          }
          </tbody>
         </table>
      </div>
    )
  }
}
