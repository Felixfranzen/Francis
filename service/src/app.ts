import * as morgan from 'morgan'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { createRoutes } from './routes'
import { createDatabase } from './lib/database'
import { Config } from './config'
import { createService, createRepository } from './lib/feature'

export const createApp = async (config: Config) => {
  const app = express()

  const database = await createDatabase(config)
  const repository = createRepository(database.query)
  const service = createService(repository)

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
