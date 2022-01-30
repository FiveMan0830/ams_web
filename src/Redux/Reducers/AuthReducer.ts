import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../Services/UserService'


export interface AuthReducerState {
  loginUser: User | null
}

/**
 *  * To trigger the reducer function,
 *  * dispatch type '{name}/${reducer_function}'
 * 
 *  * e.g.
 *  * dispatch with type 'auth/login' with trigger the reducer 'login()'
 *  * dispatch with type 'auth/logout' will trigger the reducer 'logout()'
 *  
 *  * with parameter:
 *  * dispatch({ type: 'auth/login', payload: { accessToken: 'xxx' }})
 * */ 
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loginUser: {} as User | null
  },
  reducers: {
    login: (state, action) => { },
    logout: (state) => {
      localStorage.removeItem('access_token')
      state.loginUser = null
    },
    setUser: (state, action) => {
      state.loginUser = action.payload.user
    }
  }
})

export default authSlice.reducer