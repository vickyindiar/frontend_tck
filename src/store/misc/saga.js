import { call, put, takeEvery } from "redux-saga/effects"

import { GET_APPS } from "./actionTypes"
import { getAppsSuccess, getAppsFail } from "./actions"
import * as url from "../../helpers/url_helper"
import { del, get, post, xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"

function* fetchApps(action) {
  try {
      let headers={}
      if(!isEmpty(action.payload.token)){
        headers.Authorization = `Bearer ${action.payload.token}` 
      }
      const response = yield call(() => get(url.UGET_APPS, {}, headers))
      yield put(getAppsSuccess(response))
  } catch (error) {
    yield put(getAppsFail(error))
  }
}

function* miscsSaga() {
  yield takeEvery(GET_APPS, fetchApps)
}

export default miscsSaga
