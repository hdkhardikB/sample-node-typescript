import { error } from '../../utils'
import { User } from '../../models'
import * as _ from 'lodash'

const getUser = async (uid: string) => {
  let existingUsers: any = []
  try {
    const result = await new User().query({ where: { uid } }).fetchAll({
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
  if (!existingUsers.length) {
    throw error(404, 'Not Found')
  }
  if (existingUsers[0].image) {
    const keys = Object.keys(existingUsers[0].image)
    const item: any = {}
    _.each(keys, key => {
      const sendKey = _.camelCase(key)
      item[sendKey] = existingUsers[0].image[key]
    })
    existingUsers[0].image = item
  }
  return {
    company: existingUsers[0].company,
    email: existingUsers[0].email,
    kvkNumber: existingUsers[0].kvk_number,
    name: existingUsers[0].name,
    uid,
    vatNumber: existingUsers[0].vat_number,
    image: existingUsers[0].image
  }
}

export default getUser
