import React, { useState, useContext } from 'react'
import Card from '../../shared/components/ui-elements/Card'
import Button from '../../shared/components/form-elements/Button'
import Modal from '../../shared/components/ui-elements/Modal'
import Map from '../../shared/components/ui-elements/Map'
import ErrorModal from '../../shared/components/ui-elements/ErrorModal'
import LoadingSpinner from '../../shared/components/ui-elements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import '../styles/PlaceItem.css'

/**
 * Component for showing details of specific place
 * Props passed down from PlaceList.js
 * @param {Object} props
 * @param {String} props.id string of place ID
 * @param {String} props.title string of place title
 * @param {String} props.address string of place address
 * @param {String} props.image string uri of the place image
 * @param {String} props.description string of place description
 * @param {String} props.creatorId string of place creator's ID
 * @param {Object} props.coordinates object containing place geolocation (lat, lng)
 * @param {() => void} props.onDelete callback to function for deleting place (UserPlaces.js)
 * @returns {React.JSX.Element} PlaceItem Element
 */
function PlaceItem(props) {
  const auth = useContext(AuthContext)
  const API_URL = process.env.REACT_APP_API_URL
  const { isLoading, isError, sendRequest, clearError } = useHttpClient()
  const [showMap, setShowMap] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const openMapHandler = () => setShowMap(true)

  const closeMapHandler = () => setShowMap(false)

  const showDeleteWarningHandler = () => setShowDeleteModal(true)

  const cancelDeleteWarningHandler = () => setShowDeleteModal(false)

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false)

    try {
      await sendRequest(`${API_URL}/api/places/${props.id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token,
      })

      props.onDelete(props.id)
    } catch (err) {
      //console.log(err.message)
    }
  }

  return (
    <>
      <ErrorModal error={isError} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteWarningHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button inverse onClick={cancelDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note this action
          can't be undone.
        </p>
      </Modal>

      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}

          <div className='place-item__image'>
            <img src={`${API_URL}/${props.image}`} alt={props.title} />
          </div>

          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>

          <div className='place-item__align-bottom'>
            <div className='place-item__actions'>
              <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
              </Button>

              {auth.userId === props.creatorId && (
                <Button to={`/places/${props.id}`}>EDIT</Button>
              )}

              {auth.userId === props.creatorId && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}
            </div>
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
