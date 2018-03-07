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
  componentWillReceiveProps() {
    console.log('PROPS: ' + JSON.stringify(this.props.data))
    this.getData(this.props.data)
  }
  getData(data: Array<any>) {
    console.log('GETTING DATA')
    for (let index in data) {
      console.log('My tx: ' + JSON.stringify(data[index]))
      console.log('Tx type: ' + JSON.stringify(data[index].incoming))
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
        console.log('Data to pass: ' + JSON.stringify(dataToPass))
        this.setState({ data: [...this.state.data, dataToPass] })
        console.log('MY DATA: ' + JSON.stringify(this.state.data))
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
        console.log('My data: ' + JSON.stringify(this.state.data))
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
            {this.state.data.map((value) => {
              return <tr>
               <td>{JSON.stringify(value.Date)}</td>
              {(value.Type === 'incoming') ? (
                <td className = 'text-confirmed'>{value.Amount}</td>
              ) : (
                <td className = 'text-unconfirmed'>{value.Amount}</td>
              )}
              <td>{value.Address}</td>
              {(value.Status === 'confirmed') ? (
                <td className = 'text-confirmed'>{value.Status}</td>
              ) : (
                <td className = 'text-unconfirmed'>{value.Status}</td>
              )}
            </tr>
            })}
          </tbody>
         </table>
      </div>
    )
  }
}
