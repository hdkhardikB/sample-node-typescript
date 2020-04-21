import { Response, Router } from 'express'
import { jwtVerify } from '../middleware'
import { wrap } from '../utils'
import { CustomRequest } from '../interfaces'

const router = Router()
// const stripe = require('stripe')(process.env.STRIPE_API_KEY)
import { Stripe } from 'stripe'
import { addPaymentMethod } from '../client/stripe'
const debug = require('debug')('ts-express:stripe.controller')
let stripe: Stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: null
})


router.post(
  '/attachPaymentMethod',
  jwtVerify,
  wrap(async (req: CustomRequest, res: Response) => {
    const { intent, is_default } = req.body
    const customer = await addPaymentMethod(intent, is_default, req.user)
    res.send(customer)
  })
)

module.exports = router
