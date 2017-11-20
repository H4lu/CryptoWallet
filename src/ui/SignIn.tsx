import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { isValidUser } from '../core/auth/AuthService'
// import { isValidUser } from './utils/AuthService'

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
      <div className = 'wrapper'>
        <form className = 'login-form'>
          <div className = 'label'>
            <p>Please enter your login information</p>
          </div>
          <input
            type = 'text'
            placeholder = 'Pin'
            onChange = {this.onPinChanged}
            value = {this.state.pin}
            />
            <button onClick = {this.onSubmit}>Submit</button>
        </form>

      </div>
      )
    }
  }
}
