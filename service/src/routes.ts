import * as express from 'express'
import { Service } from './lib/service'
const { Router } = express

export const createRoutes = (service: Service) => {
  const router = Router()

  router.post('/feature', async (req, res) => {
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
