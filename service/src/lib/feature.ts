import { Database } from './database'
import { Flag, matchesFlag } from './flag'

export type Feature = {
  name: string
  key: string
  flags: Flag[]
}
