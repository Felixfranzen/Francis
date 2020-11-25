import { Database } from '../database'
import * as uuid from 'uuid'

const generateJwtToken = () => ''

const getFullUserByEmail = async (
  query: Database['query'],
  email: string
): Promise<any> => {
  return {
    id: uuid.v4(),
    email: 'kamelixs@live.se',
    password: 'abc123',
  }
}

const createUser = async (
  query: Database['query'],
  email: string,
  saltedAndHashedPassword: string
): Promise<any> => {
  return ''
}

export const createRepository = (query: Database['query']) => {
  return {
    getFullUserByEmail: (email: string) => getFullUserByEmail(query, email),
    createUser: (email: string, saltedAndHashedPassword: string) =>
      createUser(query, email, saltedAndHashedPassword),
  }
}

export type AuthRepository = ReturnType<typeof createRepository>

export const createService = (repository: AuthRepository) => {
  const signUp = async (email: string, password: string) => {
    /* const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    const id = uuidv4() */
    return repository.createUser(email, password)
  }

  const login = async (email: string, password: string) => {
    const result = await repository.getFullUserByEmail(email)
    // bcrypt.compareSync(password, user.password);
    const isCorrectPassword = result.password === password
    if (!isCorrectPassword) {
      throw new Error('Invalid username/password')
    }

    return {
      email: result.email,
      id: result.id,
      token: generateJwtToken(),
    }
  }

  return { signUp, login }
}

export type AuthService = ReturnType<typeof createService>
