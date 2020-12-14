import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

export const createMockApp = () => {
  const app = express()
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  return app
}
