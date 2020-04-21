import { Response, NextFunction } from 'express'
import { wrap, error } from '../utils'
import { CustomRequest } from '../interfaces'

export const verifiedBuyerOnly = wrap(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user.is_admin && !user.stripe_customer_id) {
    throw error(426, 'Unverified Buyer')
    
  }

  next()
})
