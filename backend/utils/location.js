const axios = require('axios')

const HttpError = require('../models/http-error')
const API_KEY = process.env.GOOGLE_GEOCODE_APIKEY

/**
 * Call Google API to get geolocation and standardize address format
 * @param {String} address
 * @returns {Array} Coordinates, Address
 */
async function getCoordsForAddress(address) {
  let coordinates

  //Return default coordinates and original address if key invalid
  if (!API_KEY || API_KEY === undefined) {
    coordinates = { lat: 40.7484405, lng: -73.9878584 }
    return [coordinates, address]
  }

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )

  const data = response.data

  //Return default coordinates and original address if no results found
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for entered address',
      422
    )
    throw error
  }

  //Return default coordinates and original address request denied by API
  if (!data || data.status === 'REQUEST_DENIED') {
    coordinates = { lat: 40.7484405, lng: -73.9878584 }
    return [coordinates, address]
  }

  coordinates = data.results[0].geometry.location
  const formattedAddress = data.results[0].formatted_address

  return [coordinates, formattedAddress]
}

module.exports = {
  getCoordsForAddress,
}
