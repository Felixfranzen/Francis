import * as Knex from 'knex'
import { Config } from './config'
import { Pool } from 'pg'

type Query = {
  string: string
  arguments: (string | number | boolean)[]
}

export type Database = {
  isAlive: () => Promise<boolean>
  migrate: () => Promise<void>
  disconnect: () => Promise<void>
  query: Knex
  // TODO Use correct signature
  queryForReal: (query: Query) => Promise<unknown>
}

export const createDatabase = async (dbConfig: Config): Promise<Database> => {
  const pool = new Pool({
    host: dbConfig.DB_HOST,
    user: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    port: dbConfig.DB_PORT,
  })

  const runQuery = async (query: Query) => {
    // TODO specific error handling
    const startTime = Date.now()
    const result = await pool.query(query.string, query.arguments)
    const duration = Date.now() - startTime
    console.log(`QUERY: (${query.string}) | DURATION: ${duration}ms`)
    return result.rows
  }

  const isAlive = async () => {
    try {
      await runQuery({ string: 'SELECT 1', arguments: [] })
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
    query: {} as Knex,
    queryForReal: async (q) => 'success',
  }
}
