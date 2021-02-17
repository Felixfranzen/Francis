import * as crypto from 'crypto'
import { Database } from '../database'
import { Request, Response, NextFunction } from 'express'
import { Password } from './password'
import {
  insertUser,
  insertVerificationToken,
  selectFullUserByEmail,
  selectUserById,
  selectVerificationToken,
  updateVerification,
} from './queries/index.queries'
import { SessionService } from './session'

export const createRepository = (query: Database['query']) => {
  const getFullUserByEmail = async (email: string) => {
    const result = await query(selectFullUserByEmail, { email })
    if (result.length === 0) {
      return undefined
    } else {
      return result[0]
    }
  }

  const createUser = async (
    email: string,
    hashedPassword: string,
    role: 'user' | 'admin'
  ) => {
    const result = await query(insertUser, {
      email,
      password: hashedPassword,
      role,
    })
    return result[0].id
  }

  const assignVerificationToken = async (token: string, userId: string) => {
    await query(insertVerificationToken, { userId, token })
    return token
  }

  const getVerificationTokenData = async (token: string) => {
    const tokenData = await query(selectVerificationToken, { token })
    if (tokenData.length === 0) {
      return undefined
    }
    return tokenData[0]
  }

  const setUserVerification = async (userId: string, verified: boolean) => {
    await query(updateVerification, { userId, verified })
  }

  const getUserById = async (userId: string) => {
    const result = await query(selectUserById, { userId })
    if (result.length === 0) {
      return undefined
    }
    return result[0]
  }

  return {
    createUser,
    getFullUserByEmail,
    getUserById,
    assignVerificationToken,
    getVerificationTokenData,
    setUserVerification,
  }
}

export type AuthRepository = ReturnType<typeof createRepository>

export const createService = (
  passwordUtils: {
    encrypt: (password: Password) => Promise<Password>
    isEqual: (password: Password, encryptedPassword: string) => Promise<boolean>
  },
  repository: AuthRepository
) => {
  const signUp = async (email: string, password: Password) => {
    const role = 'user'
    const hashedPassword = await passwordUtils.encrypt(password)
    const userId = await repository.createUser(email, hashedPassword, role)

    const token = crypto.randomBytes(16).toString('hex')
    const verificationToken = await repository.assignVerificationToken(
      token,
      userId
    )

    return {
      email: email,
      id: userId,
      verificationToken,
    }
  }

  const login = async (email: string, password: Password) => {
    const user = await repository.getFullUserByEmail(email)
    if (!user) {
      throw new Error('Not found')
    }

    const isCorrectPassword = await passwordUtils.isEqual(
      password,
      user.password
    )

    if (!isCorrectPassword) {
      throw new Error('Invalid username/password')
    }

    return {
      email: user.email,
      id: user.id,
    }
  }

  const verifyUser = async (verificationToken: string) => {
    const tokenData = await repository.getVerificationTokenData(
      verificationToken
    )
    if (!tokenData) {
      throw new Error('No matching token')
    }

    const { created_at, user_id } = tokenData

    // 1 day
    const expiry = new Date()
    expiry.setDate(expiry.getDate() - 1)
    if (created_at < expiry) {
      throw new Error('Token expired')
    }

    await repository.setUserVerification(user_id, true)
  }

  // TODO include userId in verifyUser to make sure that the right user is verified
  // user id could be sent as a paramter in the email link
  return {
    signUp,
    login,
    verifyUser,
    getUserById: repository.getUserById,
  }
}

export type AuthService = ReturnType<typeof createService>

export const createAuthMiddleware = (
  getUserBySessionId: (sessionId: string) => Promise<{ role: 'admin' | 'user' }>
) => {
  const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwt = req.cookies.access_token
      if (!jwt) {
        res.sendStatus(401)
        return
      }

      await parseToken(jwt)
      next()
    } catch (e) {
      res.sendStatus(401)
    }
  }

  const verifyRole = (allowedRoles: ('user' | 'admin')[]) => async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwt = req.cookies.access_token
      if (!jwt) {
        res.sendStatus(401)
        return
      }

      const decodedToken = await parseToken(jwt)
      const isAllowed = allowedRoles.includes(decodedToken.role)

      if (!isAllowed) {
        res.sendStatus(403)
        return
      }

      next()
    } catch (e) {
      res.sendStatus(403)
    }
  }

  return { verifyToken, verifyRole }
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>
