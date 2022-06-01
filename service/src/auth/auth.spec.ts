import { createService as createAuthService } from './auth'
import * as uuid from 'uuid'
import { validatePassword } from './password'
import {
  SessionService,
} from './session'

import {
  UserService
} from './user'

import {
  VerificationService
} from './verification'

describe('Auth', () => {
  const emptyPasswordUtils = {
    encrypt: jest.fn(),
    isEqual: jest.fn(),
  }

  const emptyUserService: UserService = {
    create: jest.fn(),
    isValidCredentials: jest.fn(),
    getById: jest.fn()
  }

  const emptyVerificationService: VerificationService = {
    assignToken: jest.fn(),
    verifyUser: jest.fn()
  }

  const emptySessionService: SessionService = {
    getBySessionId: jest.fn(),
    createSession: jest.fn(),
    clear: jest.fn()
  }

  describe('Service', () => {
    it('can signup a user with valid email and password', async () => {
      const mockId = uuid.v4()
      const mockEmail = 'hello@felix.franzen.com'
      const mockPassword = '1234567890'
      const mockSessionId = 'mock-session-id'
      const mockVerificationToken = 'mock-token'

      const sessionService = {
        ...emptySessionService,
        createSession: jest.fn().mockResolvedValue(mockSessionId)
      }

      const verificationService = {
        ...emptyVerificationService,
        assignToken: jest.fn().mockResolvedValue(mockVerificationToken)
      }

      const userService = {
        ...emptyUserService,
        create: jest.fn().mockResolvedValue({ id: mockId, email: mockEmail })
      }

      const service = createAuthService(sessionService, verificationService, emptyUserService)
      const result = await service.signUp(mockEmail, mockPassword)

      expect(result.email).toBe(mockEmail)
      expect(result.userId).toBe(mockId)
      expect(result.sessionId).toBe(mockSessionId)
      expect(result.verificationToken).toBe(mockVerificationToken)
    })

    it('can login', async () => {
    })

    it('can not login when no user has the supplied email', async () => {
    })

    it('can not login when password is invalid', async () => {
    })
  })
})
