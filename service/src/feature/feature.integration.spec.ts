import * as uuid from 'uuid'
import {
  createRepository,
  createService,
  Feature,
  FeatureRepository,
} from './feature'
import { createDatabase, Database } from '../database'
import * as dotenv from 'dotenv'
import { parseConfig } from '../config'
dotenv.config()

describe('Feature', () => {
  describe('Repository', () => {
    let repository: FeatureRepository
    let db: Database
    beforeAll(async () => {
      db = await createDatabase(parseConfig(process.env))
      await db.migrate()
      repository = createRepository(db.query)
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

      const result = await repository.create(feature)
      expect(result).toBeDefined()
    })

    it('can delete a feature', async () => {
      const feature: Feature = {
        name: uuid.v4(),
        key: uuid.v4(),
        flags: [],
      }

      const result = await repository.create(feature)
      expect(result).toBeDefined()
      await repository.delete(result)
    })
  })
})
