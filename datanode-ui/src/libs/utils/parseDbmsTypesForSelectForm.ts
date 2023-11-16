// CHECKED
import { sortBy } from "lodash";
import { DBMSType } from "../enums";
import { DBMSTypesInterface, SelectInterface } from "../types";

export const parseDbmsTypesForSelectForm = (
  list: DBMSTypesInterface[]
): SelectInterface<DBMSType>[] => {
  const listSelect: SelectInterface<DBMSType>[] = list.map((item: DBMSTypesInterface) => {
    return {
      name: item.name,
      value: item.id,
    };
  });
  return sortBy(listSelect, elem => elem.name);
};
