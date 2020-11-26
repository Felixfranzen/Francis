import * as uuid from 'uuid'
import { createRepository, Feature, FeatureRepository } from './feature'
import { createDatabase, Database } from '../database'
import { parseConfig } from '../config'
import * as dotenv from 'dotenv'
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
        flags: [
          {
            name: 'aabbcc',
            enabled: true,
            predicates: [{ key: 'a', operator: 'EQUALS', value: 'a' }],
          },
        ],
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
