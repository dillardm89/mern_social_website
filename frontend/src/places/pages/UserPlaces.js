import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

function UserPlaces(props) {
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState(null)
  const userId = useParams().uid

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        )

        setLoadedPlaces(responseData.places)
      } catch (err) {
        //console.log(err.message)
      }
    }
    fetchPlaces()
  }, [sendRequest, userId])

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </>
  )
}

export default UserPlaces
