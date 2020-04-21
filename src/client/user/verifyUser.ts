import { error } from '../../utils'
import { User, Notification } from '../../models'

const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')

const verifyUser = async (token: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'test'
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

  if (!userDetails.uid) {
    throw error(401, 'Invalid Token')
  }

  let foundUsers: any = []
  try {
    const result = await new User().query({ where: { uid: userDetails.uid, token } }).fetchAll()
    foundUsers = result.toJSON()
  } catch (e) {
    throw error(401, 'Invalid Token')
  }

  if (!foundUsers.length) {
    throw error(401, 'Invalid Token')
  }

  if (foundUsers[0].is_verified) {
    throw error(400, 'Account is already verified')
  }

  // check if notification exists
  let notifications: any = []
  try {
    const result = await new Notification().where({ user_uid: userDetails.uid }).fetchAll()
    notifications = result.toJSON()
  } catch (e) {
    console.log(e)
    throw error(500, 'Database Error')
  }

  // Insert default notifications for the user
  // TODO: remove the notifications if the user is deleted
  if (!notifications.length) {
    try {
      const notification = new Notification({ uid: uuid(), user_uid: userDetails.uid })
      const result = await notification.save()
    } catch (e) {
      console.log(e)
      throw error(500, 'Database Error')
    }
  }

  try {
    const result = await new User().where({ uid: userDetails.uid }).save({ is_verified: true }, { patch: true })
    return { message: 'verification succeeded' }
  } catch (e) {
    console.log(e)
    throw error(500, 'Database Error')
  }
}

export default verifyUser
