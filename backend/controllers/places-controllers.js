const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const { getCoordsForAddress } = require('../utils/location')

let DUMMY_PLACES = [
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
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://media.timeout.com/images/101705309/1024/576/image.webp',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
]

function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId
  })

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place(s) for the provided user ID.', 404)
    )
  }

  res.json({ places })
}

function getPlaceById(req, res, next) {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId
  })

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided ID.', 404)
    )
  }
  res.json({ place })
}

async function createPlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address, creator } = req.body

  let coordinates
  let updatedAddress
  try {
    const results = await getCoordsForAddress(address)
    coordinates = results[0]
    updatedAddress = results[1]
  } catch (error) {
    return next(error)
  }

  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    address: updatedAddress,
    location: coordinates,
    creator,
  }

  DUMMY_PLACES.push(createdPlace)

  res.status(201).json({ place: createdPlace })
}

function updatePlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)

  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

function deletePlace(req, res, next) {
  const placeId = req.params.pid

  if (!DUMMY_PLACES.find((p) => p.id !== placeId)) {
    return next(new HttpError('Could not find a place for that ID', 404))
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)

  res.status(200).json({ message: 'Deleted place.' })
}

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
}
