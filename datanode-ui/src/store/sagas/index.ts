import { userSaga } from '../modules/user';
import { all, spawn } from 'redux-saga/effects';

const rootSaga = function* () {
  yield all([spawn(userSaga)]);
};

export default rootSaga;
