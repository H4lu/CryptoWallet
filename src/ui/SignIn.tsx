import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { isValidUser } from '../core/auth/AuthService'
// import { isValidUser } from './utils/AuthService'
import { Button, Icon, Input, Form, Label, Grid } from 'semantic-ui-react'

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
      pin: 0,
      redirect: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onPinChanged = this.onPinChanged.bind(this)
  }
  onPinChanged = (e: any) => {
    this.setState({ pin: e.target.value })
  }

  onSubmit = () => {
    if (isValidUser(this.state.pin)) {
      console.log('valid')
      this.setState({ redirect: true })
    }
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
            <Label textAlign = 'center' size = 'massive' style = {{ padding: '10px', margin: '20px' }}>Enter pin:</Label>
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
