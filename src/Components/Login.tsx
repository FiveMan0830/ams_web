import { ChangeEvent, Component } from 'react'
import './Login.scss'
import AuthService from '../Services/AuthService'
import { connect } from 'react-redux'
import { RootState, RootDispatch } from '../Redux/store'

interface LoginProps {
  location?: string
}

interface StateToProps {
  login: Function
  user: any
}

type CombinedLoginProps = LoginProps & StateToProps

interface LoginState {
  account: string,
  password: string
}

class Login extends Component<CombinedLoginProps, LoginState> {
  private redirectUrl: string

  constructor(props: CombinedLoginProps) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.login = this.login.bind(this)
    this.updateAccount = this.updateAccount.bind(this)
    this.updatePassword = this.updatePassword.bind(this)

    this.state = {
      account: '',
      password: ''
    }

    // if no redirect url exist, use ams as default
    const query = new URLSearchParams(decodeURI(window.location.search))
    this.redirectUrl = query.get('redirectUrl') || ''
    if (this.redirectUrl === '') {
      this.redirectUrl = '/'
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Enter' && this.state.account && this.state.password) {
      this.login()
    }
  }

  async login() {
    try {
      const res = await AuthService.login(this.state.account, this.state.password)
      
      // store access token into localStorage
      localStorage.setItem('access_token', res.data)

      // update redux
      this.props.login(res.data)

      console.log('user', this.props.user)

      // redirect
      window.location.href = this.redirectUrl
    } catch (err) {
      console.log(err)
      window.location.href = '/error'
    }
  }

  updateAccount(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({account: event.target.value}) 
  }

  updatePassword(event: ChangeEvent<HTMLInputElement>): void {
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

const mapStateToProps = (state: RootState) => {
  console.log('state', state)
  return {
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch: RootDispatch) => {
  return {
    login: (accessToken: string) => dispatch({ type: 'auth/login', payload: { accessToken: accessToken }})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)