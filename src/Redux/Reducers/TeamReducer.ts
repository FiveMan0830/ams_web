import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import TeamService from '../../Services/TeamService'

export interface Team {
  name: string
  leader: string
  members: {name: string}
}

export interface TeamReducerState {
  teams: Team[]
}

export const fetchAllTeams = createAsyncThunk('team/fetchAllTeams', async () => {
  const allTeamsRes = await TeamService.getAllTeams()
  return allTeamsRes.data
})

export const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teams: [] as Team[]
  },
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchAllTeams.fulfilled, (state, action) => {
      state.teams = action.payload
    })
  }
})

export default teamSlice.reducer