import { Redis } from '../redis'
import crypto from 'crypto'

const FIFTEEN_MINUTES_SECONDS = 60 * 15

export const createRepository = (redis: Redis) => {
  return {
    set: (params: { sessionId: string; userId: string }) =>
      redis.setWithExpiration(
        params.sessionId,
        params.userId,
        FIFTEEN_MINUTES_SECONDS
      ),
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

  return {
    createSession,
    getBySessionId: repository.get,
    clear: repository.clear,
  }
}

export type SessionService = ReturnType<typeof createService>
