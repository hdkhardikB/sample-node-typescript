import { Response, NextFunction } from 'express'
import { wrap, error } from '../utils'
import { CustomRequest } from '../interfaces'

export const verifiedSellerOnly = wrap(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user.is_admin && !user.stripe_buyer_id) {
    throw error(427, 'Unverified Seller')
  }

  next()
})
