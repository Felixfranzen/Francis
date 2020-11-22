import { createDatabase, Database } from './database'
import { Flag, getFlagsByFeatureKey, isEnabled } from './flag'
import * as dotenv from 'dotenv'
import { parseConfig } from '../config'
dotenv.config()

describe('Flag', () => {
  it('features without flags are not enabled', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }
    const flags: Flag[] = []

    expect(isEnabled(params, flags)).toBe(false)
  })

  it('can get flag status for a feature', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }
    const flags = [
      {
        name: '',
        enabled: true,
        predicates: [],
      },
    ]

    expect(isEnabled(params, flags)).toBe(true)
  })

  it('uses the first flag status if multiple match', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const flags = [
      {
        name: '',
        enabled: true,
        predicates: [],
      },
      {
        name: '',
        enabled: false,
        predicates: [],
      },
    ]

    expect(isEnabled(params, flags)).toBe(true)
  })

  describe('queries', () => {
    let db: Database
    beforeAll(async () => {
      db = await createDatabase(parseConfig(process.env))
      await db.migrate()
    })
    afterAll(async () => {
      await db.disconnect()
    })

    it('can get feature by key', async () => {
      await getFlagsByFeatureKey(db.query, 'FEATURE KEY')
    })
  })
})
