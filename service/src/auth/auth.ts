import { Request, Response, NextFunction } from 'express'
import { SessionService } from './session'
import { VerificationService } from './verification'
import { UserService } from './user'

export type AuthService = {
  signUp: (email: string, password: string) => Promise<{ userId: string, email: string, verificationToken: string, sessionId: string }>
  login: (email: string, password: string) => Promise<{ userId: string, sessionId: string}>
  verifyUser: (userId: string, token: string) => Promise<unknown>
  me: (sessionId: string) => Promise<{ id: string, email: string, isVerified: boolean }>
}

export const createService = (
  session: SessionService,
  verification: VerificationService,
  user: UserService
): AuthService => {
  const signUp = async (email: string, password: string) => {
    const newUser = await user.create(email, password)
    const verificationToken = await verification.assignToken(newUser.id)
    const sessionId = await session.createSession(newUser.id)

    return {
      email: newUser.email,
      userId: newUser.id,
      verificationToken,
      sessionId
    }
  }

  const login = async (email: string, password: string) => {
    const { id, valid } = await user.isValidCredentials(email, password)
    if (!valid) {
      throw new Error('Invalid credentials')
    }

    const sessionId = await session.createSession(id)
    return { userId: id, sessionId }
  }

  const verifyUser = async (userId: string, verificationToken: string) => {
    await verification.verifyUser(userId, verificationToken)
  }

  const me = async (sessionId: string) => {
    const userId = await session.getBySessionId(sessionId)
    if (!userId) {
      throw new Error('No session found')
    }
    const result = await user.getById(userId)
    if (!result) {
      throw new Error('User not found for sessionId')
    }
    return result
  }

  return {
    signUp,
    login,
    verifyUser,
    me
  }
}
