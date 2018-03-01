import React from 'react'

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
  componentWillMount() {
    this.getData(this.props.data)
  }
  getData(data: Array<any>) {
    for (let index in data) {
      console.log('Tx type: ' + data[index].incoming)
      if (data[index].outgoing !== undefined) {
        let date = new Date(data[index].time * 1000)
        let amount = data[index].outgoing.value
        let address = data[index].outgoing.outputs[0].address
        let type = 'outgoing'
        let status = (data[index].confirmations == 0) ? 'uncofirmed': 'confirmed'
        let dataToPass = {
          Date: date,
          Amount: amount,
          Address: address,
          Status: status,
          Type: type
        }
        this.setState({ data: [...data, dataToPass] })
      } else {
        let date = new Date(data[index].time * 1000)
        let amount = data[index].incoming.value
        let address = data[index].incoming.inputs[0].address
        let type = 'incoming'
        let status = (data[index].confirmations == 0) ? 'uncofirmed': 'confirmed'
        let dataToPass = {
          Date: date,
          Amount: amount,
          Address: address,
          Status: status,
          Type: type
        }
        this.setState({ data: [...data, dataToPass] })
      }
    }
  }
  render() {
    return(
      <div className = 'transaction-history'>
        <header className = 'text-header'>Transaction History:</header>
        <table>
          <thead>
          <tr>
            <th>Date</th>
            <th>How much</th>
            <th>To/from address</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          {this.state.data.map((data) => {
            <tbody>
            <tr>
              <td>{data.Date}</td>
              {(data.Type === 'incoming') ? (
                <td className = 'text-confirmed'>{data.Amount}</td>
              ):(
                <td className = 'text-unconfirmed'>{data.Amount}</td>
              )}
              <td>{data.Address}</td>
              {(data.Status === 'confirmed') ? (
                <td className = 'text-confirmed'>{data.Status}</td>
              ): (
                <td className = 'text-unconfirmed'>{data.Status}</td>
              )}
            </tr>
            </tbody>
          })}
          </tbody>
        </table>
      </div>
    )
  }
}
