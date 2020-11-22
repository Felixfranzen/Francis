import * as morgan from 'morgan'
import * as express from 'express'
import { createRoutes } from './routes'
import { createDatabase } from './lib/database'
import { Config } from './config'
import { createService } from './lib/service'
import bodyParser = require('body-parser')

export const createApp = async (config: Config) => {
  const app = express()

  const database = await createDatabase(config)
  const service = createService(database.query)

  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(createRoutes(service))

  return {
    start: async () => {
      await database.migrate()
      app.listen(config.APP_PORT, () =>
        console.log(`Service started on port ${config.APP_PORT}!`)
      )
    },
  }
}
