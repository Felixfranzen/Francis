import { matchesPredicate } from './predicate'

describe('Predicate', () => {
  it('matches a value when operator is EQUALS', () => {
    expect(
      matchesPredicate('ipsum', {
        operator: 'EQUALS',
        value: 'ipsum',
      })
    ).toBe(true)

    expect(
      matchesPredicate('ipsum', {
        operator: 'EQUALS',
        value: 'lorem',
      })
    ).toBe(false)
  })
})
