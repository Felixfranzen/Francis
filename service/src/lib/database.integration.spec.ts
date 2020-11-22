import { createDatabase, Database } from './database'
import * as dotenv from 'dotenv'
import { parseConfig } from '../config'
dotenv.config()

describe('Database', () => {
  let db: Database
  beforeAll(async () => {
    db = await createDatabase(parseConfig(process.env))
  })
  afterAll(async () => {
    await db.disconnect()
  })

  it('can connect to the database', async () => {
    const isAlive = await db.isAlive()
    expect(isAlive).toBe(true)
  })
})
