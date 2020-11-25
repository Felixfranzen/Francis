import * as morgan from 'morgan'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
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

import { createUtils as createJwtUtils } from './auth/jwt'

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

  app.use(createFeatureRoutes(featureService))
  app.use(createAuthRoutes(authMiddleware, authService))

  app.get('/secret', authMiddleware.verifyToken, (req, res) => {
    res.send('success!!')
  })

  return {
    start: async () => {
      await database.migrate()
      app.listen(config.APP_PORT, () =>
        console.log(`Service started on port ${config.APP_PORT}!`)
      )
    },
  }
}
