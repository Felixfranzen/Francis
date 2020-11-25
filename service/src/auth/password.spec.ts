import { validatePassword } from './password'

describe('Password', () => {
  it('can verify a password', () => {
    const failingPassword = 'empty'
    expect(() => validatePassword(failingPassword)).toThrow()

    const successfulPassword = '1234567890'
    expect(validatePassword(successfulPassword)).toBe(successfulPassword)
  })
})
