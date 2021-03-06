import {call, put, takeLatest} from 'redux-saga/effects';

import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';

import {deleteUser} from 'admin/actions';
import AdminApi from 'admin/api';


function* sagaWorker(action) {
  try {
    const userID = action.payload.userID;
    yield call(AdminApi.deleteUser, userID);
    yield put(deleteUser.success({userID}));
    yield flashSuccess(`Successfully deleted user ${action.payload.name}.`);
    yield call(goTo(PATHS.ManageUsers));
  } catch (error) {
    yield* defaultHandleError(error, deleteUser);
  } finally {
    yield put(deleteUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(deleteUser.REQUEST, sagaWorker);
}
