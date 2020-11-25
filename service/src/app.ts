import * as morgan from 'morgan'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { createRoutes as createFeatureRoutes } from './feature/routes'
import { createRoutes as createAuthRoutes } from './auth/routes'
import { createDatabase } from './database'
import { Config } from './config'
import {
  createService as createFeatureService,
  createRepository as createFeatureRepository,
} from './feature/feature'
import {
  createService as createAuthService,
  createRepository as createAuthRepository,
} from './auth/auth'

export const createApp = async (config: Config) => {
  const app = express()

  const database = await createDatabase(config)

  const featureRepository = createFeatureRepository(database.query)
  const featureService = createFeatureService(featureRepository)

  const authRepository = createAuthRepository(database.query)
  const authService = createAuthService(authRepository)

  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(createFeatureRoutes(featureService))
  app.use(createAuthRoutes(authService))

  return {
    start: async () => {
      await database.migrate()
      app.listen(config.APP_PORT, () =>
        console.log(`Service started on port ${config.APP_PORT}!`)
      )
    },
  }
}
