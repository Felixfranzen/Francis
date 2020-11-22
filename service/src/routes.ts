import * as express from 'express'
import { Service } from './lib/service'
const { Router } = express

export const createRoutes = (service: Service) => {
  const router = Router()

  router.post('/feature', async (req, res) => {
    if (!req.body) {
      res.sendStatus(400)
      return
    }

    const result = await service.createFeature(req.body)
    res.send(result)
  })

  router.delete('/feature/:id', async (req, res) => {
    if (!req.params || !req.params.id) {
      res.sendStatus(400)
      return
    }

    await service.deleteFeature(req.params.id)
    res.send(204)
  })

  router.post('/feature/status', async (req, res) => {
    if (!req.body || !req.body.feature_key || !req.body.params) {
      res.sendStatus(400)
      return
    }
    const { feature_key, params } = req.body
    const result = await service.getFeatureStatus(feature_key, params)
    res.send(result)
  })

  return router
}
