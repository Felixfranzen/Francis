import cookieParser = require('cookie-parser')
import * as express from 'express'
import * as supertest from 'supertest'
import { createAuthMiddleware } from './auth'

const createApp = () => {
  const app = express()
  app.use(cookieParser())
  return app
}

describe('Auth', () => {
  describe('Repository', () => {
    it('can get user by email', () => {})
    it('can create a user', () => {})
  })

  describe('Middleware', () => {
    it('sends 401 if not access token found in cookie', async () => {
      const jwtUtls = { sign: jest.fn(), verifyAndDecode: jest.fn() }
      const middleware = createAuthMiddleware(jwtUtls)
      const app = createApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app).get('/').expect(401)
    })

    it('sends 401 if unable to verify access token', async () => {
      const jwtUtls = {
        sign: jest.fn(),
        verifyAndDecode: jest.fn().mockRejectedValue(new Error('failed')),
      }
      const middleware = createAuthMiddleware(jwtUtls)
      const app = createApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(401)
        .set('Cookie', 'access_token=doesntmatter')
    })

    it('allows an authed request to access the route', async () => {
      const jwtUtls = {
        sign: jest.fn(),
        verifyAndDecode: jest.fn().mockResolvedValue({}),
      }
      const middleware = createAuthMiddleware(jwtUtls)
      const app = createApp()
      app.get('/', middleware.verifyToken, (_, res) => {
        res.sendStatus(200)
      })

      await supertest(app)
        .get('/')
        .expect(200)
        .set('Cookie', 'access_token=doesntmatter')
    })

    it('can protect a route that requires a valid jwt and the correct role', async () => {
      const jwtUtls = {
        sign: jest.fn(),
        verifyAndDecode: jest.fn().mockRejectedValue({ role: 'user' }),
      }
      const middleware = createAuthMiddleware(jwtUtls)
      const app = createApp()
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
      const jwtUtls = {
        sign: jest.fn(),
        verifyAndDecode: jest.fn().mockResolvedValue({ role: mockRole }),
      }
      const middleware = createAuthMiddleware(jwtUtls)
      const app = createApp()
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
