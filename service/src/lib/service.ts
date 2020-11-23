import { Database } from './database'
import { Feature, createFeature, deleteFeature } from './feature'
import { getFlagsByFeatureKey, isEnabled } from './flag'

export const createService = (query: Database['query']) => {
  const getFeatureStatus = async (
    key: string,
    params: { [key: string]: string | number }
  ): Promise<boolean> => {
    const flags = await getFlagsByFeatureKey(query, key)
    return isEnabled(params, flags)
  }

  return {
    getFeatureStatus,
    createFeature: (feature: Feature) => createFeature(query, feature),
    deleteFeature: (id: string) => deleteFeature(query, id),
  }
}

export type Service = ReturnType<typeof createService>
