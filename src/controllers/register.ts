import { Router, Request, Response } from 'express'
import { wrap, validateBody } from '../utils'

import { createUser } from '../client/user'

const router = Router()
const debug = require('debug')('ts-express:users.controller')

router.post(
  '/',
  validateBody({
    name: 'required',
    email: 'required|email',

    password: 'required|min:5'
  }),
  wrap(async (req: Request, res: Response) => {
    debug('[POST] /users', req.body)
    const { name, email, password, vatNumber, kvkNumber } = req.body
    const result = await createUser({
      name,
      email,
      password,
      vatNumber,
      kvkNumber
    })
    res.send(result)
  })
)

module.exports = router
