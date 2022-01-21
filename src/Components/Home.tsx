import axios from 'axios'
import React from 'react'
import AuthService from '../Services/AuthService'

interface HomeProps {}

export default class Home extends React.Component {
  constructor(props: HomeProps) {
    super(props)

    this.setCookie = this.setCookie.bind(this)
    this.clickButton = this.clickButton.bind(this)
    this.logout = this.logout.bind(this)
  }

  async clickButton() {
    try {
      const res = await AuthService.tryNeedAuth()

      console.log(res.status)
    } catch (err) {
      console.log(err)
    }
  }

  async setCookie() {
    try {
      let res = await axios.get(`${process.env.REACT_APP_AMS_API_V2}/cookie`)

      console.log(res.status)
    } catch (err) {
      console.log(err)
    }
  }

  logout() {
    AuthService.logout()
  }
  
  render() {
    return (
      <div>
        <h1>Welcome to AMS</h1>

        {/* <button onClick={this.setCookie} style={{margin: '10px'}}>Click me to set cookie</button>
        <button onClick={this.clickButton} style={{margin: '10px'}}>Call /need-auth</button>
        <button onClick={this.logout} style={{margin: '10px'}}>Logout</button> */}
      </div>
    )
  }
}