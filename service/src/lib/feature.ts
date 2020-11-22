import { Database } from './database'
import { Flag } from './flag'

export type Feature = {
  name: string
  key: string
  flags: Flag[]
}

export const createFeature = async (
  query: Database['query'],
  feature: Feature
) => {
  const featureIds = await query
    .table('feature')
    .insert({ name: feature.name, key: feature.key })
    .returning('id')

  // todo validate and fix :)))
  const featureId = featureIds[0] as string

  const flagsToInsert = feature.flags.map((flag) => ({
    feature_id: featureId,
    ...flag,
  }))

  await query.table('flags').insert(flagsToInsert)

  return featureId
}

export const deleteFeature = async (query: Database['query'], id: string) => {
  await query.table('feature').delete().where({ id })
}
