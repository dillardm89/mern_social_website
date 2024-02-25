import React from 'react'
import Card from '../../shared/components/ui-elements/Card'
import PlaceItem from './PlaceItem'
import Button from '../../shared/components/form-elements/Button'
import '../styles/PlaceList.css'

/**
 * Component for rendering a list of place items
 * Props passed down from AllPlaces.js or UserPlaces.js
 * @param {Object} props
 * @param {Array} props.items array of objects contain place data
 * @param {() => void} props.onDeletePlace callback function for deleting place (UserPlaces.js)
 * @callback onDelete function passed as prop to PlaceItem.js
 * @returns {Object} place containing data passed as props to PlaceItem.js
 * @returns {React.JSX.Element} PlaceList Element
 */
function PlaceList(props) {
  if (props.items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to='/places/new'>Share Place</Button>
        </Card>
      </div>
    )
  }

  return (
    <ul className='place-list'>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  )
}

export default PlaceList
