export type Config = {
  PORT: number
  AUTH_SECRET: string
  DATABASE_URL: string
  REDIS_URL: string
}

export const parseConfig = (env: any): Config => {
  if (env.NODE_ENV === 'production' && !env.REDIS_URL) {
    throw new Error('Missing REDIS_URL in production')
  }

  if (!env.PORT || !env.AUTH_SECRET || !env.DATABASE_URL) {
    throw new Error('Env mismatch')
  }

  return {
    ...env,
    PORT: parseInt(env.PORT),
  }
}
