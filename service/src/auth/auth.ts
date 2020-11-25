import { Database } from '../database'
import * as bcrypt from 'bcrypt'
import { JwtUtils } from './jwt'
import { Request, Response, NextFunction } from 'express'
import { Password } from './password'

const getFullUserByEmail = async (
  query: Database['query'],
  email: string
): Promise<
  | {
      id: string
      email: string
      password: string
      role: 'user' | 'admin'
    }
  | undefined
> => {
  const result = await query.select('*').from('user').where({ email }).limit(1)
  if (!result) {
    return
  }

  return result[0]
}

const createUser = async (
  query: Database['query'],
  email: string,
  hashedPassword: string
) => {
  const featureIds = await query
    .table('user')
    .insert({ email, password: hashedPassword, role: 'user' })
    .returning('id')

  // todo validate and fix :)))
  const userId = featureIds[0] as string
  return userId
}

export const createRepository = (query: Database['query']) => {
  return {
    getFullUserByEmail: (email: string) => getFullUserByEmail(query, email),
    createUser: (email: string, hashedPassword: string) =>
      createUser(query, email, hashedPassword),
  }
}

export type AuthRepository = ReturnType<typeof createRepository>

export const createService = (
  passwordUtils: {
    encrypt: (password: Password) => Promise<Password>
    isEqual: (password: Password, encryptedPassword: string) => Promise<boolean>
  },
  jwtUtils: JwtUtils,
  repository: AuthRepository
) => {
  const signUp = async (email: string, password: Password) => {
    const hashedPassword = await passwordUtils.encrypt(password)
    const userId = await repository.createUser(email, hashedPassword)
    const token = await jwtUtils.sign({ id: userId, email })
    return {
      email: email,
      id: userId,
      token,
    }
  }

  const login = async (email: string, password: Password) => {
    const user = await repository.getFullUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isCorrectPassword = await passwordUtils.isEqual(
      password,
      user.password
    )

    if (!isCorrectPassword) {
      throw new Error('Invalid username/password')
    }

    const token = await jwtUtils.sign({ id: user.id, email })
    return {
      email: user.email,
      id: user.id,
      token,
    }
  }

  return { signUp, login }
}

export type AuthService = ReturnType<typeof createService>

export const createAuthMiddleware = (jwtUtils: JwtUtils) => {
  const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwt = req.cookies.access_token
      await jwtUtils.verifyAndDecode(jwt)
      next()
    } catch (e) {
      res.sendStatus(401)
    }
  }

  const verifyRole = (allowedRoles: string[]) => async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwt = req.cookies.access_token

      // TODO validate properly
      const decodedToken = (await jwtUtils.verifyAndDecode(jwt)) as any
      const isAllowed =
        decodedToken.role && allowedRoles.includes(decodedToken.role)

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
