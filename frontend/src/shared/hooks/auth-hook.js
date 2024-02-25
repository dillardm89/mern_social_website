import { useState, useCallback, useEffect } from 'react'

let logoutTimer

/**
 * Hook function for user authentication (log in, log out, and tokenization)
 * @returns {String} token
 * @returns {String} isLoggedIn
 * @returns {() => void} login callback to method
 * @returns {() => void}  logout callback to method
 */
export function useAuth() {
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState(null)
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null)

  /**
   * Auth method for user login and tokenization
   * @method login
   * @param {String} uid string of user ID
   * @param {String} token
   * @param {Date} expirationDate expiration date of token based on user log in date
   *        either set previously (user reload page) or set initially upon first log in
   */
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)

    const tokenExpiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)

    setTokenExpirationDate(tokenExpiration)

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpiration.toISOString(),
      })
    )
  }, [])

  /**
   * Auth method for user log out and reset token
   * @method logout
   */
  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTokenTime =
        tokenExpirationDate.getTime() - new Date().getTime()

      logoutTimer = setTimeout(logout, remainingTokenTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      )
    }
  }, [login])

  return { userId, token, login, logout }
}
