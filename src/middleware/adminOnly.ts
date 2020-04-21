import { Response, NextFunction } from 'express'
import { wrap, error } from '../utils'
import { CustomRequest } from '../interfaces'

export const adminOnly = wrap(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user.is_admin) {
    throw error(401, 'Unauthorized')
  }

  next()
})
