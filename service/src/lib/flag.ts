import { Database } from './database'
import { hasMatchingPredicates, Predicate } from './predicate'

export type Flag = {
  name: string
  enabled: boolean
  predicates: Predicate[]
}

export const isEnabled = (params: { [key: string]: string }, flags: Flag[]) => {
  const flag = flags
    .filter((flag) => hasMatchingPredicates(params, flag.predicates))
    .shift()
  return flag ? flag.enabled : false
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
