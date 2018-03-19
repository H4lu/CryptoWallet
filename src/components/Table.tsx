import React from 'react'
import { TableRow } from './TableRow'
interface ITableClass {
  dataToRender: Array<any>
}
interface ITableProps {
  data: Array<Object>
}

export class Table extends React.Component<ITableProps,ITableClass> {
  constructor(props: any) {
    super(props)

    this.state = {
      dataToRender: []
    }
    this.renderTable = this.renderTable.bind(this)
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
        this.setState({ dataToRender: [...this.state.dataToRender, dataToPass] })
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
        this.setState({ dataToRender: [...this.state.dataToRender, dataToPass] })
      }
    }
  }
  renderTable() {
  }
  
  render() {
    return(
      <div className = 'transaction-history'>
        <p className = 'transaction-history-header'>Transaction History:</p>
        <table>
          <thead>
            <th>Date</th>
            <th>Currency</th>
            <th>Value</th>
            <th>Address</th>
            <th>Status</th>
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
