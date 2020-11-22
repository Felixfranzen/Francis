import { isValid, matchesPredicates } from './predicate'

describe('Predicate', () => {
  it('matches a value when operator is EQUALS', () => {
    expect(
      isValid('ipsum', {
        operator: 'EQUALS',
        value: 'ipsum',
      })
    ).toBe(true)

    expect(
      isValid('ipsum', {
        operator: 'EQUALS',
        value: 'lorem',
      })
    ).toBe(false)
  })

  it('accepts inputs that matches flag predicates', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const predicates = [
      { key: 'version', value: '1.0', operator: 'EQUALS' as const },
      { key: 'country', value: 'SE', operator: 'EQUALS' as const },
    ]

    const result = matchesPredicates(params, predicates)
    expect(result).toBe(true)
  })

  it('rejects inputs that fails one or several predicates', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const predicates = [
      { key: 'version', value: '1.0', operator: 'EQUALS' as const },
      { key: 'country', value: 'GB', operator: 'EQUALS' as const },
    ]

    const result = matchesPredicates(params, predicates)
    expect(result).toBe(false)
  })

  it('flags without predicates returns enabled', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const result = matchesPredicates(params, [])
    expect(result).toBe(true)
  })
})
