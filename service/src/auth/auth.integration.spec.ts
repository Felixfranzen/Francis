import supertest from 'supertest'
import { AuthRepository, createAuthMiddleware, createRepository } from './auth'
import dotenv from 'dotenv'
import { createDatabase, Database } from '../database'
import { parseConfig } from '../config'
import * as uuid from 'uuid'
import { createMockApp } from '../test-utils'
dotenv.config()

describe('Auth', () => {
  describe('Repository', () => {
    let repository: AuthRepository
    let db: Database
    beforeAll(async () => {
      db = await createDatabase(parseConfig(process.env))
      repository = createRepository(db.query)
    })
    afterAll(async () => {
      await db.disconnect()
    })

    it('can create a user', async () => {
      const email = uuid.v4() + '@gmail.com'
      const result = await repository.createUser(email, 'hashhash', 'user')
      expect(result).toBeDefined()
    })

    it('can get user by email', async () => {
      const email = uuid.v4() + '@gmail.com'
      const mockUser = {
        email,
        password: 'hashhash',
        role: 'user' as const,
      }
      const insertedId = await repository.createUser(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )
      expect(insertedId).toBeDefined()

      const user = await repository.getFullUserByEmail(mockUser.email)
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
      const userId = await repository.createUser(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )
      expect(userId).toBeDefined()
      const mockVerificationToken = uuid.v4()
      const token = await repository.assignVerificationToken(
        mockVerificationToken,
        userId
      )
      expect(token).toBeDefined()

      const result = await repository.getVerificationTokenData(token)
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
      const userId = await repository.createUser(
        mockUser.email,
        mockUser.password,
        mockUser.role
      )

      const before = await repository.getUserById(userId)
      expect(before?.is_verified).toBe(false)

      await repository.setUserVerification(userId, true)

      const after = await repository.getUserById(userId)
      expect(after?.is_verified).toBe(true)
    })
  })

  describe('Middleware', () => {
    it('sends 401 if no access token found in cookie', async () => {
      const middleware = createAuthMiddleware(jest.fn())
      const app = createMockApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app).get('/').expect(401)
    })

    it('sends 401 if unable to verify access token', async () => {
      const middleware = createAuthMiddleware(
        jest.fn().mockRejectedValue(new Error('failed'))
      )
      const app = createMockApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(401)
        .set('Cookie', 'access_token=doesntmatter')
    })

    it('allows an authed request to access the route', async () => {
      const middleware = createAuthMiddleware(jest.fn().mockResolvedValue({}))
      const app = createMockApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(200)
        .set('Cookie', 'access_token=doesntmatter')
    })

    it('sends 403 if a valid access token contains an invalid role', async () => {
      const middleware = createAuthMiddleware(
        jest.fn().mockRejectedValue({ role: 'user' })
      )
      const app = createMockApp()
      app.get('/', middleware.verifyRole(['admin']), (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(403)
        .set('Cookie', 'access_token=doesntmatter')
    })

    it('allows an authed request with the right role to access the route', async () => {
      const mockRole = 'admin' as const
      const middleware = createAuthMiddleware(
        jest.fn().mockResolvedValue({ role: mockRole })
      )
      const app = createMockApp()
      app.get('/', middleware.verifyRole([mockRole]), (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(200)
        .set('Cookie', 'access_token=doesntmatter')
    })
  })
})
