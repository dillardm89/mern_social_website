const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY

/**
 * Validate token for accessing protected routes/features
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Boolean}
 */
function checkValidToken(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1] //Authorization: 'Bearer TOKEN'

    if (!token) {
      throw new Error('Authentication failed.')
    }

    const decodedToken = jwt.verify(token, PRIVATE_KEY)
    req.userData = { userId: decodedToken.userId }
    next()
  } catch (err) {
    const error = new HttpError('Authentication failed.', 403)
    return next(error)
  }
}

module.exports = { checkValidToken }
