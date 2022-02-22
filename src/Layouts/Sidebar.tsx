import React from 'react'
import './Sidebar.scss'
import {
  Home as HomeIcon,
  // Group as GroupIcon,
  // Person as PersonIcon,
  // Settings as SettingsIcon
} from '@mui/icons-material';
import { Divider } from '@mui/material';
import SidebarButton from '../Components/StyledComponent/SidebarButton'
import BareLink from '../Components/StyledComponent/Link'
import withRouter from '../Components/HelperComponent/WithRouteWrapperComponent';
import { Location, NavigateFunction, Params } from 'react-router-dom';

interface SidebarProps {
  router: { location: Location, navigate: NavigateFunction, params: Readonly<Params<string>> }
}

interface SidebarStates{}

class Sidebar extends React.Component<SidebarProps, SidebarStates> {
  // constructor(props: SidebarProps) {
  //   super(props)
  // }

  renderTeamManageArea = () => {
    const currentPath = window.location.pathname
    const options = [
      { label: 'Teams', path: '/team-manage/teams'},
      { label: 'Members', path: '/team-manage/members'}
    ]

    return (
      <div className="sidebar-team-manage-content">
        {options.map(opt => {
          return (
            <div className="sidebar-team-manage-option" key={opt.label}>
              <div className={`sidebar-team-manage-option-background ${opt.path === currentPath ? 'active' : ''}`} />
              <BareLink to={opt.path} >
                <div className={`sidebar-team-manage-option-link`}>
                  {opt.label}
                </div>
              </BareLink>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    // const currentPath = window.location.pathname
    return (
      <div className="sidebar-wrapper">
        <BareLink to="/home">
          <SidebarButton
            startIcon={<HomeIcon />}
            className="sidebar-home-btn"
          >
            HOME
          </SidebarButton>
        </BareLink>
        <Divider variant="fullWidth" className="sidebar-divider"/>

        {/* <div className="sidebar-user-manage-wrapper">
          <BareLink to="/user-manage">
            <div className="sidebar-user-manage-title">
              <div className={`sidebar-user-manage-option-background ${'/user-manage' === currentPath ? 'active' : ''}`} />
              <PersonIcon sx={{marginRight: 1}} />
              <span>User Manage</span>
            </div>
          </BareLink>
        </div> */}

        {/* <div className="sidebar-team-manage-wrapper">
          <BareLink to="/team-manage">
            <div className="sidebar-team-manage-title">
              <GroupIcon sx={{marginRight: 1}} />
              <span>Team Manage</span>
            </div>
          </BareLink>

          {this.renderTeamManageArea()}
        </div> */}

        {/* <div className="sidebar-settings">
          <BareLink to="/settings">
            <div className="sidebar-settings-title">
              <div className={`sidebar-settings-background ${'/settings' === currentPath ? 'active' : ''}`} />
              <SettingsIcon sx={{marginRight: 1}} />
              <span>Settings</span>
            </div>
          </BareLink>
        </div> */}
      </div>
    )
  }
}

export default withRouter(Sidebar)