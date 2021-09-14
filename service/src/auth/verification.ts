import { insertVerificationToken, selectVerificationToken, updateVerification } from './queries/index.queries'
import { Database} from '../database'
import crypto from 'crypto'

export type VerificationRepository = {
  assignToken: (userId: string, token: string) => Promise<string>
  getTokenData:(userId: string, token: string,) => Promise<{ user_id: string; token: string; created_at: Date; } | undefined>
  setVerification: (userId: string, isVerified: boolean) => Promise<unknown>
}

export type VerificationService = {
  assignToken: (userId: string) => Promise<string>
  verifyUser: (userId: string, token: string) => Promise<unknown>
}

export const createRepository = (query: Database['query']): VerificationRepository => {

  const assignToken = async (token: string, userId: string) => {
    await query(insertVerificationToken, { userId, token })
    return token
  }

  const getTokenData = async (userId: string, token: string) => {
    const tokenData = await query(selectVerificationToken, { token, user_id: userId })
    if (tokenData.length === 0) {
      return undefined
    }
    return tokenData[0]
  }

  const setVerification = async (userId: string, verified: boolean) => {
    await query(updateVerification, { userId, verified })
  }


  return {
    assignToken,
    getTokenData,
    setVerification,
  }
}

export const createService = (
  repository: VerificationRepository
): VerificationService => {
  const assignToken = async (userId: string) => {
    const token = crypto.randomBytes(16).toString('hex')
    const result = await repository.assignToken(
      token,
      userId
    )
    return result
  }

  const verifyUser = async (userId: string, verificationToken: string) => {
    const tokenData = await repository.getTokenData(userId, verificationToken)
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

    await repository.setVerification(user_id, true)
  }

  return {
    assignToken,
    verifyUser,
  }
}
