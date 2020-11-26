import * as crypto from 'crypto'
import { Database } from '../database'
import { JwtUtils } from './jwt'
import { Request, Response, NextFunction } from 'express'
import { Password } from './password'

type Role = 'user' | 'admin'

const getFullUserByEmail = async (
  query: Database['query'],
  email: string
): Promise<
  | {
      id: string
      email: string
      password: string
      role: Role
    }
  | undefined
> => {
  const result = await query.select('*').from('user').where({ email }).limit(1)
  if (!result) {
    return
  }

  return result[0]
}

// TODO Create a special user type that can only be generated
// by running email/password through a create function that encrypts password etc

const createUser = async (
  query: Database['query'],
  email: string,
  hashedPassword: string // TODO change signature
) => {
  const featureIds = await query
    .table('user')
    .insert({ email, password: hashedPassword, role: 'user' })
    .returning('id')

  // todo validate and fix :)))
  const userId = featureIds[0] as string
  return userId
}

const createVerificationtoken = async (
  query: Database['query'],
  userId: string
) => {
  const verificationToken = crypto.randomBytes(16).toString('hex')

  const result = await query
    .table('verification_token')
    .insert({ user_id: userId, token: verificationToken })
    .returning('*')

  // todo validate and fix :)))
  return result[0].verification_token

  // TODO remove old tokens
}

const verifyUser = async (query: Database['query'], token: string) => {
  // 1 day
  var expiry = new Date()
  expiry.setDate(expiry.getDate() - 1)
  console.log(expiry.toISOString())

  // TODO check that created_at is within time limit
  // TODO move to separate queries?
  const result = await query
    .select('*')
    .from('verification_token')
    .where({ token })
    .andWhere('created_at', '>', expiry.toISOString())
    .limit(1)

  if (!result[0]) {
    throw new Error('No valid token found')
  }

  // TODO VALIDATE
  const userId = result[0].user_id
  await query.table('user').where({ id: userId }).update({ is_verified: true })
}

export const createRepository = (query: Database['query']) => {
  return {
    getFullUserByEmail: (email: string) => getFullUserByEmail(query, email),
    createUser: (email: string, hashedPassword: string) =>
      createUser(query, email, hashedPassword),
    createVerificationtoken: (userId: string) =>
      createVerificationtoken(query, userId),
    verifyUser: (token: string) => verifyUser(query, token),
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
    const verificationToken = await repository.createVerificationtoken(userId)

    return {
      email: email,
      id: userId,
      verificationToken,
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

  // TODO include userId in verifyUser to make sure that the right user is verified
  // user id could be sent as a paramter in the email link
  return { signUp, login, verifyUser: repository.verifyUser }
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
      if (!jwt) {
        res.sendStatus(401)
        return
      }

      await jwtUtils.verifyAndDecode(jwt)
      next()
    } catch (e) {
      res.sendStatus(401)
    }
  }

  const verifyRole = (allowedRoles: Role[]) => async (
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
