export type Password = string & { readonly Password: unique symbol }

export const validatePassword = (password: string): Password => {
  const hasCorrectLength = password.length >= 8
  if (!hasCorrectLength) {
    throw new Error('Not a valid password')
  }
  return password as Password
}
