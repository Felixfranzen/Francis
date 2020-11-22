type Operator = 'EQUALS'

export type Predicate = {
  operator: Operator
  key: string
  value: string
}

export const isValid = (
  value: string,
  predicate: { value: string; operator: Operator }
) => {
  switch (predicate.operator) {
    case 'EQUALS':
      return predicate.value === value
  }
}

export const matchesPredicates = (
  params: { [key: string]: string },
  predicates: Predicate[]
) =>
  predicates.every((predicate) => {
    const hasKey = params[predicate.key] !== undefined
    return hasKey && isValid(params[predicate.key], predicate)
  })
