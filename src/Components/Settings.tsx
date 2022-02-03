import { Avatar } from '@mui/material'
import React from 'react'
import './Settings.scss'

interface SettingsProps { }

interface SettingsState { }

class Settings extends React.Component<SettingsProps, SettingsState> {
  // constructor (props: SettingsProps) {
  //   super(props) 
  // }

  render(): React.ReactNode {
    return (
      <div className="settings-wrapper">
        <div className="settings-area">
          <div className="settings-header">
            <span className="settings-title">Edit Profile</span>
          </div>

          <div className="settings-body">
            <div className="settings-avatar">
              <Avatar sx={{height: 200, width: 200}}>H</Avatar>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings