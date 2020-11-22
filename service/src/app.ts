import * as morgan from 'morgan'
import * as express from 'express'
import { createRoutes } from './routes'

type Environment = {
  port: number
}

export const createApp = (env: Environment) => {
  const app = express()

  app.use(morgan('tiny'))
  app.use(createRoutes())

  return {
    start: () => {
      app.listen(env.port, () =>
        console.log(`Service started on port ${env.port}!`)
      )
    },
  }
}
