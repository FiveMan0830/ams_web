import { useSelector } from 'react-redux'
import { AuthReducerState } from '../Redux/Reducers/AuthReducer'
import { RootState } from '../Redux/store'

import { Navigate, Outlet, useLocation } from 'react-router-dom'

function AuthInterceptor() {
  const auth = useSelector<RootState, AuthReducerState>((state) => state.auth)
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{from: location}}/>
  }

  return <Outlet />
}

export default AuthInterceptor