const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const { getCoordsForAddress } = require('../utils/location')
const Place = require('../models/place')

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

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid

  let userPlaces
  try {
    userPlaces = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    )
    return next(error)
  }

  if (!userPlaces || userPlaces.length === 0) {
    const error = new HttpError(
      'Could not find a place(s) for the provided user ID.',
      404
    )
    return next(error)
  }

  res.json({
    places: userPlaces.map((place) => place.toObject({ getters: true })),
  })
}

async function getPlaceById(req, res, next) {
  const placeId = req.params.pid

  let specificPlace
  try {
    specificPlace = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  if (!specificPlace) {
    const error = new HttpError(
      'Could not find a place for the provided ID.',
      404
    )
    return next(error)
  }

  res.json({ place: specificPlace.toObject({ getters: true }) })
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

  const createdPlace = new Place({
    title,
    description,
    address: updatedAddress,
    location: coordinates,
    imageUrl: 'https://media.timeout.com/images/101705309/1024/576/image.webp',
    creator,
  })

  try {
    await createdPlace.save()
    //console.log(`Place created successfully: ${createdPlace._id}`)
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ place: createdPlace })
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  let updatedPlace
  try {
    updatedPlace = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  updatedPlace.title = title
  updatedPlace.description = description

  try {
    await updatedPlace.save()
    //console.log(`Place updated successfully: ${updatedPlace.title}`)
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place.')
    return next(error)
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) })
}

async function deletePlace(req, res, next) {
  const placeId = req.params.pid

  let deletedPlace
  try {
    deletedPlace = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  try {
    await deletedPlace.deleteOne()
    //console.log('Place removed successfully')
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete place.')
    return next(error)
  }

  res.status(200).json({ message: 'Deleted place.' })
}

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
}
