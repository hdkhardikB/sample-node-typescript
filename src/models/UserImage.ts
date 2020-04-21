import db from '../db'

export class UserImage extends db.Model<UserImage> {
  get tableName() {
    return 'users_image'
  }
}
