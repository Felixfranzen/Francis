import { createClient } from 'redis'
import { Config } from './config'

export type Redis = {
  set: (key: string, value: string) => Promise<void>
  setWithExpiration: (
    key: string,
    value: string,
    expirationSeconds: number
  ) => Promise<void>
  get: (val: string) => Promise<string | null>
  delete: (val: string) => Promise<void>
  quit: () => Promise<void>
}

export const createRedis = (config: Config): Redis => {
  const client = createClient({ url: config.REDIS_URL })

  const set = (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      client.set(key, value, (err) => (err ? reject(err) : resolve()))
    })

  const setWithExpiration = (
    key: string,
    value: string,
    expirationSeconds: number
  ) =>
    new Promise<void>((resolve, reject) => {
      client.set(key, value, 'EX', expirationSeconds, (err) =>
        err ? reject(err) : resolve()
      )
    })

  const get = (key: string) =>
    new Promise<string | null>((resolve, reject) => {
      client.get(key, (err, value) => (err ? reject(err) : resolve(value)))
    })

  const del = (key: string) =>
    new Promise<void>((resolve, reject) => {
      client.del(key, (err, value) => (err ? reject(err) : resolve()))
    })
  const quit = () =>
    new Promise<void>((resolve, reject) => {
      client.quit((err) => (err ? reject(err) : resolve()))
    })

  return {
    set,
    setWithExpiration,
    get,
    delete: del,
    quit,
  }
}
