import { Router, Response } from 'express'
import { Echo } from '../models'
import { CustomRequest } from '../interfaces'
import { wrap, error, validateQuery } from '../utils'

const router = Router()
const debug = require('debug')('ts-express:echo.controller')

router.get(
  '/',
  validateQuery({ msg: 'required' }),
  wrap(async (req: CustomRequest, res: Response) => {
    debug('[USER]', req.user)
    debug('[GET] /echo', req.query)

    const echo = new Echo({
      msg: req.query.msg
    })

    try {
      const result = await echo.save()
      res.json(result)
    } catch (e) {
      throw error(500, 'Database Error')
    }
  })
)

module.exports = router
