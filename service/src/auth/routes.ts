import { Router } from 'express'
import { AuthService } from './auth'

export const createRoutes = (
  authService: AuthService,
) => {
  const router = Router()

  router.post('/signup', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const { sessionId } = await authService.signUp(req.body.email, req.body.password)
    // todo send verification token
    res.cookie('session_id', sessionId, {
      maxAge: 900000,
      httpOnly: true,
    })
    res.send(200)
  })

  router.post('/login', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    try {
      const { sessionId } = await authService.login(req.body.email, req.body.password)
      res.cookie('session_id', sessionId, {
        maxAge: 900000,
        httpOnly: true,
      })

      res.send(200)
    } catch (e) {
      res.sendStatus(401)
    }
  })

  router.post('/verify', async (req, res) => {
    if (!req.query || !req.query.token || req.query.user_id) {
      res.sendStatus(400)
      return
    }

    try {
      await authService.verifyUser(req.query.user_id as string, req.query.token as string)
      res.sendStatus(201)
    } catch (e) {
      res.sendStatus(400)
    }
  })

  router.get('/me', async (req, res) => {
    if (!req.cookies.access_token) {
      res.sendStatus(400)
    }
    const result = await authService.me(req.cookies.access_token)
    res.status(200).send(result)
  })

  return router
}
