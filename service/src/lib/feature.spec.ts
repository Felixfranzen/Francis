import { Feature, getStatus } from './feature'

describe('Feature', () => {
  it('features without flags are not enabled', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }
    const feature: Feature = {
      key: '',
      name: '',
      flags: [],
    }

    expect(getStatus(params, feature)).toBe(false)
  })

  it('can get flag status for a feature', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const feature: Feature = {
      key: '',
      name: '',
      flags: [
        {
          name: '',
          enabled: true,
          predicates: [],
        },
      ],
    }

    expect(getStatus(params, feature)).toBe(true)
  })

  it('uses the first flag status if multiple match', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }

    const feature: Feature = {
      key: '',
      name: '',
      flags: [
        {
          name: '',
          enabled: true,
          predicates: [],
        },
        {
          name: '',
          enabled: false,
          predicates: [],
        },
      ],
    }

    expect(getStatus(params, feature)).toBe(true)
  })
})
