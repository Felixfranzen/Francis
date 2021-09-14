import supertest from 'supertest'
import dotenv from 'dotenv'
import { createDatabase, Database } from '../database'
import { parseConfig } from '../config'
import * as uuid from 'uuid'
import {
  SessionRepository,
  createRepository as createSessionRepository,
} from './session'

import {
  UserRepository,
  createRepository as createUserRepository,
} from './user'

import {
  VerificationRepository,
  createRepository as createVerificationRepository,
} from './verification'

import { createRedis, Redis } from '../redis'

dotenv.config()

describe('Auth', () => {
  describe('Repository', () => {
    let sessionRepository: SessionRepository
    let userRepository: UserRepository
    let verificationRepository: VerificationRepository

    let redis: Redis
    let database: Database
    beforeAll(async () => {
      database = await createDatabase(parseConfig(process.env))
      redis = createRedis(parseConfig(process.env))
      sessionRepository = createSessionRepository(redis)
      userRepository = createUserRepository(database.query)
      verificationRepository = createVerificationRepository(database.query)
    })
    afterAll(async () => {
      await database.disconnect()
    })

    it('can create a user', async () => {
      const email = uuid.v4() + '@gmail.com'
      const result = await userRepository.create(email, 'hashhash', 'user')
      expect(result).toBeDefined()
    })

    it('can get user by email', async () => {
      const email = uuid.v4() + '@gmail.com'
      const mockUser = {
        email,
        password: 'hashhash',
        role: 'user' as const,
      }
      const insertedId = await userRepository.create(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )
      expect(insertedId).toBeDefined()

      const user = await userRepository.getFullUserByEmail(mockUser.email)
      expect(user?.email).toBe(mockUser.email)
      expect(user?.password).toBe(mockUser.password)
      expect(user?.role).toBe(mockUser.role)
    })

    it('can assign and get token', async () => {
      const mockUser = {
        email: uuid.v4() + '@gmail.com',
        password: 'hashhash',
        role: 'user' as const,
      }
      const userId = await userRepository.create(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )
      expect(userId).toBeDefined()
      const mockVerificationToken = uuid.v4()
      const token = await verificationRepository.assignToken(
        mockVerificationToken,
        userId
      )
      expect(token).toBeDefined()

      const result = await verificationRepository.getTokenData(userId, token)
      expect(result).toBeDefined()
      expect(result?.token).toBe(token)
      expect(result?.user_id).toBe(userId)
    })

    it('can set user verification status', async () => {
      const mockUser = {
        email: uuid.v4() + '@gmail.com',
        password: 'hashhash',
        role: 'user' as const,
      }
      const userId = await userRepository.create(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )

      const before = await userRepository.getById(userId)
      expect(before?.is_verified).toBe(false)

      await verificationRepository.setVerification(userId, true)

      const after = await userRepository.getById(userId)
      expect(after?.is_verified).toBe(true)
    })
  })

  // describe('Middleware', () => {
  //   it('sends 401 if no access token found in cookie', async () => {
  //     const middleware = createAuthMiddleware(jest.fn())
  //     const app = createMockApp()
  //     app.get('/', middleware.verifyToken, (_, res) => {
  //       res.sendStatus(200)
  //     })

  //     await supertest(app).get('/').expect(401)
  //   })

  //   it('sends 401 if unable to verify access token', async () => {
  //     const middleware = createAuthMiddleware(
  //       jest.fn().mockRejectedValue(new Error('failed'))
  //     )
  //     const app = createMockApp()
  //     app.get('/', middleware.verifyToken, (_, res) => {
  //       res.sendStatus(200)
  //     })

  //     await supertest(app)
  //       .get('/')
  //       .expect(401)
  //       .set('Cookie', 'access_token=doesntmatter')
  //   })

  //   it('allows an authed request to access the route', async () => {
  //     const middleware = createAuthMiddleware(jest.fn().mockResolvedValue({}))
  //     const app = createMockApp()
  //     app.get('/', middleware.verifyToken, (_, res) => {
  //       res.sendStatus(200)
  //     })

  //     await supertest(app)
  //       .get('/')
  //       .expect(200)
  //       .set('Cookie', 'access_token=doesntmatter')
  //   })

  //   it('sends 403 if a valid access token contains an invalid role', async () => {
  //     const middleware = createAuthMiddleware(
  //       jest.fn().mockRejectedValue({ role: 'user' })
  //     )
  //     const app = createMockApp()
  //     app.get('/', middleware.verifyRole(['admin']), (_, res) => {
  //       res.sendStatus(200)
  //     })

  //     await supertest(app)
  //       .get('/')
  //       .expect(403)
  //       .set('Cookie', 'access_token=doesntmatter')
  //   })

  //   it('allows an authed request with the right role to access the route', async () => {
  //     const mockRole = 'admin' as const
  //     const middleware = createAuthMiddleware(
  //       jest.fn().mockResolvedValue({ role: mockRole })
  //     )
  //     const app = createMockApp()
  //     app.get('/', middleware.verifyRole([mockRole]), (_, res) => {
  //       res.sendStatus(200)
  //     })

  //     await supertest(app)
  //       .get('/')
  //       .expect(200)
  //       .set('Cookie', 'access_token=doesntmatter')
  //   })
  // })
})
