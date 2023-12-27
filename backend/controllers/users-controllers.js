const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const User = require('../models/user')
const PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY

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

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    //console.log(err)
    const error = new HttpError('Could not create user, please try again.', 500)
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    imageUrl: req.file.path,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('User signup failed, please try again.', 500)
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      PRIVATE_KEY,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('User signup failed, please try again.', 500)
    return next(error)
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token })
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

  if (!existingUser) {
    const error = new HttpError(
      'No user found for entered email, please try again or sign up instead.',
      403
    )
    return next(error)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    //console.log(err)
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    )
    return next(error)
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid email/password combination, please check your credentials and try again.',
      500
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      PRIVATE_KEY,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Could not log you in, please try again.', 500)
    return next(error)
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  })
}

module.exports = {
  getAllUsers,
  signupUser,
  loginUser,
}
