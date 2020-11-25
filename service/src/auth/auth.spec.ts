import { createService } from './auth'
import { AuthRepository } from './auth'
import { JwtUtils } from './jwt'
import * as uuid from 'uuid'
import { Password, validatePassword } from './password'
import * as bcrypt from 'bcrypt'

describe('Auth', () => {
  describe('Service', () => {
    const emptyPasswordUtils = {
      encrypt: jest.fn(),
      isEqual: jest.fn(),
    }

    it('can signup a user with valid email and password', async () => {
      const mockToken = 'mytoken'
      const jwtService: JwtUtils = {
        sign: jest.fn().mockReturnValue(Promise.resolve(mockToken)),
        verifyAndDecode: jest.fn(),
      }

      const mockId = uuid.v4()
      const mockEmail = 'hello@felix.franzen.com'
      const mockPassword = validatePassword('1234567890')

      const repository: AuthRepository = {
        createUser: jest.fn().mockReturnValue(Promise.resolve(mockId)),
        getFullUserByEmail: jest.fn(),
      }

      const service = createService(emptyPasswordUtils, jwtService, repository)
      const result = await service.signUp(mockEmail, mockPassword)

      expect(result.email).toBe(mockEmail)
      expect(result.id).toBe(mockId)
      expect(result.token).toBe(mockToken)
    })

    it('does not store plain text password on signup', async () => {
      const passwordUtils = {
        ...emptyPasswordUtils,
        encrypt: jest.fn().mockResolvedValue('asuperlongencryptedvaluethatsnotplaintext'),
      }
      const jwtService: JwtUtils = {
        sign: jest.fn().mockReturnValue(Promise.resolve('token')),
        verifyAndDecode: jest.fn(),
      }

      const mockId = uuid.v4()
      const mockEmail = 'hello@felix.franzen.com'
      const mockPassword = validatePassword('1234567890')
      const mockCreateUser = jest.fn().mockResolvedValue(mockId)

      const repository: AuthRepository = {
        createUser: mockCreateUser,
        getFullUserByEmail: jest.fn(),
      }
      const service = createService(emptyPasswordUtils, jwtService, repository)
      await service.signUp(mockEmail, mockPassword)
      const [calledEmail, calledPassword] = mockCreateUser.mock.calls[0]

      expect(calledPassword).not.toBe(mockPassword)
    })

    it('can login', async () => {
      const passwordUtils = {
        ...emptyPasswordUtils,
        isEqual: jest.fn().mockResolvedValue(true),
      }

      const mockToken = 'mytoken'
      const jwtService: JwtUtils = {
        sign: jest.fn().mockResolvedValue(mockToken),
        verifyAndDecode: jest.fn(),
      }

      const mockUser = {
        id: uuid.v4(),
        email: 'hello@felix.franzen.com',
        password: '1234567890',
      }

      const repository: AuthRepository = {
        createUser: jest.fn(),
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
      // will not be mocked in the following tests
      const jwtService: JwtUtils = {
        sign: jest.fn(),
        verifyAndDecode: jest.fn(),
      }

      it('can not login when no user has the supplied email', async () => {
        const mockUser = {
          id: uuid.v4(),
          email: 'hello@felix.franzen.com',
          password: '1234567890',
        }

        const repository: AuthRepository = {
          createUser: jest.fn(),
          getFullUserByEmail: jest.fn().mockResolvedValue(mockUser),
        }

        const service = createService(
          emptyPasswordUtils,
          jwtService,
          repository
        )
        expect(() =>
          service.login(
            'someinvalidemail@invalid.com',
            validatePassword('32781903198989')
          )
        ).rejects.toBeDefined()
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
          createUser: jest.fn(),
          getFullUserByEmail: jest.fn().mockResolvedValue(mockUser),
        }

        const service = createService(passwordUtils, jwtService, repository)
        expect(() =>
          service.login(
            mockUser.email,
            validatePassword('somethingcompletelydifferent')
          )
        ).rejects.toBeDefined()
      })
    })
  })
})
