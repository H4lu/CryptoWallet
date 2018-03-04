import * as React from 'react'
import { Redirect } from 'react-router-dom'
// import { isValidUser } from './utils/AuthService'
import { Button, Icon, Input, Form, Header, Grid } from 'semantic-ui-react'

interface ISignState {
  pin: number
  redirect: boolean
}

interface ISignProps {

}

export class SignIn extends React.Component<ISignProps, ISignState> {
  public constructor(props: ISignProps) {
    super(props)
    this.state = {
      pin: 12345678,
      redirect: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onPinChanged = this.onPinChanged.bind(this)
  }
  onPinChanged = (e: any) => {
    this.setState({ pin: e.target.value })
  }

  onSubmit = () => {
  }

  render() {
    if (this.state.redirect) {
      console.log('im in redirect')
      return (<Redirect to = '/home'/>)
    } else {
      console.log('im don`t')
      return (
      <div>
        <Grid verticalAlign = 'middle' className = 'center aligned' style = {{ height: '640px' }}>
        <Grid.Column>
        <Form >
          <div className = 'label'>
            <Header textAlign = 'center' size = 'huge' style = {{ padding: '10px', margin: '20px' }}>Enter pin:</Header>
          </div>
          <Input
            type = 'password'
            placeholder = 'Pin'
            onChange = {this.onPinChanged}
            />
            <Button color = 'blue' icon labelPosition = 'right' onClick = {this.onSubmit}>Sign in<Icon name = 'sign in'/></Button>
        </Form>
        </Grid.Column>
      </Grid>
      </div>
      )
    }
  }
}
