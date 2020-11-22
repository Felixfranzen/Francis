import { Flag, matchesFlag } from './flag'

export type Feature = {
  name: string
  key: string
  flags: Flag[]
}

export const getStatus = (
  params: { [key: string]: string },
  feature: Feature
) => {
  const flag = feature.flags.filter((flag) => matchesFlag(params, flag)).shift()
  return flag ? flag.enabled : false
}
