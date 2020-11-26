import { Config } from './config'
import { Pool } from 'pg'
import { PreparedQuery } from '@pgtyped/query'

export type Database = {
  isAlive: () => Promise<boolean>
  migrate: () => Promise<void>
  disconnect: () => Promise<void>
  query: <T, U>(preparedQuery: PreparedQuery<T, U>, params: T) => Promise<U[]>
}

export const createDatabase = async (dbConfig: Config): Promise<Database> => {
  const pool = new Pool({
    host: dbConfig.DB_HOST,
    user: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    port: dbConfig.DB_PORT,
  })

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

  const isAlive = async () => {
    try {
      await pool.query('SELECT 1')
      return true
    } catch (e) {
      return false
    }
  }

  const migrate = async () => {}
  const disconnect = async () => {
    await pool.end()
  }

  return {
    isAlive,
    disconnect,
    migrate,
    query,
  }
}
