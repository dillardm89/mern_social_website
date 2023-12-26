const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

async function getAllUsers(req, res, next) {
  let allUsers
  try {
    allUsers = await User.find({}, '-password')
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again', 500)
    return next(error)
  }

  res
    .status(201)
    .json({ users: allUsers.map((user) => user.toObject({ getters: true })) })
}

async function signupUser(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Could not find user.', 500)
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError(
      'Email exists already, please enter a different email or login instead.',
      422
    )
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password,
    imageUrl: req.file.path,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('User signup failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

async function loginUser(req, res, next) {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Could not find user.', 500)
    return next(error)
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    )
    return next(error)
  }

  res.json({
    message: 'Logged In',
    user: existingUser.toObject({ getters: true }),
  })
}

module.exports = {
  getAllUsers,
  signupUser,
  loginUser,
}
