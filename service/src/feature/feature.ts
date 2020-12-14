import { Request, Response, NextFunction } from 'express'
import { Database } from '../database'
import { Flag, getMatchingFlags, getStatus } from './flag'
import { Predicate } from './predicate'
import {
  createFeature,
  createFlag,
  deleteFeature,
  selectFlagsByFeatureKey,
  selectFeaturesByUserId,
} from './queries/index.queries'

export type Feature = {
  userId: string
  name: string
  key: string
  flags: Flag[]
}

export const createRepository = (query: Database['query']) => {
  const getFlagsByFeatureKey = async (key: string) => {
    const result = await query(selectFlagsByFeatureKey, { key })
    const flags: Flag[] = result.map((dbFlag) => ({
      ...dbFlag,
      predicates: dbFlag === null ? [] : (dbFlag.predicates as Predicate[]),
    }))
    return flags
  }

  const getFeaturesByUserId = async (userId: string) => {
    const result = await query(selectFeaturesByUserId, { userId })
    return result
  }

  const create = async (feature: Feature) => {
    const result = await query(createFeature, feature)
    const featureId = result[0].id
    const flagsToInsert = feature.flags.map((flag) => ({
      ...flag,
      featureId,
      predicates: JSON.stringify(flag.predicates),
    }))

    await Promise.all(flagsToInsert.map((flag) => query(createFlag, flag)))
    return featureId
  }
  const deleteById = async (id: string) => {
    await query(deleteFeature, { id })
  }

  return {
    getFlagsByFeatureKey,
    getFeaturesByUserId,
    create,
    delete: deleteById,
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

  const userHasFeature = async (userId: string, featureId: string) => {
    const features = await repository.getFeaturesByUserId(userId)
    const ids = features.map((f) => f.id)
    return ids.includes(featureId)
  }

  return {
    getStatus: getFeatureStatus,
    userHasFeature,
    getFeaturesByUserId: repository.getFeaturesByUserId,
    create: repository.create,
    delete: repository.delete,
  }
}

export type FeatureService = ReturnType<typeof createService>
