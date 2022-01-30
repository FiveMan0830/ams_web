import { Avatar } from '@mui/material'
import React from 'react'
import { connect } from 'react-redux'
import { RootDispatch } from '../Redux/store'
import { User } from '../Services/UserService'
import './Profile.scss'
import ProfileButton from './StyledComponent/ProfileButton'

interface ProfileProps {
  loginUser: User | null
}

interface StateToProps {
  logout: Function
}

type Props = ProfileProps & StateToProps

class Profile extends React.Component<Props> {
  
  goToTimelog = () => {
    // goto timelog
    const timelogUrl = process.env.REACT_APP_TIMELOG_WEBSITE_URL
    window.open(timelogUrl, '_blank')
  }

  handleClickLogout = () => {
    this.props.logout()

    window.location.reload()
  }

  render() {
    return (
      <div className="profile-wrapper">
        <Avatar
          className="profile-profile-btn"
        >
          {this.props.loginUser?.username?.charAt(0).toUpperCase()}
        </Avatar>

        <p>{this.props.loginUser?.displayName}</p>
        <p>{this.props.loginUser?.username}</p>

        <div className="profile-link-btn-area">
          <ProfileButton
            variant="contained"
            className="profile-link-btn"
            onClick={this.goToTimelog}
          >
            TIMELOG
          </ProfileButton>

          <ProfileButton
            variant="contained" 
            className="profile-link-btn"
            onClick={this.handleClickLogout}
          >
            LOGOUT
          </ProfileButton>
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