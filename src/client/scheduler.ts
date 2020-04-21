import * as Agenda from 'agenda'
const scheduler = new Agenda({ maxConcurrency: 20 })

const gracefulExit = () => {
  return scheduler.stop()
}

scheduler.define('job:start', async job => {
  const { uid } = job.attrs.data
  // to write own function
})

scheduler.define('job:stop', async job => {

  const { uid } = job.attrs.data
  // to write own function
})

export { scheduler, gracefulExit }
