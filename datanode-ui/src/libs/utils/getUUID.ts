import { v4 as uuid } from 'uuid';

export const getUUID = (): string => {
  return uuid();
};

export const getShortUUID = (): string => {
  return getUUID().split('-')[0];
};

export const getNumberUUID = (): number => {
  return parseInt(`${Math.random() * 100}`);
};

export const getLongNumberUUID = (): number => {
  return (
    parseInt(`${Math.random() * 100}`) + parseInt(`${Math.random() * 100}`)
  );
};
