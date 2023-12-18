import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import MainNavigation from './shared/components/navigation/MainNavigation'
import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'

function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Routes>
          <Route exact path='/' element={<Users />} />
          <Route path='/places/new' element={<NewPlace />} />
          <Route path='/*' element={<Navigate replace to='/' />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
