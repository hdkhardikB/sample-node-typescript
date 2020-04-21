
import { error } from '../../utils'
import { User } from '../../models'
import { scheduler } from '../scheduler'

const bcrypt = require('bcrypt')
const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')

const createUser = async (user: any) => {
  const {
    name,
    email,
    vatNumber,
    kvkNumber,
    password,
    company = false
  } = user

  // * get environment variables
  const saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10
  const jwtSecret = process.env.JWT_SECRET || 'test'

  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  const uid = uuid()

  // * create a user object
  const userData: any = {
    name,
    email,
    
    password: hashedPassword,
    token: jwt.sign({ uid }, jwtSecret)
  }

  // * add company data if the user is a company
  if (company) {
    userData.vat_number = vatNumber
    userData.kvk_number = kvkNumber
  }

  let existingUsers: any = []
  userData.email = userData.email.trim().toLowerCase()
  // * check if the user exists
  try {
    const result = await new User().query({ where: { email: userData.email } }).fetchAll()
    existingUsers = result.toJSON()
  } catch (e) {
    throw error(500, 'Database Error')
  }

  if (existingUsers.length > 0) {
    throw error(400, 'User Exists')
  }

  let previewURL = ''
  let previewToken = process.env.NODE_ENV === 'development' ? userData.token : ''

  await scheduler.now('verification:link', { email: userData.email, token: userData.token, name: userData.name, language: userData.language })

  try {
    // * add token to the user
    const result = await new User(userData).save()
    return { message: 'User created', previewURL, previewToken }
  } catch (e) {
    console.log(e)
    throw error(500, 'Database Error')
  }
}

export default createUser
