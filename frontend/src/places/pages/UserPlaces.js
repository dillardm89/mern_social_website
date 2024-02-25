import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

/**
 * Page for rendering all places for specific user
 * @callback onDeletePlace function passed as prop to PlaceList.js
 * @returns {Array} items containing place objects passed as props to PlaceList.js
 * @returns {React.JSX.Element} UserPlaces Element
 */
function UserPlaces() {
  const userId = useParams().uid
  const API_URL = process.env.REACT_APP_API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState(null)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${API_URL}/api/places/user/${userId}`
        )

        setLoadedPlaces(responseData.places)
      } catch (err) {
        //console.log(err.message)
      }
    }
    fetchPlaces()
  }, [sendRequest, userId, API_URL])

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    )
  }

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  )
}

export default UserPlaces
