import * as express from 'express'
const { Router } = express

export const createRoutes = () => {
  const router = Router()

  router.get('/', (_, res) => {
    res.sendStatus(200)
  })

  return router
}
