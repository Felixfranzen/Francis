import { matchesPredicate, Predicate } from './predicate'

export type Flag = {
  name: string
  enabled: boolean
  predicates: Predicate[]
}

export const matchesFlag = (params: { [key: string]: string }, flag: Flag) =>
  flag.predicates.every((predicate) => {
    const hasKey = params[predicate.key] !== undefined
    return hasKey && matchesPredicate(params[predicate.key], predicate)
  })
