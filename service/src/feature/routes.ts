import { NextFunction, Router, Request, Response } from 'express'
import { FeatureService } from './feature'

export const createRoutes = (
  featureService: FeatureService,
) => {
  const router = Router()

  router.post(
    '/feature',
    async (req, res) => {
      if (!req.body) {
        res.sendStatus(400)
        return
      }

      const { userId } = await parseToken(req.cookies.access_token)
      const result = await featureService.create({ userId, ...req.body })
      res.send(result)
    }
  )

  router.delete(
    '/feature/:id',
    async (req, res) => {
      if (!req.params || !req.params.id) {
        res.sendStatus(400)
        return
      }

      const { userId } = await parseToken(req.cookies.access_token)
      const userHasFeature = await featureService.userHasFeature(
        userId,
        req.params.id
      )
      if (!userHasFeature) {
        res.sendStatus(403)
        return
      }

      await featureService.delete(req.params.id)
      res.send(204)
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

  router.get('/feature', async (req, res) => {
    const { userId } = await parseToken(req.cookies.access_token)
    const result = await featureService.getFeaturesByUserId(userId)
    res.status(200).send(result)
  })

  return router
}
