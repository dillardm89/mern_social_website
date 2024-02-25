import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import PlaceList from '../components/PlaceList'

/**
 * Page for rendering all places
 * @returns {Array} items containing place objects passed as props to PlaceList.js
 * @returns {React.JSX.Element} AllPlaces Element
 */
function AllPlaces() {
  const API_URL = process.env.REACT_APP_API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState(null)

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const responseData = await sendRequest(`${API_URL}/api/places/`)
        console.log(responseData)
        setLoadedPlaces(responseData.places)
      } catch (err) {
        //console.log(err.message)
      }
    }

    fetchAllPlaces()
  }, [sendRequest, API_URL])

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

export default AllPlaces
