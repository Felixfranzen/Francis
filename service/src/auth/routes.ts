import { Router } from 'express'
import { AuthService } from './auth'

export const createRoutes = (authService: AuthService) => {
  const router = Router()

  router.post('/signup', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const result = await authService.signUp(req.body.email, req.body.password)
    // todo set httpOnly Cookie with jwt token
    res.send(result)
  })

  router.post('/login', async (req, res) => {
    // todo read from httpOnly cookie instead
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const result = await authService.login(req.body.email, req.body.password)
    res.send(result)
  })

  return router
}
