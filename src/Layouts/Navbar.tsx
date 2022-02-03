import React from 'react'
import './Navbar.scss'

import {
  IconButton,
  Avatar,
  Popover,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Profile from '../Components/Profile'
import UserService, { User } from '../Services/UserService';
import { RootDispatch, RootState } from '../Redux/store';
import { connect } from 'react-redux';

interface NavbarProps {
  toggleSidebar: () => void
  setLoginUser: (user: User) => {type: string, payload: {user: User}}
  loginUser: User | null
}

interface NavbarState {
  profileAnchorEl: Element | null
}

class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props)

    this.state = {
      profileAnchorEl: null,
    }
  }

  componentDidMount = async () => {
    try {
      const res = await UserService.getUserProfile()
      this.props.setLoginUser(res.data)
    } catch (err) {
      alert('failed to get user profile')
      console.log('failed to get user profile')
    }
  }

  clickProfileBtn = (event: React.MouseEvent) => {
    if (!!event.target) {
      this.setState({ profileAnchorEl: event.target as Element})
    }
  }

  closeProfilePopover = () => {
    this.setState({ profileAnchorEl: null })
  }

  render() {
    return (
      <div className="navbar-wrapper">
        <div className="navbar-menu-icon-area">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ marginRight: 2 }}
            onClick={() => this.props.toggleSidebar()}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div className="navbar-logo-area">
          <span>
            AMS_LOGO
          </span>
        </div>
        <div className="navbar-profile-area">
          <Avatar
            className="navbar-profile-btn"
            onClick={this.clickProfileBtn}
          >
            {this.props.loginUser?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Popover
            open={!!this.state.profileAnchorEl}
            anchorEl={this.state.profileAnchorEl}
            onClose={this.closeProfilePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Profile loginUser={this.props.loginUser}/>
          </Popover>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    loginUser: state.auth.loginUser
  }
}

const mapDispatchToProps = (dispatch: RootDispatch) => {
  return {
    setLoginUser: (user: User) => dispatch({type: 'auth/setUser', payload: {user: user}})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)