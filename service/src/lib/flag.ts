import { Database } from './database'
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

export const getFlagsByFeatureKey = async (
  query: Database['query'],
  key: string
): Promise<Flag[]> => {
  const result = await query
    .select('flag.name as name', 'enabled', 'predicates')
    .from('feature')
    .join('flag', 'flag.feature_id', 'feature.id')
    .where('key', key)

  // TODO VALIDATE THIS :))
  return result as Flag[]
}
