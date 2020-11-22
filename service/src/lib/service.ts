import { Database } from './database'
import { Feature, createFeature } from './feature'
import { getFlagsByFeatureKey, isEnabled } from './flag'

export const createService = (query: Database['query']) => {
  const getFeatureStatus = async (
    key: string,
    params: { [key: string]: string }
  ): Promise<boolean> => {
    const flags = await getFlagsByFeatureKey(query, key)
    return isEnabled(params, flags)
  }

  return {
    getFeatureStatus,
    createFeature: (feature: Feature) => createFeature(query, feature),
  }
}

export type Service = ReturnType<typeof createService>
