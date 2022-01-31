import React from 'react'
import _ from 'lodash'
import TeamService, { Team } from '../Services/TeamService'
import UserService from '../Services/UserService'
import './TeamManage.scss'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Autocomplete,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

import {
  DeleteForeverOutlined as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import { RootState } from '../Redux/store'
import { connect } from 'react-redux'


interface Column {
  id: 'name' | 'leader.username'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Team', minWidth: 200 },
  { id: 'leader.username', label: 'Leader', minWidth: 200 },
]

interface TeamManageProps { }

interface StateToProps {
  teams: Team[]
}

type CombinedTeamManageProps = TeamManageProps & StateToProps

interface TeamManageState {
  selectedTeams: string[]
  allUsers: string[]
  isAddingTeam: boolean
  newTeamName: string
  newTeamLeader: string
  isPopupOpen: boolean
}

class TeamManage extends React.Component<CombinedTeamManageProps, TeamManageState> {
  private teamTable: HTMLDivElement | null
  
  constructor(props: CombinedTeamManageProps) {
    super(props)
    this.teamTable = null

    this.state = {
      selectedTeams: [],
      allUsers: [],
      isAddingTeam: false,

      newTeamName: '',
      newTeamLeader: '',

      isPopupOpen: false
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for event handling
  //
  //////////////////////////////////////////////////////////////////////////////
  handleSelectAllClick = () => {
    if (this.props.teams.length !== this.state.selectedTeams.length) {
      this.setState({selectedTeams: this.props.teams.map(team => team.name)})
    } else {
      this.setState({selectedTeams: []})
    }
  }

  handleSelectCheck = (teamName: string) => {
    if (this.state.selectedTeams.includes(teamName)) {
      this.setState({
        selectedTeams: this.state.selectedTeams.filter(team => team !== teamName)
      })
    } else {
      this.setState({
        selectedTeams: [...this.state.selectedTeams, teamName]
      })
    }
  }

  handleAddTeam = async () => {
    this.setState({isAddingTeam: !this.state.isAddingTeam}, () => {
      this.teamTable?.scrollTo({ top: this.teamTable?.scrollHeight, behavior: 'smooth' })
    })

    try {
      const res = await UserService.getAllUsers()
      const users = res.data.map((user: any) => user.username)

      this.setState({ allUsers: users })
    } catch (err) {
      console.log('failed to get users') 
    }
  }

  handleConfirmAddTeam = async () => {
    try {
      await TeamService.createTeam(
        this.state.newTeamName,
        this.state.newTeamLeader
      )
    } catch (err: any) {
      if (err.response.status === 403) {
        alert(err.response.data.error)
      } else {
        alert(`failed to add team`)
      }
    } finally {
      window.location.reload()
    }
  }

  handleCloseConfirmPopup = () => {
    this.setState({isPopupOpen: false}) 
  }

  handleConfirmDeleteTeam = async () => {
    for (let i = 0; i < this.state.selectedTeams.length; i++) {
      try {
        await TeamService.deleteTeam(this.state.selectedTeams[i])
      } catch (err: any) {
        if (err.response.status === 403) {
          alert(err.response.data.error)
        } else {
          alert(`failed to delete team ${this.state.selectedTeams[i]}`)
        }
      }
    }

    this.setState({isPopupOpen: false}) 
    window.location.reload()
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for rendering page contents
  //
  //////////////////////////////////////////////////////////////////////////////
  buildTableHead = () => {
    return (
      <TableHead>
        <TableRow className="team-manage-table-toolbar">
          <TableCell colSpan={3} className="team-manage-table-toolbar-cell">
            <div className="team-manage-table-toolbar-content">
              <div className="team-manage-table-title">
                All Teams in AMS
              </div>
              <IconButton
                disabled={this.state.selectedTeams.length === 0}
                onClick={() => this.setState({isPopupOpen: true})}
                sx={{ color: "black" }}
              >
                <DeleteIcon sx={{ fontSize: 30 }} />
              </IconButton>
              <IconButton sx={{ color: "black" }} onClick={this.handleAddTeam}>
                <AddIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="team-manage-table-head">
          <TableCell padding="checkbox" className="team-manage-table-cell" sx={{top: 79}}>
            <Checkbox
              color="primary"
              indeterminate={this.state.selectedTeams.length > 0 && this.state.selectedTeams.length !== this.props.teams.length}
              checked={this.props.teams.length > 0 && this.state.selectedTeams.length === this.props.teams.length}
              onChange={this.handleSelectAllClick}  
            />
          </TableCell>
          {columns.map(column => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth, top: 79 }}
              className="team-manage-table-cell"
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  buildTableBody = () => {
    return (
      <TableBody className="team-manage-table-body">
        {this.props.teams.map((row: Team, idx: number) => {
          const team = {...row, leader: row.leader}
          return this.buildTableRow(team, idx)
        })}
        {this.state.isAddingTeam ? 
          <TableRow>
            <TableCell padding="checkbox">
              <IconButton
                onClick={this.handleConfirmAddTeam}
                disabled={this.state.newTeamLeader === '' || this.state.newTeamName === ''}
              >
                <CheckIcon></CheckIcon>
              </IconButton>
            </TableCell>
            <TableCell>
              <TextField
                label="team name"
                variant="standard"
                onChange={(e) => {this.setState({newTeamName: e.target.value})}}
              />
            </TableCell>
            <TableCell>
            <Autocomplete
              disableClearable
              options={this.state.allUsers}
              getOptionLabel={(opt: string) => opt}
              onChange={(e, v) => {this.setState({newTeamLeader: v})}}
              renderInput={(params) => (
                <TextField {...params} label="select leader" variant="standard" />
              )}
            />
            </TableCell>
          </TableRow> : null
        }
      </TableBody>
    )
  }

  buildTableRow = (row: Team, idx: number) => {
    return (
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.name}
        className="team-manage-table-body-row"
      >
        <TableCell padding="checkbox" className="team-manage-table-body-cell">
          <Checkbox
            checked={this.state.selectedTeams.includes(row.name)}
            onChange={() => this.handleSelectCheck(row.name)}
          />
        </TableCell>

        {columns.map((col: Column) => {
          return (
            <TableCell
              key={col.id}
              align={col.align}
              className="team-manage-table-body-cell"
            >
              {_.get(row, col.id)}
            </TableCell>
          ) 
        })}
      </TableRow>
    )
  }

  render() {
    return (
      <div className="team-manage-wrapper">
        <div className="table-area" ref={el => {this.teamTable = el}}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className="team-manage-table"
          >
            {this.buildTableHead()}
            {this.buildTableBody()}
          </Table>
        </div>

        <Dialog
          open={this.state.isPopupOpen}
          onClose={this.handleCloseConfirmPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to delete selected team(s)?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={this.handleCloseConfirmPopup}>Cancel</Button>
            <Button variant="contained" color="success" onClick={this.handleConfirmDeleteTeam} autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    teams: state.team.teams
  }
}

export default connect(mapStateToProps)(TeamManage)