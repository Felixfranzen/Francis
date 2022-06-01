import { Database } from '../database'
import { insertUser, selectFullUserByEmail, selectUserById } from './queries/index.queries'
import { PasswordUtils } from './password'

export type UserRepository = {
  create: (email: string, hashedPassword: string, role: 'user' | 'admin' ) => Promise<string>

  getFullUserByEmail: (email: string) => Promise<{
    id: string
    email: string
    password: string
    role: 'user' | 'admin'
  } | undefined >

  getById: (userId: string) => Promise<{ id: string, email: string, is_verified: boolean } | undefined>
}

export type UserService = {
  create: (email: string, password: string) => Promise<{
    id: string
    email: string
  }>

  isValidCredentials: (email: string, password: string) => Promise<{ id: string, valid: boolean }>
  getById: (userId: string) => Promise<{ id: string, email: string, isVerified: boolean } | undefined>
}

export const createRepository = (query: Database['query']): UserRepository => {
  const create = async (
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

  const getFullUserByEmail = async (email: string) => {
    const result = await query(selectFullUserByEmail, { email })
    if (result.length === 0) {
      return undefined
    } else {
      return result[0]
    }
  }


  const getById = async (userId: string) => {
    const result = await query(selectUserById, { userId })
    if (result.length === 0) {
      return undefined
    }
    return result[0]
  }

  return {
    create,
    getFullUserByEmail,
    getById,

  }
}

export const createService = (
  passwordUtils: PasswordUtils,
  repository: UserRepository
): UserService => {
  const create = async (email: string, password: string) => {
    const role = 'user'
    const hashedPassword = await passwordUtils.encrypt(password)
    const userId = await repository.create(email, hashedPassword, role)

    return {
      email: email,
      id: userId,
    }
  }

  const isValidCredentials = async (email: string, password: string) => {
    const user = await repository.getFullUserByEmail(email)
    if (!user) {
      throw new Error('Not found')
    }

    const isCorrectPassword = await passwordUtils.isEqual(
      password,
      user.password
    )

    return isCorrectPassword ? { id: user.id, valid: true } : { id: user.id, valid: false }
  }

  const getById = async (userId: string) => {
    const user = await repository.getById(userId)
    if (!user) {
      return undefined
    }
    return { id: user.id, email: user.email, isVerified: user.is_verified }
  }

  return {
    create,
    isValidCredentials,
    getById,
  }
}