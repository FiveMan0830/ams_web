import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducers/AuthReducer'
import teamReducer, { fetchAllTeams } from './Reducers/TeamReducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer
  }
})

store.dispatch(fetchAllTeams())

// define state type
export type RootState = ReturnType<typeof store.getState>

// define dispatch type
export type RootDispatch = typeof store.dispatch

export default store