import { createService } from './auth'
import { AuthRepository } from './auth'
import { JwtUtils } from './jwt'
import * as uuid from 'uuid'
import { Password, validatePassword } from './password'

describe('Auth', () => {
  const emptyJwtUtils = {
    verifyAndDecode: jest.fn(),
    sign: jest.fn(),
  }

  const emptyPasswordUtils = {
    encrypt: jest.fn(),
    isEqual: jest.fn(),
  }

  const emptyRepository = {
    getFullUserByEmail: jest.fn(),
    createUser: jest.fn(),
    createVerificationtoken: jest.fn(),
    verifyUser: jest.fn(),
  }

  describe('Service', () => {
    it('can signup a user with valid email and password', async () => {
      const mockToken = 'mytoken'
      const jwtService: JwtUtils = {
        ...emptyJwtUtils,
        sign: jest.fn().mockReturnValue(Promise.resolve(mockToken)),
      }

      const mockId = uuid.v4()
      const mockEmail = 'hello@felix.franzen.com'
      const mockPassword = validatePassword('1234567890')

      const repository: AuthRepository = {
        ...emptyRepository,
        createUser: jest.fn().mockReturnValue(Promise.resolve(mockId)),
      }

      const service = createService(emptyPasswordUtils, jwtService, repository)
      const result = await service.signUp(mockEmail, mockPassword)

      expect(result.email).toBe(mockEmail)
      expect(result.id).toBe(mockId)
      expect(result.token).toBe(mockToken)
    })

    it('does not store plain text password on signup', async () => {
      const mockEncryptedPassword = 'asuperlongencryptedvaluethatsnotplaintext'
      const passwordUtils = {
        ...emptyPasswordUtils,
        encrypt: jest.fn().mockResolvedValue(mockEncryptedPassword),
      }
      const jwtService: JwtUtils = {
        ...emptyJwtUtils,
        sign: jest.fn().mockReturnValue(Promise.resolve('token')),
      }

      const mockId = uuid.v4()
      const mockEmail = 'hello@felix.franzen.com'
      const mockPassword = validatePassword('1234567890')
      const mockCreateUser = jest.fn().mockResolvedValue(mockId)

      const repository: AuthRepository = {
        ...emptyRepository,
        createUser: mockCreateUser,
      }
      const service = createService(passwordUtils, jwtService, repository)
      await service.signUp(mockEmail, mockPassword)
      expect(passwordUtils.encrypt).toHaveBeenCalledWith(mockPassword)

      const [calledEmail, calledPassword] = mockCreateUser.mock.calls[0]
      expect(calledPassword).toBe(mockEncryptedPassword)
    })

    it('can login', async () => {
      const passwordUtils = {
        ...emptyPasswordUtils,
        isEqual: jest.fn().mockResolvedValue(true),
      }

      const mockToken = 'mytoken'
      const jwtService: JwtUtils = {
        ...emptyJwtUtils,
        sign: jest.fn().mockResolvedValue(mockToken),
      }

      const mockUser = {
        id: uuid.v4(),
        email: 'hello@felix.franzen.com',
        password: '1234567890',
      }

      const repository: AuthRepository = {
        ...emptyRepository,
        getFullUserByEmail: jest.fn().mockResolvedValue(mockUser),
      }

      const service = createService(passwordUtils, jwtService, repository)
      const result = await service.login(
        mockUser.email,
        validatePassword(mockUser.password)
      )

      expect(result.email).toBe(mockUser.email)
      expect(result.id).toBe(mockUser.id)
      expect(result.token).toBe(mockToken)
    })

    describe('Fails', () => {
      it('can not login when no user has the supplied email', async () => {
        const mockUser = {
          id: uuid.v4(),
          email: 'hello@felix.franzen.com',
          password: '1234567890',
        }

        const repository: AuthRepository = {
          ...emptyRepository,
          getFullUserByEmail: jest.fn().mockResolvedValue(mockUser),
        }

        const service = createService(
          emptyPasswordUtils,
          emptyJwtUtils,
          repository
        )

        const run = () =>
          service.login(
            'someinvalidemail@invalid.com',
            validatePassword('32781903198989')
          )

        expect(run()).rejects.toBeDefined()
      })

      it('can not login when password is invalid', async () => {
        const passwordUtils = {
          ...emptyPasswordUtils,
          isEqual: jest.fn().mockResolvedValue(false),
        }
        const mockUser = {
          id: uuid.v4(),
          email: 'hello@felix.franzen.com',
          password: '1234567890',
        }

        const repository: AuthRepository = {
          ...emptyRepository,
          getFullUserByEmail: jest.fn().mockResolvedValue(mockUser),
        }

        const service = createService(passwordUtils, emptyJwtUtils, repository)
        const run = () =>
          service.login(
            mockUser.email,
            validatePassword('somethingcompletelydifferent')
          )

        expect(run()).rejects.toBeDefined()
      })
    })
  })
})
