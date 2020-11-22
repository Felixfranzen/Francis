import * as uuid from 'uuid'
import { createFeature, deleteFeature, Feature } from './feature'
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

  it('can insert a feature', async () => {
    const feature: Feature = {
      name: uuid.v4(),
      key: uuid.v4(),
      flags: [],
    }

    const result = await createFeature(db.query, feature)
    expect(result).toBeDefined()
  })

  it('can delete a feature', async () => {
    const feature: Feature = {
      name: uuid.v4(),
      key: uuid.v4(),
      flags: [],
    }

    const result = await createFeature(db.query, feature)
    expect(result).toBeDefined()

    await deleteFeature(db.query, result)
  })
})
