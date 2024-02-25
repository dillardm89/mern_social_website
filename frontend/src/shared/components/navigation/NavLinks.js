import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import Button from '../form-elements/Button'
import './styles/NavLinks.css'

/**
 * Component for rendering navigation links element
 * Props passed down from MainNavigation.js
 * @returns {React.JSX.Element} NavLinks Element
 */
function NavLinks() {
  const auth = useContext(AuthContext)

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/'>ALL USERS</NavLink>
      </li>
      <li>
        <NavLink to='/all-places'>ALL PLACES</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to='/places/new'>ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth'>LOGIN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Button inverse onClick={auth.logout}>
            LOGOUT
          </Button>
        </li>
      )}
    </ul>
  )
}

export default NavLinks
