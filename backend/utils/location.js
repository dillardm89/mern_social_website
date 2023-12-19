const axios = require('axios')

const HttpError = require('../models/http-error')
const API_KEY = process.env.GOOGLE_GEOCODE_APIKEY

async function getCoordsForAddress(address) {
  let coordinates

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

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for entered address',
      422
    )
    throw error
  }

  if (!data || data.status === 'REQUEST_DENIED') {
    console.log(data.error_message)
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
