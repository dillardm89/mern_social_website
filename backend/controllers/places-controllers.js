const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const fs = require('fs')

const HttpError = require('../models/http-error')
const { getCoordsForAddress } = require('../utils/location')
const Place = require('../models/place')
const User = require('../models/user')

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid

  let userPlaces
  try {
    userPlaces = await User.findById(userId).populate('places')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    )
    return next(error)
  }

  if (!userPlaces || userPlaces.places.length === 0) {
    const error = new HttpError(
      'Could not find a place(s) for the provided user ID.',
      404
    )
    return next(error)
  }

  res.json({
    places: userPlaces.places.map((place) => place.toObject({ getters: true })),
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
    //console.log(errors)
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
    imageUrl: req.file.path,
    creator,
  })

  let validUser
  try {
    validUser = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('Could not find a user.', 500)
    return next(error)
  }

  if (!validUser) {
    const error = new HttpError('Could not find user for provided ID.', 404)
    return next(error)
  }

  try {
    const newSession = await mongoose.startSession()
    newSession.startTransaction()

    await createdPlace.save({ session: newSession })

    validUser.places.push(createdPlace)
    await validUser.save({ session: newSession })

    await newSession.commitTransaction()
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) })
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
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
    deletedPlace = await Place.findById(placeId).populate('creator')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  if (!deletePlace) {
    const error = new HttpError('Could not find place for this ID.', 404)
    return next(error)
  }

  const imagePath = deletedPlace.image

  try {
    const newSession = await mongoose.startSession()
    newSession.startTransaction()

    await deletedPlace.deleteOne({ session: newSession })
    deletedPlace.creator.places.pull(deletedPlace)
    await deletedPlace.creator.save({ session: newSession })

    await newSession.commitTransaction()
  } catch (err) {
    //console.log(err)
    const error = new HttpError('Something went wrong, could not delete place.')
    return next(error)
  }

  fs.unlink(imagePath, (err) => {
    //console.log(err)
  })

  res.status(200).json({ message: 'Deleted place.' })
}

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
}
