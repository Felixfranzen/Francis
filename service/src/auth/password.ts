import * as bcrypt from 'bcrypt'

export type Password = string & { readonly Password: unique symbol }

export const validatePassword = (password: string): Password => {
  const hasCorrectLength = password.length >= 8
  if (!hasCorrectLength) {
    throw new Error('Not a valid password')
  }
  return password as Password
}

export const encrypt = async (password: Password) => {
  const encrypted = await bcrypt.hash(password, 10)
  return encrypted as Password // TODO or just string?
}
export const isEqual = (password: Password, encryptedPassword: string) =>
  bcrypt.compare(password, encryptedPassword)
