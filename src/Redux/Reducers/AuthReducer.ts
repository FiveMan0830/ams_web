import { createSlice } from '@reduxjs/toolkit'

export interface AuthReducerState {
  user: string | null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('access_token')
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.accessToken
    },
    logout: (state) => {
      localStorage.removeItem('access_token')
      state.user = null
    }
  }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer