import { hasMatchingPredicates, Predicate } from './predicate'

export type Flag = {
  name: string
  enabled: boolean
  predicates: Predicate[]
}

export const getMatchingFlags = (
  params: { [key: string]: string | number },
  allFlags: Flag[]
) => allFlags.filter((flag) => hasMatchingPredicates(params, flag.predicates))

export const getStatus = (matchingFeatureFlags: Flag[]) => {
  const result = matchingFeatureFlags.shift()
  return result ? result.enabled : false
}
