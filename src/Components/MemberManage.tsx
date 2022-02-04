import React from 'react'
import './MemberManage.scss'
import {
  Autocomplete,
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
} from '@mui/icons-material';

import { connect } from 'react-redux';
import { RootDispatch, RootState } from '../Redux/store'
import { fetchAllTeams } from '../Redux/Reducers/TeamReducer';

import TeamService, { Team } from '../Services/TeamService';
import UserService, { User } from '../Services/UserService';
import UserProfileCard from './UserProfileCard';


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
      selectedNewLeader: null,
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for event handling
  // 
  //////////////////////////////////////////////////////////////////////////////
  handleSelectTeam = async (team: Team) => {
    this.setState({selectedTeam: team})
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
          <UserProfileCard
            user={leader}
            showLeaderIcon
          />

          {/* show members */}
          {this.state.selectedTeam.members.map(member => (
            this.state.selectedTeam?.leader.userId !== member.userId ?
              <UserProfileCard
                user={member}
                key={member.userId}
                onClickTransferOwner={isLoginUserLeader ? this.handleClickTransferOwner : undefined }
                onClickRemoveMember={isLoginUserLeader ? this.handleClickRemoveMember : undefined }
              />
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
    return (
      <div className="member-manage-wrapper">
        <div className="member-manage-area">
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
        >
          <DialogContent>
            <DialogContentText>
              {"Are you sure to remove user "}
              <span className="highlight-text">
                {this.state.selectedRemoveUser?.username}
              </span>
              {" from team "}
              <span className="highlight-text">
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
        >
          <DialogContent>
            <DialogContentText>
              {"Are you sure to transfer the leader to "}
              <span className="highlight-text">
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