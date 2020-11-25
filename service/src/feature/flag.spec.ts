import { Flag, getMatchingFlags, getStatus } from './flag'
import * as dotenv from 'dotenv'
import { parseConfig } from '../config'
dotenv.config()

describe('Flag', () => {
  it('can get matching flags by params and predicate', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }
    const flags: Flag[] = [
      {
        name: 'one',
        enabled: true,
        predicates: [
          { key: 'version', value: '1.0', operator: 'EQUALS' },
          { key: 'country', value: 'SE', operator: 'EQUALS' },
        ],
      },
    ]

    expect(getMatchingFlags(params, flags)).toEqual(flags)
  })
  it('discards flags that where predicate fails', () => {
    const params = {
      version: '1.0',
      country: 'SE',
    }
    const flags: Flag[] = [
      {
        name: 'one',
        enabled: true,
        predicates: [],
      },
      {
        name: 'two',
        enabled: true,
        predicates: [
          { key: 'version', value: '3.0', operator: 'EQUALS' },
          { key: 'country', value: 'GB', operator: 'EQUALS' },
        ],
      },
    ]

    expect(getMatchingFlags(params, flags)).toEqual([flags[0]])
  })

  it('selects status of first flag in list of matches', () => {
    const flags: Flag[] = [
      {
        name: 'one',
        enabled: true,
        predicates: [],
      },
      {
        name: 'two',
        enabled: false,
        predicates: [],
      },
    ]

    expect(getStatus(flags)).toEqual(true)
  })

  it('status is false if no matches', () => {
    expect(getStatus([])).toEqual(false)
  })
})
