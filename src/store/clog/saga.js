import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects"

import { DELETE_CLOG, GET_CLOGS, GET_CLOG_TYPE, GET_LATEST_CLOG, GET_LATEST_VER_APP, POST_CLOG, PUT_CLOG, RESET_CLOG_STATE } from "./actionTypes"
import { getCLogs, getCLogsSuccess, getCLogsFail, getCLogTypeSuccess, getCLogTypeFail, getlatestVerAppSuccess, getlatestVerAppFail, postCLogsSuccess, postCLogsFail } from "./actions"
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"
import { getlatestCLogFail, getlatestCLogSuccess } from "store/actions"

function* fetchCLogs(action) {
  try {
      let appid;
      if(isEmpty(action.payload)){
        appid = yield select((state) =>  state.clog.appActive.id);
      }
      else {
        appid = action.payload;
      }
      const response = yield call(() => get(url.UGET_CLOGS+'/'+appid))
      yield put(getCLogsSuccess(response))
  } catch (error) {
    yield put(getCLogsFail(error))
  }
}
function* fetchCLogType() {
  try {
      const response = yield call(() => get(url.UGET_CLOGTYPE))
      yield put(getCLogTypeSuccess(response))
  } catch (error) {
    yield put(getCLogTypeFail(error))
  }
}
function* fetchLatestVerApp(action) {
  try {
      const response = yield call(() => get(url.UGET_LAST_VERAPP+'/'+action.payload ))
      yield put( getlatestVerAppSuccess (response))
  } catch (error) {
    yield put(getlatestVerAppFail(error))
  }
}

function* createCLog(action){  
  try {
      const response = yield call(() => postForm(url.UPOST_CLOG,  action.payload))
      yield put(postCLogsSuccess());
      yield put(getCLogs());  
  } catch (error) {
    yield put(postCLogsFail(error))
    console.log(error)
  }
}
function* updateCLog(action){  
  try {
      const response = yield call(() => postForm(url.UPUT_CLOG+'/'+action.payload.id,  action.payload.formData))

      yield put({type: RESET_CLOG_STATE, payload: { modalEditCLog: false } })
      yield put(getCLogs());  
  } catch (error) {
    console.log(error)
  }
}
function* deleteCLog(action){  
  try {
      const response = yield call(() => del(url.UDEL_CLOG+'/'+action.payload))
      yield put(getCLogs());  
  } catch (error) {
    console.log(error)
  }
}
function* fetchLatestCLogs() {
  try {
      const response = yield call(() => get(url.UGET_LATEST_CLOG))
      yield put(getlatestCLogSuccess(response))
  } catch (error) {
    yield put(getlatestCLogFail(error))
  }
}
function* clogsSaga() {
  yield takeEvery(GET_CLOGS, fetchCLogs),
  yield takeEvery(GET_CLOG_TYPE, fetchCLogType),
  yield takeEvery(GET_LATEST_VER_APP, fetchLatestVerApp),
  yield takeLatest(POST_CLOG, createCLog),
  yield takeEvery(PUT_CLOG, updateCLog),
  yield takeLatest(DELETE_CLOG, deleteCLog),
  yield takeEvery(GET_LATEST_CLOG, fetchLatestCLogs)
}

export default clogsSaga
