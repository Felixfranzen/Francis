import { Flag, matchesFlag } from './flag'

describe('Flag', () => {
  it('accepts inputs that matches flag predicates', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const flag: Flag = {
      name: '',
      enabled: true,
      predicates: [
        { key: 'version', value: '1.0', operator: 'EQUALS' },
        { key: 'country', value: 'SE', operator: 'EQUALS' },
      ],
    }

    const result = matchesFlag(params, flag)
    expect(result).toBe(true)
  })

  it('rejects inputs that fails one or several predicates', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const flag: Flag = {
      name: '',
      enabled: true,
      predicates: [
        { key: 'version', value: '1.0', operator: 'EQUALS' },
        { key: 'country', value: 'GB', operator: 'EQUALS' },
      ],
    }

    const result = matchesFlag(params, flag)
    expect(result).toBe(false)
  })

  it('flags without predicates returns enabled', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const flag: Flag = {
      name: '',
      enabled: true,
      predicates: [],
    }

    const result = matchesFlag(params, flag)
    expect(result).toBe(true)
  })
})
