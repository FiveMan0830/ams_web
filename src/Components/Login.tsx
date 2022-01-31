import { ChangeEvent, Component } from 'react'
import './Login.scss'
import AuthService from '../Services/AuthService'

interface LoginProps {
  location?: string
}

interface LoginState {
  account: string,
  password: string
}

class Login extends Component<LoginProps, LoginState> {
  private redirectUrl: string

  constructor(props: LoginProps) {
    super(props)

    this.state = {
      account: '',
      password: ''
    }

    this.redirectUrl = ''
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)

    // if no redirect url exist, use ams as default
    const query = new URLSearchParams(decodeURIComponent(window.location.search))
    this.redirectUrl = query.get('redirect_url') || '/'
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && this.state.account && this.state.password) {
      this.login()
    }
  }

  login = async () => {
    try {
      const loginRes = await AuthService.login(this.state.account, this.state.password)
      const accessToken = loginRes.data

      this.redirectUrl += `?access_token=${accessToken}`

      window.location.href = this.redirectUrl
    } catch (err) {
      console.log(err)
      window.location.href = '/error'
    }
  }

  updateAccount = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({account: event.target.value}) 
  }

  updatePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({password: event.target.value})
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="background">
          <div className="top"></div>
          <div className="bottom"></div>
        </div>
        <div className="center">
          <h1>OIS</h1>
          <p>Organization Integrating System</p>
          <input
            type="text"
            placeholder="username"
            id="username"
            value={this.state.account}
            onChange= {this.updateAccount}/>
          <input
            type="password"
            placeholder="password"
            id="password"
            value={this.state.password}   
            onChange={this.updatePassword}
          />
          <input
            type="submit"
            value="Log In"
            id="login-button"
            onClick={this.login}
            className={(this.state.account && this.state.password) ? "active" : ""}
            disabled={this.state.account === '' || this.state.password === ''}
          />
        </div>
      </div> 
    )
  }
}

export default Login