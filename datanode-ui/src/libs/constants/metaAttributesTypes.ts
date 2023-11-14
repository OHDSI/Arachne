import { MetaAttributeTypes } from "../enums/MetaAttributeTypes";


export const metaAttributesTypes = [
  {
    name: 'Number',
    value: MetaAttributeTypes.INTEGER,
  },
  {
    name: 'Text',
    value: MetaAttributeTypes.STRING,
  },
  {
    name: 'List of values',
    value: MetaAttributeTypes.ENUM,
  },
  {
    name: 'Multiple values',
    value: MetaAttributeTypes.ENUM_MULTI,
  },
];
