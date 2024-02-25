import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'

/**
 * Page for rendering all users
 * @returns {Array} items containing user objects passed as props to UsersList.js
 * @returns {React.JSX.Element} Users Element
 */
function Users() {
  const API_URL = process.env.REACT_APP_API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${API_URL}/api/users`)

        setLoadedUsers(responseData.users)
      } catch (err) {
        //console.log(err.message)
      }
    }

    fetchUsers()
  }, [sendRequest, API_URL])

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  )
}

export default Users
