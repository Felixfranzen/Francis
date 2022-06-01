import { Router } from 'express'
import { AuthMiddleware } from '../auth/middleware'
import { FeatureService } from './feature'

export const createRoutes = (
  featureService: FeatureService,
  authMiddleware: AuthMiddleware
) => {
  const router = Router()

  router.post(
    '/feature',
    authMiddleware.verifySession,
    async (req, res) => {
      if (!req.body || !req.user) {
        res.sendStatus(400)
        return
      }

      const result = await featureService.create({ userId: req.user.id, ...req.body })
      res.send(result)
    }
  )

  router.delete(
    '/feature/:id',
    authMiddleware.verifySession,
    async (req, res) => {
      if (!req.params || !req.params.id || !req.user) {
        res.sendStatus(400)
        return
      }

      const userHasFeature = await featureService.userHasFeature(
        req.user?.id,
        req.params.id
      )
      if (!userHasFeature) {
        res.sendStatus(403)
        return
      }

      await featureService.delete(req.params.id)
      res.sendStatus(204)
    }
  )

  router.post(
    '/feature/status',
    async (req, res) => {
      if (!req.body || !req.body.feature_key || !req.body.params) {
        res.sendStatus(400)
        return
      }
      const { feature_key, params } = req.body
      const result = await featureService.getStatus(feature_key, params)
      res.send(result)
    }
  )

  router.get('/feature', authMiddleware.verifySession, async (req, res) => {
    if (!req.user) {
      res.sendStatus(500)
      return
    }

    const result = await featureService.getFeaturesByUserId(req.user.id)
    res.status(200).send(result)
  })

  return router
}
