export const getSortDirection = (sortBy?: { id: string; desc: boolean }) => {
  return sortBy ? `${sortBy.id}%2C${sortBy.desc ? 'DESC' : 'ASC'}` : '';
};
