import { Request, Response, NextFunction } from 'express'
import { SessionService } from './session'

export const createAuthMiddleware = (
  sessionService: SessionService
) => {
  const verifySession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionId = req.cookies.session_id
      if (!sessionId) {
        res.sendStatus(401)
        return
      }
      const userId = await sessionService.getBySessionId(sessionId)
      if (!userId) {
        res.sendStatus(401)
        return
      }

      req.user = { id: userId }
      next()
    } catch (e) {
      res.sendStatus(401)
    }
  }

  return { verifySession }
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>
