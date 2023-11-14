

// TODO 17-11-2022

import { sortBy } from "lodash";
import { DBMSType } from "../enums";

export const parseDbmsTypesForSelectForm = (
  list: any
): any[] => {
  const listSelect = Object.keys(list).map((itemId: DBMSType) => {
    return {
      name: list[itemId]?.label || itemId,
      value: itemId,
    };
  });
  return sortBy(listSelect, elem => elem.name);
};
