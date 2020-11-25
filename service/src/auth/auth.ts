import { Database } from '../database'
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'

const generateJwtToken = () => ''

const getFullUserByEmail = async (query: Database['query'], email: string) => {
  const result = await query.select('*').from('user').where({ email }).limit(1)
  if (!result) {
    return
  }

  return result[0]
}

const createUser = async (
  query: Database['query'],
  email: string,
  hashedPassword: string
) => {
  const featureIds = await query
    .table('user')
    .insert({ email, password: hashedPassword })
    .returning('id')

  // todo validate and fix :)))
  const userId = featureIds[0] as string
  return userId
}

export const createRepository = (query: Database['query']) => {
  return {
    getFullUserByEmail: (email: string) => getFullUserByEmail(query, email),
    createUser: (email: string, hashedPassword: string) =>
      createUser(query, email, hashedPassword),
  }
}

export type AuthRepository = ReturnType<typeof createRepository>

export const createService = (repository: AuthRepository) => {
  const signUp = async (email: string, password: string) => {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const userId = await repository.createUser(email, hashedPassword)
    return {
      email: email,
      id: userId,
      token: generateJwtToken(),
    }
  }

  const login = async (email: string, password: string) => {
    const user = await repository.getFullUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Invalid username/password')
    }

    return {
      email: user.email,
      id: user.id,
      token: generateJwtToken(),
    }
  }

  return { signUp, login }
}

export type AuthService = ReturnType<typeof createService>
