import * as uuid from 'uuid'
import { createRepository, Feature, FeatureRepository } from './feature'
import { createDatabase, Database } from '../database'
import { parseConfig } from '../config'
import dotenv from 'dotenv'
import { insertUser } from '../auth/queries/index.queries'
dotenv.config()

describe('Feature', () => {
  describe('Repository', () => {
    let repository: FeatureRepository
    let db: Database
    let userId: string
    beforeAll(async () => {
      db = await createDatabase(parseConfig(process.env))
      repository = createRepository(db.query)

      const result = await db.query(insertUser, {
        email: uuid.v4() + '@felixfranzen.com',
        password: '1234567890',
        role: 'admin',
      })
      userId = result[0].id
    })
    afterAll(async () => {
      await db.disconnect()
    })

    it('can insert a feature', async () => {
      const feature: Feature = {
        userId,
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
        userId,
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
