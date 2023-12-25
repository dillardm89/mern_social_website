import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'

function Users() {
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users'
        )

        setLoadedUsers(responseData.users)
      } catch (err) {
        //console.log(err.message)
      }
    }

    fetchUsers()
  }, [sendRequest])

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
