import { Database } from '../database'
import * as bcrypt from 'bcrypt'
import { JwtService } from './jwt'
import { Request, Response, NextFunction } from 'express'

const getFullUserByEmail = async (query: Database['query'], email: string) => {
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
  jwtService: JwtService,
  repository: AuthRepository
) => {
  const signUp = async (email: string, password: string) => {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const userId = await repository.createUser(email, hashedPassword)
    const token = await jwtService.sign({ id: userId, email })
    return {
      email: email,
      id: userId,
      token,
    }
  }

  const login = async (email: string, password: string) => {
    const user = await repository.getFullUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Invalid username/password')
    }

    const token = await jwtService.sign({ id: user.id, email })
    return {
      email: user.email,
      id: user.id,
      token,
    }
  }

  return { signUp, login }
}

export type AuthService = ReturnType<typeof createService>

export const createAuthMiddleware = (jwtServie: JwtService) => {
  const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jwt = req.cookies.access_token
      await jwtServie.verifyAndDecode(jwt)
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
      const jwt = req.cookies.jwt

      const decodedToken = (await jwtServie.verifyAndDecode(jwt)) as any
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
