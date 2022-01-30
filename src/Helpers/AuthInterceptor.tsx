// import { useSelector } from 'react-redux'
// import { AuthReducerState } from '../Redux/Reducers/AuthReducer'
// import { RootState } from '../Redux/store'

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { parseJWT } from '../Utils/JWTParser'

function AuthInterceptor() {
  // const auth = useSelector<RootState, AuthReducerState>((state) => state.auth)
  const location = useLocation()
  const query = new URLSearchParams(decodeURIComponent(window.location.search))
  const accessToken =
    query.get('access_token') || localStorage.getItem('access_token')

  // check if access token exist
  if (!accessToken || !parseJWT(accessToken)) {
    return <Navigate to="/login" state={{from: location}}/>
  }

  localStorage.setItem('access_token', accessToken)
  return <Outlet />
}

export default AuthInterceptor