export const getItemFromConstantArray = <L, E>(list: L[], value: E) => {
  const item = list.find(elem => elem['value'] === value);
  return item;
};
