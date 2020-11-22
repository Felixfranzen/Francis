import * as dotenv from 'dotenv'
import { createApp } from './app'

if (process.env.NODE_ENV) {
  dotenv.config()
}

const { SERVICE_PORT } = process.env
if (!SERVICE_PORT) {
  throw new Error('SERVICE_PORT missing from process.env')
}

const port = parseInt(SERVICE_PORT)
if (!port) {
  throw new Error('Could not parse PORT to integer')
}

const app = createApp({ port })
app.start()
