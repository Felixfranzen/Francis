export type Config = {
  // NODE
  APP_PORT: number

  // DATABASE
  DB_HOST: string
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  DB_PORT: number
  DB_MIGRATIONS: {
    DIRECTORY: string
    TABLE_NAME: string
  }

}

export const parseConfig = (env: any): Config => {
  if (
    !env.APP_PORT ||
    !env.DB_HOST ||
    !env.DB_USER ||
    !env.DB_PASSWORD ||
    !env.DB_NAME ||
    !env.DB_PORT
  ) {
    throw new Error('Env mismatch')
  }
  return {
    ...env,
    APP_PORT: parseInt(env.APP_PORT),
    DB_PORT: parseInt(env.DB_PORT),
    DB_MIGRATIONS: {
      DIRECTORY: `${__dirname}/migrations`,
      TABLE_NAME: 'knex_migrations',
    },
  }
}
