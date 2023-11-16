export const getSortDirection = (sortBy?: { id: string; desc: boolean }) => {
  return sortBy ? `${sortBy.id},${sortBy.desc ? 'desc' : 'asc'}` : '';
};
