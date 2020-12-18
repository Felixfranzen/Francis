import * as dotenv from 'dotenv'
import { createApp } from './app'
import { parseConfig } from './config'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const run = async () => {
  const config = parseConfig(process.env)
  const app = await createApp(config)
  app.start()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
