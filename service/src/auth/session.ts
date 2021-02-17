import { Redis } from '../redis'
import crypto from 'crypto'

export const createRepository = (redis: Redis) => {
  return {
    set: (params: { sessionId: string; userId: string }) =>
      redis.set(params.sessionId, params.userId),
    get: (sessionid: string) => redis.get(sessionid),
    clear: (sessionId: string) => redis.delete(sessionId),
  }
}

export type SessionRepository = ReturnType<typeof createRepository>

export const createService = (repository: SessionRepository) => {
  const createSession = async (userId: string) => {
    const sessionId = crypto.randomBytes(16).toString('base64')
    await repository.set({ sessionId, userId })
    return sessionId
  }

  return { createSession, getBySessionId: repository.get, clear: repository.clear }
}

export type SessionService = ReturnType<typeof createService>
