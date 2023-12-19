const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Marianne Dillard',
    imageUrl:
      'https://mariannedillard.com/wp-content/uploads/2023/07/IMG_0141-2small.jpg',
    email: 'test@test.com',
    password: 'password1234',
  },
]

function getAllUsers(req, res, next) {
  res.status(201).json(DUMMY_USERS)
}

function signupUser(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find((u) => u.email == email)

  if (hasUser) {
    return next(
      new HttpError('Could not create user, email already exists.', 422)
    )
  }

  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  }

  DUMMY_USERS.push(createdUser)

  res.status(201).json({ user: createdUser })
}

function loginUser(req, res, next) {
  const { email, password } = req.body

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email)

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong.',
        401
      )
    )
  }

  res.json({ message: 'Logged In' })
}

module.exports = {
  getAllUsers,
  signupUser,
  loginUser,
}
