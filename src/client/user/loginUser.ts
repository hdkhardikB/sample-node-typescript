import { User } from '../../models'
import { error } from '../../utils'
import { scheduler } from '../scheduler'
import * as _ from 'lodash'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginUser = async (data: any) => {
  let { email, password, code } = data
  email = email.trim().toLowerCase()
  const jwtSecret = process.env.JWT_SECRET || 'test'
  const saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10

  if (code && password) {
    throw error(400, 'Either password or code')
  }

  let existingUsers: any = []
  // check if the user exists
  try {
    const result = await new User().query({ where: { email } }).fetchAll({
      withRelated: [{
        image: function (qb) {
          return qb.orderBy('users_image.created_at', 'desc')
        }
      }]
    })
    existingUsers = result.toJSON()
  } catch (e) {
    throw error(500, 'Database Error')
  }

  // unauthorized
  if (!existingUsers.length) {
    throw error(401, 'User not found')
  }

  const uid = existingUsers[0] ? existingUsers[0].uid : false

  if (!uid) {
    throw error(500, 'Internal Error')
  }

  if (!existingUsers[0].is_verified) {
    throw error(423, 'Account needs to be verified')
  }

  if (password) {
    const match = await bcrypt.compare(password, existingUsers[0].password)

    if (!match) {
      throw error(401, 'Unauthorized')
    }

    let previewURL = ''
    let previewCode = ''

    const randomCode = Math.floor(100000 + Math.random() * 900000)

    await scheduler.now('verification:code', { email, code: randomCode, name: existingUsers[0].name, language: existingUsers[0].language })

    const salt = await bcrypt.genSalt(saltRounds)
    const hashedCode = await bcrypt.hash(`${randomCode}`, salt)
    previewCode = process.env.NODE_ENV === 'development' ? randomCode.toString() : ''

    try {
      const result = await new User().where({ email }).save({ two_factor: hashedCode }, { patch: true })
      return { message: 'Code sent', previewURL, previewCode }
    } catch (e) {
      throw error(500, 'Database Error')
    }
  }

  if (!code) {
    throw error(400, 'Code required')
  }

  const codeMatch = await bcrypt.compare(`${code}`, existingUsers[0].two_factor)

  if (!codeMatch) {
    throw error(400, 'Invalid code')
  }

  const token = jwt.sign({ uid }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES || '1h' })

  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedCode = await bcrypt.hash(jwtSecret, salt)
    const result = await new User().where({ email }).save({ token, two_factor: hashedCode }, { patch: true })
    if (existingUsers[0].image) {
      const keys = Object.keys(existingUsers[0].image)
      const item: any = {}
      _.each(keys, key => {
        const sendKey = _.camelCase(key)
        item[sendKey] = existingUsers[0].image[key]
      })
      existingUsers[0].image = item
    }
    const user = {
      email: existingUsers[0].email,
      kvkNumber: existingUsers[0].kvk_number,
      name: existingUsers[0].name,
      uid,
      vatNumber: existingUsers[0].vat_number,
      image: existingUsers[0].image
    }
    // TODO: #test
    // scheduler.now('charge:user', { uid: uid, amount: 2.35 })
    console.log(user)
    return { token, user }
  } catch (e) {
    throw error(500, 'Database Error')
  }
}
export default loginUser
