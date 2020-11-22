import { Database } from './database'
import { getFlagsByFeatureKey, isEnabled } from './flag'

export const createService = (query: Database['query']) => {
  const getFeatureStatus = async (
    key: string,
    params: { [key: string]: string }
  ): Promise<boolean> => {
    const flags = await getFlagsByFeatureKey(query, key)
    return isEnabled(params, flags)
  }

  return { getFeatureStatus }
}

export type Service = ReturnType<typeof createService>
