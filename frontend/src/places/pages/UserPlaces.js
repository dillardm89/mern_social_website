import React from 'react'
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
  return <PlaceList items={DUMMY_PLACES} />
}

export default UserPlaces
