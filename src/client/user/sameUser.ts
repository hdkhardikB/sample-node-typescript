import { CustomRequest } from '../../interfaces'
import { error } from '../../utils'

const sameUser = async (req: CustomRequest, uid: string) => {
  const tokenUID = req.user.uid

  if (uid !== tokenUID) {
    throw error(401, 'Unauthorized')
  }

  return
}

export default sameUser
