type Equality = {
  operator: 'EQUALS'
  key: string
  value: string | number
}

type GreaterThan = {
  operator: 'GREATER_THAN'
  key: string
  value: string | number
}

type Includes = {
  operator: 'INCLUDES'
  key: string
  value: (string | number)[]
}

export type Predicate = Equality | GreaterThan | Includes

export const isValid = (value: string | number, predicate: Predicate) => {
  switch (predicate.operator) {
    case 'EQUALS':
      return predicate.value === value
    case 'GREATER_THAN':
      return value > predicate.value
    case 'INCLUDES':
      return predicate.value.includes(value)
  }
}

export const hasMatchingPredicates = (
  params: { [key: string]: string | number },
  predicates: Predicate[]
) => {
  if (predicates.length === 0) {
    return true
  }

  // TODO: decide if this is expected behavior
  if (predicates.length !== Object.keys(params).length) {
    return false
  }

  return predicates.every((predicate) => {
    const hasKey = params[predicate.key] !== undefined
    return hasKey && isValid(params[predicate.key], predicate)
  })
}
