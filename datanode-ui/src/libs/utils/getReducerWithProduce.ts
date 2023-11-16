// CHECKED

import { produce } from 'immer';

export const getReducerWithProduce = <T>(
  state: T,
  reducer: (draft: T) => void
) => {
  return produce(state, reducer);
};
