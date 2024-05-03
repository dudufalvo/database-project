import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute = () => {
  // If there is no token, redirect to /sign-in
  // Otherwise on any other route, the Outlet will trigger the context and if there is a invalid token, it will redirect to /sign-in
  return (
    localStorage.getItem('token') ?
      <Outlet /> :
      <Navigate to="/sign-in" />
  )
}

export const NotAuthenticatedRoute = () => {
  // If there is token or id redirect to `/` otherwise redirect to `/sign-in`
  return (
    localStorage.getItem('token') ?
      <Navigate to="/" /> :
      <Outlet />
  )
}
