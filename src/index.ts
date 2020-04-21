#!/usr/bin/env node

/* eslint-disable no-use-before-define */
/* eslint-disable prefer-template */

/**
 * Module dependencies.
 */

const http = require('http')
const debug = require('debug')('ts-express:server')
const app = require('../dist/app')
import { gracefulExit } from './client/scheduler'

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: any) => {
    console.log(error)
    if (error.syscall !== 'listen') {
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            // console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

    debug('Listening on ' + bind)
}

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: any) => {
    const port = parseInt(val, 10)

    if (typeof port !== 'number') {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)
server.listen(port)
var io = require('socket.io')(server);
app.set('socketio', io);

process.stdin.resume();//so the program will not close instantly

const exitHandler = (options: any, exitCode: any) => {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    gracefulExit().then(() => console.log('agenda stopped'))
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));