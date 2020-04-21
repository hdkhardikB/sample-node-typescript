import { Response, NextFunction } from 'express'
import { wrap, error } from '../utils'
import { CustomRequest } from '../interfaces'

export const sameUser = wrap(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const tokenUid = req.user
  const { uid } = req.body

  if (!uid) {
    throw error(401, 'Unauthorized')
  }

  if (uid !== tokenUid) {
    throw error(401, 'Unauthorized')
  }

  next()
})
