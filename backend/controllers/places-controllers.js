const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const fs = require('fs')

const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')
const { getCoordsForAddress } = require('../utils/location')

/**
 * Retrieves all places from db then maps for frontend rendering
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} allPlaces
 */
async function getAllPlaces(req, res, next) {
  let allPlaces
  try {
    allPlaces = await Place.find()
  } catch (err) {
    const error = new HttpError('Fetching places failed, please try again', 500)
    return next(error)
  }

  res.status(201).json({
    places: allPlaces.map((place) => place.toObject({ getters: true })),
  })
}

/**
 * Retrieves all places for specific user from db then maps for frontend rendering
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} userPlaces
 */
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

/**
 * Retrieves specific place by ID from db for frontend rendering
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} specificPlace
 */
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

/**
 * Create new place and store in db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} createdPlace
 */
async function createPlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address } = req.body

  //Calls to location.js function for Google API
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
    creator: req.userData.userId,
  })

  //Verify valid user logged in
  let validUser
  try {
    validUser = await User.findById(req.userData.userId)
  } catch (err) {
    const error = new HttpError('Could not find a user.', 500)
    return next(error)
  }

  if (!validUser) {
    const error = new HttpError('Could not find user for provided ID.', 404)
    return next(error)
  }

  //Start session/transaction to create place and link to user "places" array in db
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

/**
 * Update existing place from db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} updatedPlace
 */
async function updatePlace(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address } = req.body
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

  //Verify logged in user matches place creator
  if (updatedPlace.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not authorized to edit this place.',
      401
    )
    return next(error)
  }

  //Calls to location.js function for Google API
  let coordinates
  let updatedAddress
  try {
    const results = await getCoordsForAddress(address)
    coordinates = results[0]
    updatedAddress = results[1]
  } catch (error) {
    return next(error)
  }

  updatedPlace.title = title
  updatedPlace.description = description
  updatedPlace.address = updatedAddress
  updatedPlace.location = coordinates

  try {
    await updatedPlace.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    )
    return next(error)
  }

  res.status(201).json({ place: updatedPlace.toObject({ getters: true }) })
}

/**
 * Deletes place form db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {null}
 */
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

  if (!deletedPlace) {
    const error = new HttpError('Could not find place for this ID.', 404)
    return next(error)
  }

  //Verify logged in user matches place creator
  if (deletedPlace.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not authorized to delete this place.',
      401
    )
    return next(error)
  }

  const imagePath = deletedPlace.imageUrl

  //Start session/transaction to delete place and unlink from user "places" array in db
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

  res.status(201).json({ message: 'Deleted place.' })
}

module.exports = {
  getAllPlaces,
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
}
