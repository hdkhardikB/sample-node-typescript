/**
 * Module dependencies.
 */
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as cors from 'cors'
import * as lusca from 'lusca'
import { Err } from './interfaces'
import { scheduler } from './client/scheduler'
const helmet = require('helmet')
const csrf = require('csurf');
const debug = require('debug')('ts-express:app')
import * as mongoose from 'mongoose'

const { error } = require('dotenv').config()

const connectDB = async () => {
  try {
    console.log('hi')
    const result = await mongoose.connect(process.env.AGENDA_MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,

      useFindAndModify: false
    });
    console.log("MongoDB Conected")
    scheduler.mongo(result.connection.db)

    scheduler.on('ready', () => {
      scheduler.start();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
connectDB().then((resp) => console.log('Database and scheduler started', resp))
if (error) {
  debug(error)
  throw error
}

/**
 * Create Express server.
 */
const app = express()
app.use(cors({
  origin: process.env.ORIGIN
}))
app.use(helmet())
app.disable('x-powered-by')
/**
 * Express configuration.
 */

const isTest = process.env.NODE_ENV === 'test'
app.use(
  logger(process.env.LOG_LEVEL, {
    skip: () => isTest
  })
)

const allowCrossDomain = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(allowCrossDomain)
// app.use((req: any, res: express.Response, next: express.NextFunction) => {
//   // Expose variable to templates via locals
//   res.locals.csrftoken = req.csrfToken();
//   next();
// });
// app.use(csrf());

/**
 * routes.
 */
app.use('/', require('./router'))

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  let err = new Error('Not Found') as Err
  err.status = 404
  next(err)
})
const limiter = require('express-limiter')(app);

// Limit requests to 100 per hour per ip address.
limiter({
  path: '*',
  method: 'all',
  lookup: 'connection.remoteAddress',
  total: 150,
  expire: 1000 * 60 * 60
})
// error handler
app.use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
  debug(err)

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    message: err.message,
    data: err.data
  })
})
module.exports = app
