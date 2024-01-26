import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects"

import { DELETE_KBASE, GET_KBASES, GET_KBASES_BYID, GET_KBASES_BY_APP, GET_KBASES_BY_APP_SUCCESS, GET_KBASE_TYPE, GET_LATEST_VER_APP, POST_KBASE, PUT_KBASE, RESET_KBASE_STATE } from "./actionTypes"
import { getKbases, getKbasesSuccess, getKbasesByAppSuccess, getKbasesFail, getKbaseTypeSuccess, getKbaseTypeFail, getlatestVerAppSuccess, getlatestVerAppFail, postKbasesSuccess, postKbasesFail } from "./actions"
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, put as xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"
import { getKbasesByAppFail, changeModuleTab, getKbasesByApp, getKbasesByIdSuccess, getKbasesByIdFail, getKbasesById } from "store/actions"

function* fetchKbases(action) {
  try {
      let headers={}
      if(!isEmpty(action.payload.freeToken)){
        headers.Authorization = `Bearer ${action.payload.freeToken}` 
      }
      const response = yield call(() => get(url.UGET_KBASES, {}, headers))
      yield put(getKbasesSuccess(response))
  } catch (error) {
    yield put(getKbasesFail(error))
  }
}

function* fetchKbasesById(action) {
  try {
      let headers={}
      if(!isEmpty(action.payload.freeToken)){
        headers.Authorization = `Bearer ${action.payload.freeToken}` 
      }
      const response = yield call(() => get(url.UGET_KBASES+'/'+action.payload.id, {}, headers))
      yield put(getKbasesByIdSuccess(response))
  } catch (error) {
    console.log(error)
    yield put(getKbasesByIdFail(error))
  }
}

function* fetchKbasesByApp(action) {
  try {
    let headers={}
    if(!isEmpty(action.payload.freeToken)){
      headers.Authorization = `Bearer ${action.payload.freeToken}` 
    }
    const response = yield call(() => get(url.UGET_KBASES_BY_APP + `?app=${action.payload.appId}&module=${action.payload.moduleId}`, {}, headers ))
    yield put(getKbasesByAppSuccess(response))
  } catch (error) {
    yield put(getKbasesByAppFail(error))
  }
}

function* createKbase(action){
  try {
    const response = yield call(() => postForm(url.UPOST_KBASE, action.payload.data))
    yield put(postKbasesSuccess());
    yield put(getKbasesByApp(action.payload.appId, action.payload.moduleId));   
  } catch (error) {
    console.log(error.response)
  }
}


function* updateKbase(action){  
  try {
      const response = yield call(() => postForm(url.UPUT_KBASE+'/'+action.payload.id,  action.payload.data))
      yield put({type: RESET_KBASE_STATE, payload: { modalEditKbase: false } })
      yield put(getKbasesByApp(action.payload.appId, action.payload.moduleId)); 
      yield put(getKbasesById(action.payload.id)) 
  } catch (error) {
    console.log(error)
  }
}
function* deleteKbase(action){  
  try {
      const response = yield call(() => del(url.UDEL_KBASE+'/'+action.payload.id))
      yield put(getKbasesByApp(action.payload.appId, action.payload.moduleId));  
      if(!isEmpty(action.payload.history)){
        action.payload.history.push('/admin/knowledgebase')
      }  
  } catch (error) {
    console.log(error)
  }
}

function* kbasesSaga() {
  yield takeEvery(GET_KBASES, fetchKbases),
  yield takeEvery(GET_KBASES_BYID, fetchKbasesById),
  yield takeEvery(GET_KBASES_BY_APP, fetchKbasesByApp),
  yield takeLatest(POST_KBASE, createKbase),
  yield takeEvery(PUT_KBASE, updateKbase),
  yield takeLatest(DELETE_KBASE, deleteKbase)
}

export default kbasesSaga
