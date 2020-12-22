import { Config } from './config'
import { Pool } from 'pg'
import { PreparedQuery } from '@pgtyped/query'

export type Database = {
  isAlive: () => Promise<boolean>
  disconnect: () => Promise<void>
  query: <T, U>(preparedQuery: PreparedQuery<T, U>, params: T) => Promise<U[]>
}

export const createDatabase = async (config: Config): Promise<Database> => {
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
  })

  try {
    await pool.query('SELECT 1')
  } catch (e) {
    throw new Error(`Failed to connect to DB ${e}`)
  }

  const isAlive = async () => {
    try {
      await pool.query('SELECT 1')
      return true
    } catch (e) {
      return false
    }
  }

  const query = async <T, U>(preparedQuery: PreparedQuery<T, U>, params: T) => {
    const client = await pool.connect()
    try {
      // TODO specific error handling
      const result = await preparedQuery.run(params, client)
      client.release()
      return result
    } catch (e) {
      console.log(e)
      client.release()
      throw new Error('Query failed')
    }
  }

  const disconnect = async () => {
    await pool.end()
  }

  return {
    isAlive,
    disconnect,
    query,
  }
}
