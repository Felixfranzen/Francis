import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
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
  createAuthMiddleware,
} from './auth/auth'
import { encrypt, isEqual } from './auth/password'

import { createUtils as createJwtUtils } from './auth/jwt-utils'

export const createApp = async (config: Config) => {
  const app = express()

  const database = await createDatabase(config)

  const jwtUtils = createJwtUtils(config.AUTH_SECRET)

  const featureRepository = createFeatureRepository(database.query)
  const featureService = createFeatureService(featureRepository)

  const authRepository = createAuthRepository(database.query)
  const authService = createAuthService(
    { encrypt, isEqual },
    jwtUtils,
    authRepository
  )

  const authMiddleware = createAuthMiddleware(jwtUtils)

  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(createFeatureRoutes(authMiddleware, featureService))
  app.use(createAuthRoutes(authMiddleware, authService, jwtUtils))

  return {
    start: async () => {
      app.listen(config.APP_PORT, () =>
        console.log(`Service started on port ${config.APP_PORT}!`)
      )
    },
  }
}
