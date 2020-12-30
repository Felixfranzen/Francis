import { Redis } from '../redis'
import crypto from 'crypto'

export const createRepository = (redis: Redis) => {
  return {
    setSession: (params: { sessionId: string; userId: string }) =>
      redis.set(params.sessionId, params.userId),
    getSession: (sessionid: string) => redis.get(sessionid),
  }
}

export type SessionRepository = ReturnType<typeof createRepository>

export const createService = (repository: SessionRepository) => {
  const createSession = async (userId: string) => {
    const sessionId = crypto.randomBytes(16).toString('base64')
    await repository.setSession({ sessionId, userId })
    return sessionId
  }

  return { createSession, getBySessionId: repository.getSession }
}

export type SessionService = ReturnType<typeof createService>
