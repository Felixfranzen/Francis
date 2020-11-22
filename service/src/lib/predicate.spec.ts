import { isValid, hasMatchingPredicates } from './predicate'

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

    const result = hasMatchingPredicates(params, predicates)
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

    const result = hasMatchingPredicates(params, predicates)
    expect(result).toBe(false)
  })

  it('flags without predicates returns enabled', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const result = hasMatchingPredicates(params, [])
    expect(result).toBe(true)
  })

  it('returns false if predicates has keys not in params', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const predicates = [
      { key: 'version', value: '1.0', operator: 'EQUALS' as const },
      { key: 'country', value: 'GB', operator: 'EQUALS' as const },
      { key: 'city', value: 'stockholm', operator: 'EQUALS' as const },
    ]

    const result = hasMatchingPredicates(params, predicates)
    expect(result).toBe(false)
  })

  it('returns false if params has keys not in predicates', () => {
    const params = {
      version: '1.0',
      country: 'SE',
      city: 'stockholm',
    }

    const predicates = [
      { key: 'version', value: '1.0', operator: 'EQUALS' as const },
    ]

    const result = hasMatchingPredicates(params, predicates)
    expect(result).toBe(false)
  })
})
