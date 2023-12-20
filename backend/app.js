const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')

const port = process.env.HOST_PORT
const database = 'places'
const mongoConnectString = `mongodb://localhost:27017/${database}`

const app = express()
app.use(bodyParser.json())

app.use('/api/places', placesRoutes)

app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occurred.' })
})

mongoose
  .connect(mongoConnectString)
  .then(() => {
    app.listen(port, () => {
      console.log(`App started on port: ${port}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })
