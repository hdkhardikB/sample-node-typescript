import { Router, Request, Response } from 'express'
import { wrap, validateBody } from '../utils'

import { verifyUser } from '../client/user'

const router = Router()
const debug = require('debug')('ts-express:verify.controller')

router.post(
  '/',
  validateBody({ token: 'required' }),
  wrap(async (req: Request, res: Response) => {
    debug('[POST] /verify', req.body)

    const { token } = req.body
    const result = await verifyUser(token)
    res.send(result)
  })
)

module.exports = router
