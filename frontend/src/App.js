import React, { useState, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import MainNavigation from './shared/components/navigation/MainNavigation'
import Users from './user/pages/Users'
import UserPlaces from './places/pages/UserPlaces'
import NewPlace from './places/pages/NewPlace'
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from './user/pages/Auth'
import { AuthContext } from './shared/context/auth-context'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = useCallback((uid) => {
    setIsLoggedIn(true)
    setUserId(uid)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserId(null)
  }, [])

  let routes

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:uid/places' element={<UserPlaces />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/places/:pid' element={<UpdatePlace />} />
        <Route path='/*' element={<Navigate replace to='/' />} />
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:uid/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/*' element={<Navigate replace to='/auth' />} />
      </Routes>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
