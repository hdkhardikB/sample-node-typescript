import { Router, Request, Response } from 'express'
import { wrap } from '../utils'

import { webhooks } from '../client/payment'

const router = Router()
const debug = require('debug')('ts-express:payment.controller')

router.post(
  '/',
  wrap(async (req: Request, res: Response) => {
    debug('[POST] /webhooks')
    const result = await webhooks(req.body)
    res.send(result)
  })
)

module.exports = router
