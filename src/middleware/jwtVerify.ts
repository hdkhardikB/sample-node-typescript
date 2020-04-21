import { Response, NextFunction } from 'express'
import { wrap, error } from '../utils'
import { User } from '../models'
import { CustomRequest } from '../interfaces'

const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'test'

export const jwtVerify = wrap(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token']
  if (!token) {
    throw error(401, 'Unauthorized')
  }

  let userDetails: any = {}
  // verify the token
  try {
    userDetails = await jwt.verify(token, jwtSecret)
  } catch (e) {
    throw error(401, 'Invalid Token')
  }

  const hasExpired = userDetails.exp ? new Date(userDetails.exp) >= new Date() : false

  if (hasExpired) {
    throw error(401, 'Token Expired')
  }

  if (userDetails.uid) {
    let foundUsers: any = []
    try {
      const result = await new User().query({ where: { uid: userDetails.uid, token } }).fetchAll()
      foundUsers = result.toJSON()
    } catch (e) {
      throw error(401, 'Unauthorized')
    }

    if (!foundUsers.length) {
      throw error(401, 'Unauthorized')
    }

    if (!foundUsers[0].is_verified) {
      throw error(423, 'Account needs to be verified')
    }
    req.user = foundUsers[0]
  }

  next()
})
