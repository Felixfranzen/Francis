import * as Knex from 'knex'
import { Config } from '../config'

export type Database = {
  isAlive: () => Promise<boolean>
  migrate: () => Promise<void>
  disconnect: () => Promise<void>
  query: Knex
}

export const createDatabase = async (dbConfig: Config): Promise<Database> => {
  const config: Knex.Config = {
    client: 'postgresql',
    connection: {
      host: dbConfig.DB_HOST,
      user: dbConfig.DB_USER,
      password: dbConfig.DB_PASSWORD,
      database: dbConfig.DB_NAME,
      port: dbConfig.DB_PORT,
    },
    migrations: {
      directory: dbConfig.DB_MIGRATIONS.DIRECTORY,
      tableName: dbConfig.DB_MIGRATIONS.TABLE_NAME,
    },
    log: {
      warn: (message) => console.warn(message),
      error: (message) => console.error(message),
      debug: (message) => console.log(message),
    },
  }
  const knex = Knex(config)

  const migrate = async () => {
    await knex.migrate.latest()
  }

  const isAlive = async () => {
    try {
      await knex.raw('select 1')
      return true
    } catch (e) {
      return false
    }
  }

  const disconnect = async () => {
    knex.destroy()
  }

  return { isAlive, disconnect, migrate, query: knex }
}
