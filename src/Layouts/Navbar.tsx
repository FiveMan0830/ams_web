import React from 'react'
import './Navbar.scss'

import {
  IconButton,
  Avatar,
  Popover,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Profile from '../Components/Profile'
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: Function
}

interface NavbarState {
  profileAnchorEl: Element | null
}

class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props)

    this.state = {
      profileAnchorEl: null
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
        <div className="navbar-navigation">
          <Link to="/team-manage" className="navbar-navigation-link">Team Manage</Link>
          <Link to="/home" className="navbar-navigation-link">Home</Link>
        </div>
        <div className="navbar-profile-area">
          <Avatar
            className="navbar-profile-btn"
            onClick={this.clickProfileBtn}
          >
            M
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
            <Profile />
          </Popover>
        </div>
      </div>
    )
  }
}

export default Navbar