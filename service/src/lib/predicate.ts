type Operator = 'EQUALS'

export type Predicate = {
  operator: Operator
  key: string
  value: string
}

export const matchesPredicate = (
  value: string,
  predicate: { value: string; operator: Operator }
) => {
  switch (predicate.operator) {
    case 'EQUALS':
      return predicate.value === value
  }
}
