import { Router } from 'express'
import { AuthMiddleware, AuthService } from './auth'

export const createRoutes = (
  middleware: AuthMiddleware,
  authService: AuthService,
) => {
  const router = Router()

  router.post('/signup', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const result = await authService.signUp(req.body.email, req.body.password)
    // todo send verification token
    res.cookie('access_token', result.token, {
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
      const result = await authService.login(req.body.email, req.body.password)
      res.cookie('access_token', result.token, {
        maxAge: 900000,
        httpOnly: true,
      })
      res.send(200)
    } catch (e) {
      res.sendStatus(401)
    }
  })

  router.post('/verify', async (req, res) => {
    if (!req.query) {
      res.sendStatus(400)
      return
    }

    try {
      await authService.verifyUser(req.query.token as string)
      res.sendStatus(201)
    } catch (e) {
      res.sendStatus(400)
    }
  })

  router.get('/me', middleware.verifyToken, async (req, res) => {
    const { userId } = await authService.parseToken(req.cookies.access_token)

    const result = await authService.getUserById(userId)
    res.status(200).send(result)
  })

  return router
}
