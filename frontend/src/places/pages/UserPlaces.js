import React from 'react'
import { useParams } from 'react-router-dom'
import PlaceList from '../components/PlaceList'

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://media.timeout.com/images/101705309/1024/576/image.webp',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
]

function UserPlaces(props) {
  const userId = useParams().uid
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId)

  return <PlaceList items={loadedPlaces} />
}

export default UserPlaces
