export type Config = {
  PORT: number
  AUTH_SECRET: string
  DATABASE_URL: string
}

export const parseConfig = (env: any): Config => {
  if (!env.PORT || !env.AUTH_SECRET || !env.DATABASE_URL) {
    throw new Error('Env mismatch')
  }
  return {
    ...env,
    PORT: parseInt(env.PORT),
  }
}
