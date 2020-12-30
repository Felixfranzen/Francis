import { createRedis, Redis } from './redis'
import * as dotenv from 'dotenv'
import { parseConfig } from './config'
import * as uuid from 'uuid'
dotenv.config()

describe('Redis', () => {
  let redis: Redis
  beforeAll(() => {
    redis = createRedis(parseConfig(process.env))
  })
  afterAll(async () => {
    await redis.quit()
  })

  it('can call', async () => {
    const key = uuid.v4()
    const value = uuid.v4()
    await redis.set(key, value)
    const result = await redis.get(key)
    expect(result).toBe(value)
  })

  it('can quit', async () => {
    await redis.quit()
    expect(async () => redis.set('a', 'a')).rejects.toBeDefined()
  })
})
