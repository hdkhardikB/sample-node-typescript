import { Router, Response, Request } from 'express'
import { wrap, validateBody } from '../utils'

import { contactus } from '../client/user'
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = Router()
const debug = require('debug')('ts-express:products.controller')

router.post(
  '/contactus',
  validateBody({
    subject: 'required',
    name: 'required',
    email: 'required',
    phone_number: 'required',
    message: 'required'
  }),
  wrap(async (req: Request, res: Response) => {
    debug('[POST] /public/contactus')
    const result = await contactus(req.body)
    res.send(result)
  })
)

module.exports = router
