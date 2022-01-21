import { Avatar, Button } from '@mui/material'
import React from 'react'
import { connect } from 'react-redux'
import { RootDispatch } from '../Redux/store'
import './Profile.scss'

interface ProfileProps {}

interface StateToProps {
  logout: Function
}

type Props = ProfileProps & StateToProps

class Profile extends React.Component<Props> {
  // constructor(props: Props) {
  //   super(props)
  // }
  
  goToTimelog = () => {
    // goto timelog
  }

  render() {
    return (
      <div className="profile-wrapper">
        <Avatar
          className="profile-profile-btn"
        >
          M
        </Avatar>

        <p>Display Name</p>
        <p>Account</p>

        <div className="profile-link-btn-area">
          <Button
            variant="contained"
            className="profile-link-btn"
            onClick={this.goToTimelog}
          >
            TIMELOG
          </Button>

          <Button
            variant="contained" 
            className="profile-link-btn"
            onClick={() => this.props.logout()}
          >
            LOGOUT
          </Button>
        </div>

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: RootDispatch) => {
  return {
    logout: () => dispatch({ type: 'auth/logout' })
  }
}

export default connect(null, mapDispatchToProps)(Profile)