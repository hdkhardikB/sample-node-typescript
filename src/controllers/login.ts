import { Router, Request, Response } from 'express'
import { wrap, validateBody } from '../utils'

import { loginUser } from '../client/user'

const debug = require('debug')('ts-express:login.controller')

const router = Router()

router.post(
  '/',
  validateBody({ email: 'required' }),
  wrap(async (req: Request, res: Response) => {
    debug('[POST] /login', req.body)

    const { email, password, code } = req.body

    const result = await loginUser({ email, password, code })
    res.send(result)
  })
)

module.exports = router
