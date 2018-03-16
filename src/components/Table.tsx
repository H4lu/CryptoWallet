import React from 'react'
import { TableRow } from './TableRow'
interface ITableClass {
  data: Array<any>
}
export class Table extends React.Component<any,ITableClass> {
  constructor(props: any) {
    super(props)

    this.state = {
      data: []
    }
    this.getData = this.getData.bind(this)
  }
  getData(data: Array<any>) {
    for (let index in data) {
      if (data[index].outgoing !== undefined) {
        let date = new Date(data[index].time * 1000)
        let amount = data[index].outgoing.value
        let address = data[index].outgoing.outputs[0].address
        let type = 'outgoing'
        let status = (data[index].confirmations === 0) ? 'Uncofirmed' : 'Confirmed'
        let dataToPass = {
          Date: date,
          Amount: amount,
          Address: address,
          Status: status,
          Type: type
        }
        this.setState({ data: [...this.state.data, dataToPass] })
      } else {
        let date = new Date(data[index].time * 1000)
        let amount = data[index].incoming.value
        let address = data[index].incoming.inputs[0].address
        let type = 'incoming'
        let status = (data[index].confirmations === 0) ? 'Uncofirmed' : 'Confirmed'
        let dataToPass = {
          Date: date,
          Amount: amount,
          Address: address,
          Status: status,
          Type: type
        }
        this.setState({ data: [...this.state.data, dataToPass] })
      }
    }
  }
  render() {
    return(
      <div className = 'transaction-history'>
        <p className = 'transaction-history-header'>Transaction History:</p>
        <table>
          <thead>
            <th>Date</th>
            <th></th>
            <th>Value</th>
            <th>Address</th>
            <th>Status</th>
          </thead>
          <tbody>
            {Array(this.props.data).map((value) => {
              return <TableRow data = {value}/>
            })}
          </tbody>
         </table>
      </div>
    )
  }
}
