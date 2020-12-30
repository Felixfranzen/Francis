import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from '../swagger.json'
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
import { createRedis } from './redis'
import {
  createService as createSessionService,
  createRepository as createSessionRepository,
} from './auth/session'

export const createApp = async (config: Config) => {
  const database = await createDatabase(config)
  const redis = createRedis(config)

  const jwtUtils = createJwtUtils(config.AUTH_SECRET)

  const sessionRepository = createSessionRepository(redis)
  const sessionService = createSessionService(sessionRepository)

  const featureRepository = createFeatureRepository(database.query)
  const featureService = createFeatureService(featureRepository)

  const authRepository = createAuthRepository(database.query)
  const authService = createAuthService(
    { encrypt, isEqual },
    jwtUtils,
    authRepository
  )

  const authMiddleware = createAuthMiddleware(authService.parseToken)

  const app = express()
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))
  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())

  app.use(createAuthRoutes(authMiddleware, authService))
  app.use(
    createFeatureRoutes(authMiddleware, featureService, authService.parseToken)
  )

  app.get('/ping', (_, res) => res.send('pong'))

  return {
    start: async () => {
      app.listen(config.PORT, () =>
        console.log(`Service started on port ${config.PORT}!`)
      )
    },
  }
}
