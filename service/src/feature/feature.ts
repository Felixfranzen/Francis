import { Database } from '../database'
import { Flag, getMatchingFlags, getStatus } from './flag'
import { Predicate } from './predicate'
import {
  createFeature,
  createFlag,
  deleteFeature,
  getFlagsByFeatureKey,
} from './queries/index.queries'

export type Feature = {
  name: string
  key: string
  flags: Flag[]
}

export const createRepository = (query: Database['query']) => {
  return {
    getFlagsByFeatureKey: async (key: string) => {
      const result = await query(getFlagsByFeatureKey, { key })
      const flags: Flag[] = result.map((dbFlag) => ({
        ...dbFlag,
        predicates: dbFlag === null ? [] : (dbFlag.predicates as Predicate[]),
      }))
      return flags
    },

    create: async (feature: Feature) => {
      const result = await query(createFeature, feature)
      const featureId = result[0].id
      const flagsToInsert = feature.flags.map((flag) => ({
        ...flag,
        featureId,
        predicates: JSON.stringify(flag.predicates),
      }))

      await Promise.all(flagsToInsert.map((flag) => query(createFlag, flag)))
      return featureId
    },
    delete: async (id: string) => {
      await query(deleteFeature, { id })
    },
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
