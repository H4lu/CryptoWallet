import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { isValidUser } from '../core/auth/AuthService'
// import { isValidUser } from './utils/AuthService'
// import { Redirect } from 'react-router'

interface ISignState {
  readonly username: string
  readonly password: string
}

interface ISignProps {

}

export class SignIn extends React.Component<ISignProps, ISignState> {
  public constructor(props: ISignProps) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.onUsernameChanged = this.onUsernameChanged.bind(this)
    this.onPasswordChanged = this.onPasswordChanged.bind(this)
  }
  onUsernameChanged = (e: any) => {
    this.setState({ username: e.target.value })
  }

  onPasswordChanged = (e: any) => {
    this.setState({ password: e.target.value })
  }
  onSubmit = () => {
    if (isValidUser(this.state.username, this.state.password)) {
      console.log('valid')
      return <Redirect to = '/'/>
    }
  }

  render() {
    return (
      <div className = 'wrapper'>
        <form className = 'login-form' onSubmit = {this.onSubmit}>
          <div className = 'label'>
            <p>Please enter your login information</p>
          </div>
          <input
            type = 'text'
            placeholder = 'Login'
            onChange = {this.onUsernameChanged}
            value = {this.state.username}
            />
          <input
            type = 'password'
            placeholder = 'Password'
            onChange = {this.onPasswordChanged}
            value = {this.state.password}
            />
            <button onClick = {this.onSubmit}>Submit</button>
        </form>

      </div>
    )
  }

}
