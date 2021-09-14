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
} from './auth/auth'
import { encrypt, isEqual } from './auth/password'

import { createRedis } from './redis'
import {
  createService as createSessionService,
  createRepository as createSessionRepository,
} from './auth/session'

import {
  createService as createUserService,
  createRepository as createUserRepository,
} from './auth/user'

import {
  createService as createVerificationService,
  createRepository as createVerificationRepository,
} from './auth/verification'
import { createAuthMiddleware } from './auth/middleware'

export const createApp = async (config: Config) => {
  const database = await createDatabase(config)
  const redis = createRedis(config)

  const featureRepository = createFeatureRepository(database.query)
  const featureService = createFeatureService(featureRepository)

  const sessionRepository = createSessionRepository(redis)
  const sessionService = createSessionService(sessionRepository)

  const userRepository = createUserRepository(database.query)
  const userService = createUserService({ encrypt, isEqual},  userRepository)

  const verificationRepository = createVerificationRepository(database.query)
  const verificationService = createVerificationService(verificationRepository)

  const authService = createAuthService(sessionService, verificationService, userService)
  const authMiddleware = createAuthMiddleware(sessionService)

  const app = express()
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))
  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())

  app.use(createAuthRoutes(authService))
  app.use(
    createFeatureRoutes(featureService, authMiddleware)
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
