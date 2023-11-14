import { v4 as uuid } from 'uuid';

export const getUUID = () => {
  return uuid();
};

export const getShortUUID = () => {
  return getUUID().split('-')[0];
};

export const getNumberUUID = () => {
  return parseInt(`${Math.random() * 100}`);
};

export const getLongNumberUUID = () => {
  return (
    parseInt(`${Math.random() * 100}`) + parseInt(`${Math.random() * 100}`)
  );
};
