import { Database } from '../database'
import { Flag, getMatchingFlags, getStatus } from './flag'

export type Feature = {
  name: string
  key: string
  flags: Flag[]
}

const createFeature = async (query: Database['query'], feature: Feature) => {
  const featureIds = await query
    .table('feature')
    .insert({ name: feature.name, key: feature.key })
    .returning('id')

  // todo validate and fix :)))
  const featureId = featureIds[0] as string

  const flagsToInsert = feature.flags.map((flag) => ({
    feature_id: featureId,
    ...flag,
    predicates: JSON.stringify(flag.predicates),
  }))

  await query.table('flag').insert(flagsToInsert)

  return featureId
}

const deleteFeature = async (query: Database['query'], id: string) => {
  await query.table('feature').delete().where({ id })
}

const getFlagsByFeatureKey = async (
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

export const createRepository = (query: Database['query']) => {
  return {
    getFlagsByFeatureKey: (key: string) => getFlagsByFeatureKey(query, key),
    create: (feature: Feature) => createFeature(query, feature),
    delete: (id: string) => deleteFeature(query, id),
  }
}

export type FeatureRepository = ReturnType<typeof createRepository>

export const createService = (repository: FeatureRepository) => {
  const getFeatureStatus = async (
    key: string,
    params: { [key: string]: string | number }
  ): Promise<boolean> => {
    const allFlags = await repository.getFlagsByFeatureKey(key)
    return getStatus(getMatchingFlags(params, allFlags))
  }

  return {
    getStatus: getFeatureStatus,
    create: repository.create,
    delete: repository.delete,
  }
}

export type FeatureService = ReturnType<typeof createService>
