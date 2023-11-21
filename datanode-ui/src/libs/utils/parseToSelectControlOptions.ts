import { SelectInterface } from "../types"

export const parseToSelectControlOptions = <Option, Value>
  (options: Option[], name: string = 'name', value: string = 'id'): SelectInterface<Value>[] => {
  return options.map((option: Option) => {
    return {
      name: option[name],
      value: option[value]
    }
  })
}