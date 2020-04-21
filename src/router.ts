import { Router } from 'express'
import { jwtVerify, adminOnly } from './middleware'
const router = Router()

// * generic routes
router.use('/', require('./controllers/home'))
router.use('/login', require('./controllers/login'))
router.use('/verify', require('./controllers/verify'))
router.use('/echo', jwtVerify, require('./controllers/echo'))
router.use('/register', require('./controllers/register'))

router.use('/webhooks', require('./controllers/webhooks'))
router.use('/public', require('./controllers/public'))
router.use('/stripe', jwtVerify, require('./controllers/stripe'))
router.use('/marketPlace', jwtVerify, require('./controllers/marketPlace'))

module.exports = router
