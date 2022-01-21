import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import './MemberManage.scss'
import { RootState } from '../Redux/store'
import { connect } from 'react-redux';
import { Team } from '../Redux/Reducers/TeamReducer';

interface MemberManageProps {}

interface StateToProps {
  teams: Team[]
}

type CombinedMemberManageProps = MemberManageProps & StateToProps

interface MemeberManageStates {
  selectedTeam: Team | null
}

class MemberManage extends React.Component<CombinedMemberManageProps, MemeberManageStates> {
  constructor(props: CombinedMemberManageProps) {
    super(props)

    this.state = {
      selectedTeam: null
    }
  }

  handleSelectTeam = (team: Team) => {
    this.setState({selectedTeam: team})

    console.log('hello')
  }

  render() {
    return (
      <div className="member-manage-wrapper">
        <div className="control-area">
          <div className="team-selection-area">
            <span className="title">Team:</span>   
            <Autocomplete
              disableClearable
              className="team-select"
              defaultValue={this.props.teams[0]}
              options={this.props.teams}
              getOptionLabel={(opt: Team) => opt.name}
              onChange={(_, value: Team) => this.handleSelectTeam(value)}
              renderInput={(params) => (
                <TextField {...params} label="select team" variant="standard" />
              )}
            />
          </div> 
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    teams: state.team.teams
  }
}

export default connect(mapStateToProps)(MemberManage)