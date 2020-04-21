import db from '../db'
import { UserImage } from './UserImage'

export class User extends db.Model<User> {
  
  get tableName() {
    return 'users'
  }

  image(): UserImage {
    return this.hasOne(UserImage)
  }
}
