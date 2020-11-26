import { Router } from 'express'
import { AuthMiddleware } from '../auth/auth'
import { FeatureService } from './feature'

export const createRoutes = (
  authMiddleware: AuthMiddleware,
  featureService: FeatureService
) => {
  const router = Router()
  // router.use(authMiddleware.verifyToken)
  // router.use(authMiddleware.verifyFeatureAccess())
  // verifyUseraccess = (req) =>
  // 1. get user_id from jwt token
  // 2. check if token.user_id is same as req.params.user_id


  router.post('/feature', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const result = await featureService.create(req.body)
    res.send(result)
  })

  router.delete('/feature/:id', async (req, res) => {
    if (!req.params || !req.params.id) {
      res.sendStatus(400)
      return
    }

    await featureService.delete(req.params.id)
    res.send(204)
  })

  router.post('/feature/status', async (req, res) => {
    if (!req.body || !req.body.feature_key || !req.body.params) {
      res.sendStatus(400)
      return
    }
    const { feature_key, params } = req.body
    const result = await featureService.getStatus(feature_key, params)
    res.send(result)
  })

  return router
}
