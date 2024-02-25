import { createContext } from 'react'

/**
 * Create authorization context
 * @callback login global function for user login (defined in auth-hook.js)
 * @callback logout global function for user logout (defined in auth-hook.js)
 * @returns {Boolean} isLoggedIn
 * @returns {String} userId
 * @returns {String} token
 */
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
})
