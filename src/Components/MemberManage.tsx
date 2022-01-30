import React from 'react'
import './MemberManage.scss'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  TextField
} from '@mui/material';

import {
  AddCircleOutline as AddCircleOutlineIcon,
  ImportExport as TransferOwnershipIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';

import { connect } from 'react-redux';
import { RootDispatch, RootState } from '../Redux/store'
import { fetchAllTeams } from '../Redux/Reducers/TeamReducer';

import TeamService, { Team } from '../Services/TeamService';
import UserService, { User } from '../Services/UserService';
import { parseJWT } from '../Utils/JWTParser';


interface MemberManageProps {}

interface StateToProps {
  teams: Team[]
  loginUserId: string | null
  reloadAllTeams: Function
}

type CombinedMemberManageProps = MemberManageProps & StateToProps

interface MemberManageStates {
  selectedTeam: Team | null
  isAddingMember: boolean
  selectedAddUser: User | null
  allUsers: User[]
  addingMemberEl: HTMLDivElement | null
  isDeleteMemberPopupOpen: boolean
  selectedRemoveUser: User | null
  isTransferOwnerPopupOpen: boolean
  selectedNewLeader: User | null
}

class MemberManage extends React.Component<CombinedMemberManageProps, MemberManageStates> {
  private addingMemberEl: HTMLDivElement | null

  constructor(props: CombinedMemberManageProps) {
    super(props)

    this.addingMemberEl = null

    this.state = {
      selectedTeam: null,
      isAddingMember: false,
      selectedAddUser: null,
      allUsers: [],
      addingMemberEl: null, 
      isDeleteMemberPopupOpen: false,
      selectedRemoveUser: null,
      isTransferOwnerPopupOpen: false,
      selectedNewLeader: null
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for event handling
  // 
  //////////////////////////////////////////////////////////////////////////////
  handleSelectTeam = async (team: Team) => {
    this.setState({selectedTeam: team})
    parseJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDU2ODc2NDAsInVpZCI6IjVkNzk0OTgyLTU3MDUtNDgxMy1hNDc3LTc5OTg1N2IyY2Q5NiJ9.lw2MPoqn0wTa8itNCUMzlqgwwdZMGFUsOj4WhItuoDM')
  }

  handleClickAddMember = async () => {
    this.setState({ isAddingMember: true })

    try {
      const res = await UserService.getAllUsers()
      
      this.setState({ allUsers: res.data })
    } catch (err) {
      console.log('failed to get users')
    }
  }

  handleConfirmAddUser = async () => {
    if (this.state.selectedAddUser === null) return
    
    try {
      const userId = this.state.selectedAddUser.userId
      const teamId = this.state.selectedTeam?.id
      if (teamId) {
        await TeamService.addMember(userId, teamId)
        await this.props.reloadAllTeams()
        this.setState({
          selectedTeam: this.props.teams.filter(team => teamId === team.id)[0],
          isAddingMember: false,
          selectedAddUser: null
        })
      } else {
        console.log('failed to add member into null team')
      }
    } catch (err: any) {
      console.log(err.response.data)
      console.log('failed to add member')
    }
  }

  handleClickRemoveMember = (user: User) => {
    this.setState({
      selectedRemoveUser: user,
      isDeleteMemberPopupOpen: true
    })
  }

  handleCancelRemoveMember = () => {
    this.setState({
      selectedRemoveUser: null,
      isDeleteMemberPopupOpen: false
    })
  }

  handleConfirmRemoveMember = async () => {
    try {
      if (this.state.selectedTeam !== null && this.state.selectedRemoveUser != null) {
        await TeamService.removeMember(this.state.selectedRemoveUser.userId, this.state.selectedTeam.id)
        await this.props.reloadAllTeams()
        this.setState({
          selectedTeam: this.props.teams.filter(team => this.state.selectedTeam?.id === team.id)[0],
          isDeleteMemberPopupOpen: false
        })
      }
    } catch (err) {
      console.log('failed to remove member')
    }
  }

  handleClickTransferOwner = (user: User) => {
    this.setState({
      selectedNewLeader: user,
      isTransferOwnerPopupOpen: true
    })
  }

  handleCancelTransferOwner = () => {
    this.setState({
      selectedNewLeader: null,
      isTransferOwnerPopupOpen: false
    })
  }

  handleConfirmTransferOwner = async () => {
    try {
      if (this.state.selectedTeam !== null && this.state.selectedNewLeader != null) {
        await TeamService.transferOwner(this.state.selectedNewLeader.userId, this.state.selectedTeam.id)
        await this.props.reloadAllTeams()
        this.setState({
          selectedTeam: this.props.teams.filter(team => this.state.selectedTeam?.id === team.id)[0],
          isTransferOwnerPopupOpen: false
        })
      }
    } catch (err) {
      console.log('failed to transfer leader')
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for rendering page contents
  //
  //////////////////////////////////////////////////////////////////////////////
  renderMember = () => {
    if (this.state.selectedTeam) {
      const leader = this.state.selectedTeam.leader
      const isLoginUserLeader = this.props.loginUserId === this.state.selectedTeam.leader.userId
      return (
        <div className="member-area">

          {/* show leader */}
          <div className="member-profile" key={leader?.userId}>
            <div className="member-profile-avatar-area">
              <Avatar className="member-profile-avatar" sx={{width: 50, height: 50}}>
                {leader?.username[0].toUpperCase()}
              </Avatar>
              <div className="leader-icon-area">
                <svg className="leader-icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                    <path d="M2387 5105 c-402 -76 -710 -367 -810 -765 -30 -121 -30 -339 0 -460 77 -307 289 -564 569 -691 180 -82 414 -109 603 -69 216 44 369 126 522 279 152 152 235 308 280 522 17 86 20 125 16 224 -13 271 -107 487 -296 676 -139 138 -290 224 -476 270 -108 27 -304 34 -408 14z"/>
                    <path d="M2380 2763 c-31 -12 -70 -58 -76 -90 -9 -50 -1 -70 80 -194 l74 -114 -34 -280 -34 -281 68 -179 c38 -98 76 -183 85 -189 12 -8 22 -8 34 0 9 6 47 91 85 189 l68 179 -34 281 -34 280 76 115 c71 106 77 119 77 167 0 46 -4 57 -33 85 l-32 33 -178 2 c-97 1 -184 -1 -192 -4z"/>
                    <path d="M1565 2674 c-366 -58 -479 -91 -602 -175 -192 -132 -327 -360 -362 -613 -14 -102 -15 -1502 -1 -1577 23 -122 115 -235 228 -281 l57 -23 1675 0 1675 0 57 23 c115 46 205 159 228 284 7 38 10 315 8 825 -4 763 -4 768 -26 848 -78 274 -269 493 -522 600 -63 26 -230 60 -482 96 -182 27 -198 24 -228 -44 -10 -23 -149 -401 -309 -839 -159 -439 -297 -811 -305 -827 -21 -41 -54 -61 -96 -61 -42 0 -75 20 -95 59 -8 16 -148 395 -311 842 -163 448 -302 826 -310 841 -29 56 -55 58 -279 22z"/>
                  </g>
                </svg>
              </div>
              <span className="member-profile-title">{leader?.username}</span>
            </div>
            <div className="member-profile-content">
              <div className="member-profile-section">
                <span className="profile-key">Email</span>
                <span className="profile-value">{leader?.email}</span>
              </div>
              <div className="member-profile-section">
                <span className="profile-key">Name</span>
                <span className="profile-value">{leader?.displayName}</span>
              </div>
            </div>
          </div>

          {/* show members */}
          {this.state.selectedTeam.members.map(member => (
            this.state.selectedTeam?.leader.userId !== member.userId ? 
              <div className="member-profile" key={member.userId}>
                <div className="member-profile-avatar-area">
                  <Avatar className="member-profile-avatar" sx={{width: 50, height: 50}}>
                    {member.username[0].toUpperCase()}
                  </Avatar>
                  <span className="member-profile-title">{member.username}</span>
                </div>
                <div className="member-profile-content">
                  <div className="member-profile-section">
                    <span className="profile-key">Email</span>
                    <span className="profile-value">{member.email}</span>
                  </div>
                  <div className="member-profile-section">
                    <span className="profile-key">Name</span>
                    <span className="profile-value">{member.displayName}</span>
                  </div>
                </div>
                {isLoginUserLeader ? 
                  <div className="operation-btn-area">
                    <IconButton
                      sx={{ width: 15, height: 15, margin: 1 }}
                      onClick={() => this.handleClickTransferOwner(member)}
                    >
                      <TransferOwnershipIcon />
                    </IconButton>
                    <IconButton
                      sx={{ width: 15, height: 15, margin: 1 }}
                      onClick={() => this.handleClickRemoveMember(member)}
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  </div>
                :
                  null
                }
              </div>
            :
              null
          ))}

          {/* show adding member button */}
          {isLoginUserLeader ? 
            <div className="add-member-wrapper" ref={el => this.addingMemberEl = el}>
              {this.renderAddMember()}
            </div>
          :
            null
          }
        </div>
      )
    }
  }

  renderAddMember = () => {
    return (!this.state.isAddingMember ?
      <IconButton onClick={this.handleClickAddMember}>
        <AddCircleOutlineIcon sx={{ fontSize: 50 }}/>
      </IconButton>
    :
      <div className="add-member-select-area">
        <Autocomplete
          disableClearable
          isOptionEqualToValue={(opt: User, val: User) => opt.userId === val.userId}
          options={this.state.allUsers.filter((u: User) => {
            return !this.state.selectedTeam?.members.map(m => m.userId).includes(u.userId)
          })}
          getOptionLabel={(opt: User) => opt.username}
          onChange={(_, value: User) => this.setState({ selectedAddUser: value })}
          renderInput={(params) => (
            <TextField {...params} label="select user" variant="standard" />
          )}
        />
        <div className="option-btn-area">
          <Button
            color="error"
            variant="outlined"
            className="btn-cancel-add-member"
            onClick={() => this.setState({ isAddingMember: false })}
          >
            Cancel
          </Button>
          <Button
            disabled={this.state.selectedAddUser === null}
            color="success"
            variant="contained"
            className="btn-confirm-add-member"
            onClick={this.handleConfirmAddUser}
          >
            Confirm
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const dialogStyle = {
      background: '#1d3340',
      border: '2px solid #213b4a'
    }
    const dialogTextStyle = {
      color: 'white'
    }
    const dialogHighlightTextStyle = {
      textDecoration: 'underline',
      fontWeight: 'bolder'
    }

    return (
      <div className="member-manage-wrapper">
        <div className="control-area">
          <div className="team-selection-area">
            <span className="title">Team:</span>   
            <Autocomplete
              disableClearable
              className="team-select"
              isOptionEqualToValue={(opt: Team, val: Team) => opt.id === val.id}
              options={this.props.teams}
              getOptionLabel={(opt: Team) => opt.name}
              onChange={(_, value: Team) => this.handleSelectTeam(value)}
              renderInput={(params) => (
                <TextField {...params} label="select team" variant="standard" />
              )}
            />
          </div> 
          {this.renderMember()}
        </div>

        <Dialog
          open={this.state.isDeleteMemberPopupOpen}
          onClose={this.handleCancelRemoveMember}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: dialogStyle }}
        >
          <DialogContent>
            <DialogContentText sx={dialogTextStyle}>
              {"Are you sure to remove user "}
              <span
                style={dialogHighlightTextStyle}
              >
                {this.state.selectedRemoveUser?.username}
              </span>
              {" from team "}
              <span
                style={dialogHighlightTextStyle}
              >
                {this.state.selectedTeam?.name}
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={this.handleCancelRemoveMember}>Cancel</Button>
            <Button variant="contained" color="success" onClick={this.handleConfirmRemoveMember} autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.isTransferOwnerPopupOpen}
          onClose={this.handleCancelTransferOwner}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: dialogStyle }}
        >
          <DialogContent>
            <DialogContentText sx={dialogTextStyle}>
              {"Are you sure to transfer the leader to "}
              <span
                style={dialogHighlightTextStyle}
              >
                {this.state.selectedNewLeader?.username}
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={this.handleCancelTransferOwner}>Cancel</Button>
            <Button variant="contained" color="success" onClick={this.handleConfirmTransferOwner} autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: RootDispatch) => {
  return {
    reloadAllTeams: async () => await dispatch(fetchAllTeams()).unwrap()
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    teams: state.team.teams,
    loginUserId: state.auth.loginUser?.userId || null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberManage)