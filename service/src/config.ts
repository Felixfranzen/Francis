export type Config = {
  APP_PORT: number
  AUTH_SECRET: string
  DATABASE_URL: string
}

export const parseConfig = (env: any): Config => {
  if (!env.APP_PORT || !env.AUTH_SECRET || !env.DATABASE_URL) {
    throw new Error('Env mismatch')
  }
  return {
    ...env,
    APP_PORT: parseInt(env.APP_PORT),
  }
}
