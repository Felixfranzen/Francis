import * as bcrypt from 'bcrypt'

export type Password = string & { readonly Password: unique symbol }

export type PasswordUtils = {
  encrypt: (password: string) => Promise<string>
  isEqual: (password: string, encryptedPassword: string) => Promise<boolean>
}

export const validatePassword = (password: string): Password => {
  const hasCorrectLength = password.length >= 8
  if (!hasCorrectLength) {
    throw new Error('Not a valid password')
  }
  return password as Password
}

export const encrypt = async (password: string) => {
  const encrypted = await bcrypt.hash(password, 10)
  return encrypted // TODO or just string?
}
export const isEqual = (password: string, encryptedPassword: string) =>
  bcrypt.compare(password, encryptedPassword)
