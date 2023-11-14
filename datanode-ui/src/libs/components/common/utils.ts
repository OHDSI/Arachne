import { setLightness } from 'polished';
import _ from 'lodash';
import { Theme } from '@mui/material';

export const getColor =
  (theme: Theme) =>
  (lightness: number = 0.6, color: string = 'primary') =>
    setLightness(lightness, theme.palette?.[color].main || '#000000');

export const truncate = (
  value: string,
  length: number = 70,
  omission: string = '...',
  separator?: string
): string => {
  return _.truncate(value, {
    length,
    omission,
    ...(separator && { separator }),
  });
};
