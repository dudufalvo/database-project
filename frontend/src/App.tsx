import { BrowserRouter, Route, Routes } from 'react-router-dom'

import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import Home from 'pages/Home'
import { PrivateRoute, NotAuthenticatedRoute } from 'utils/routes'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/' element={<Home />} />
      {/*   <Route element={<NotAuthenticatedRoute />} >
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/' element={<Home />} />
        </Route>
        <Route element={<PrivateRoute />} >
          
        </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
