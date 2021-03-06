import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {forgotPassword} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    const {email} = action.payload;
    yield call(AccountApi.forgotPassword, {email});
    yield put(forgotPassword.success());
    yield flashSuccess(`A password reset link has been sent to ${email}`);
  } catch (error) {
    yield* defaultHandleError(error, forgotPassword);
  } finally {
    yield put(forgotPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(forgotPassword.REQUEST, sagaWorker);
}
