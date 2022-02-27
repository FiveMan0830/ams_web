import { Avatar, IconButton } from "@mui/material";
import React from "react";
import { User } from "../Services/UserService";
import './UserProfileCard.scss'

import {
  ImportExport as TransferOwnershipIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';

interface UserProfileCardProps {
  user: User
  showLeaderIcon: boolean

  onClickTransferOwner?: ((user: User) => void)
  onClickRemoveMember?: ((user: User) => void)
}

interface UserProfileCardState { }

class UserProfileCard extends React.Component<UserProfileCardProps, UserProfileCardState> {
  public static defaultProps = {
    showLeaderIcon: false,
    onClickTransferOwner: null,
    onClickRemoveMember: null
  }

  render(): React.ReactNode {
    return (
      <div
        className="member-profile"
        key={this.props.user.userId}
      >
        <div className="member-profile-avatar-area">
          <Avatar className="member-profile-avatar" sx={{width: 50, height: 50}}>
            {this.props.user.username[0].toUpperCase()}
          </Avatar>
          {this.props.showLeaderIcon ?
            <div className="leader-icon-area">
              <svg className="leader-icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                  <path d="M2387 5105 c-402 -76 -710 -367 -810 -765 -30 -121 -30 -339 0 -460 77 -307 289 -564 569 -691 180 -82 414 -109 603 -69 216 44 369 126 522 279 152 152 235 308 280 522 17 86 20 125 16 224 -13 271 -107 487 -296 676 -139 138 -290 224 -476 270 -108 27 -304 34 -408 14z"/>
                  <path d="M2380 2763 c-31 -12 -70 -58 -76 -90 -9 -50 -1 -70 80 -194 l74 -114 -34 -280 -34 -281 68 -179 c38 -98 76 -183 85 -189 12 -8 22 -8 34 0 9 6 47 91 85 189 l68 179 -34 281 -34 280 76 115 c71 106 77 119 77 167 0 46 -4 57 -33 85 l-32 33 -178 2 c-97 1 -184 -1 -192 -4z"/>
                  <path d="M1565 2674 c-366 -58 -479 -91 -602 -175 -192 -132 -327 -360 -362 -613 -14 -102 -15 -1502 -1 -1577 23 -122 115 -235 228 -281 l57 -23 1675 0 1675 0 57 23 c115 46 205 159 228 284 7 38 10 315 8 825 -4 763 -4 768 -26 848 -78 274 -269 493 -522 600 -63 26 -230 60 -482 96 -182 27 -198 24 -228 -44 -10 -23 -149 -401 -309 -839 -159 -439 -297 -811 -305 -827 -21 -41 -54 -61 -96 -61 -42 0 -75 20 -95 59 -8 16 -148 395 -311 842 -163 448 -302 826 -310 841 -29 56 -55 58 -279 22z"/>
                </g>
              </svg>
            </div>
          :
            null
          }
          <span className="member-profile-title">{this.props.user.displayName}</span>
        </div>
        <div className="member-profile-content">
          <div className="member-profile-section">
            <span className="profile-key">Email</span>
            <span className="profile-value">{this.props.user.email}</span>
          </div>
          <div className="member-profile-section">
            <span className="profile-key">Username</span>
            <span className="profile-value">{this.props.user.username}</span>
          </div>
        </div>
        <div className="operation-btn-area">
          {this.props.onClickTransferOwner ? 
            <IconButton
              sx={{ width: 15, height: 15, margin: 1 }}
              onClick={() => {
                if (this.props.onClickTransferOwner)
                  return this.props.onClickTransferOwner(this.props.user)
              }}
            >
              <TransferOwnershipIcon />
            </IconButton>
          :
            null
          }
          {this.props.onClickRemoveMember ?
            <IconButton
              sx={{ width: 15, height: 15, margin: 1 }}
              onClick={() => {
                if (this.props.onClickRemoveMember)
                  return this.props.onClickRemoveMember(this.props.user)
              }}
            >
              <PersonRemoveIcon />
            </IconButton>
          : 
            null
          }
        </div>
      </div>
    ) 
  }
}

export default UserProfileCard