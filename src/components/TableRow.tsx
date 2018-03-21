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
        {(this.props.data.Type === 'incoming') ? (
          <td><img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAYAAAD9lDaoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACRSURBVHgB3Y69DYMwEIXvTh4gA6TwCMkIGcFN2qwRUSDTULMFEgUegRXYgAbEDgj5MCBL/AlR85p77+mT7gFcEC5DkNUvIdD0Pav4+yx9T96EefsTgoyz0oHFmFfQXNiE0KqpRP4AsPYg/dNWOkATdm+t5hfjJcQJ1KaSu5Fh3rD3DnjAkZbQbviZbgSxjbbVANdyMBtpcKJ4AAAAAElFTkSuQmCC'/>{this.props.data.Currency}</td>
        ) : (
          <td><img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAANCAYAAAB7AEQGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACNSURBVHgB5Y7NDUVQEIVnRPJ2jxLoQAtK0IEOWIqE3E7YSSTcEpRAByz89GBh3EskiIW9k0wyOfPNzAG4KS4HunsKvNAHID9p9adhmPfWBgXZZPy1Xx0Vo38GYj56qoqVPIDSYHwyFqIKkFIgYICiCFwFZ5s5ZofH5g4uXLTyRSMARwKPIaOidxm/ZlwBYyIuyGnziFgAAAAASUVORK5CYII'/>{this.props.data.Currency}</td>
        )} 

        {(this.props.data.Status === 'confirmed') ?(
          <td className = 'text-confirmed'>{this.props.data.Amount}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Amount}</td>
        )}
        {(this.props.data.Status === 'confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Address}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Address}</td>
        )}
        {(this.props.data.Status === 'confirmed') ? (
          <td className = 'text-confirmed'>{this.props.data.Status}</td>
        ) : (
          <td className = 'text-unconfirmed'>{this.props.data.Status}</td>
        )}
      </tr>
    )
  }
}
