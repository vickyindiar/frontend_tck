import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects"
import { GET_GROUP_AGENCY, GET_AGENCY} from "./actionTypes"
import { POST_GROUP_AGENCY, DELETE_GROUP_AGENCY, PUT_GROUP_AGENCY } from "./actionTypes"
import { POST_AGENCY, DELETE_AGENCY, PUT_AGENCY } from "./actionTypes"
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, put as xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"
import { getGroupAgency, getGroupAgencySuccess, getGroupAgencyFail } from "store/actions"
import { getAgency, getAgencySuccess, getAgencyFail } from "store/actions"
import { postGroupAgencySuccess, postGroupAgencyFail } from "store/actions"
import { delGroupAgencySuccess, delGroupAgencyFail } from "store/actions"
import { putGroupAgencySuccess, putGroupAgencyFail } from "store/actions"
import { postAgencySuccess, postAgencyFail } from "store/actions"
import { delAgencySuccess, delAgencyFail } from "store/actions"
import { putAgencySuccess, putAgencyFail } from "store/actions"

function* fetchGroupAgencies(action) {
  try {
      let headers={}
      if(!isEmpty(action.payload.token)){
        headers.Authorization = `Bearer ${action.payload.token}` 
      }
      const response = yield call(() => get(url.UGET_GROUP_AGENCIES, {}, headers))
      const response2 = yield call(() => get(url.UGET_AGENCIES,  {}, headers))
      yield put(getGroupAgencySuccess(response))
      yield put(getAgencySuccess(response2))
  } catch (error) {
    yield put(getGroupAgencyFail(error))
  }
}

function* fetchAgencies() {
  try {
      let headers={}
      if(!isEmpty(action.payload.token)){
        headers.Authorization = `Bearer ${action.payload.token}` 
      }
      const response = yield call(() => get(url.UGET_AGENCIES,  {}, headers))
      yield put(getAgencySuccess(response))
      
  } catch (error) {
    yield put(getAgencyFail(error))
  }
}

function* createGroupAgency(action){  
  try {
      const response = yield call(() => post(url.UPOST_GROUP_AGENCY, action.payload.data))
      yield put(postGroupAgencySuccess(response, action.payload.changes));
  } catch (error) {
    yield put(postGroupAgencyFail(error))
    console.log(error)
  }
}
function* updateGroupAgency(action){  
  try {
      const response = yield call(() => post(url.UPUT_GROUP_AGENCY+'/'+action.payload.id, action.payload.data))
      yield put(putGroupAgencySuccess())
      yield put(getGroupAgency())
  } catch (error) {
    console.log(error)
  }
}
function* deleteGroupAgency(action){  
  try {
      const response = yield call(() => del(url.UDEL_GROUP_AGENCY+'/'+action.payload))
      yield put(delGroupAgencySuccess())
      yield put(getGroupAgency());  
  } catch (error) {
    console.log(error)
  }
}

function* createAgency(action){  
  try {
      const response = yield call(() => post(url.UPOST_AGENCY, action.payload.data))
      yield put(postAgencySuccess(response, action.payload.changes));
  } catch (error) {
    yield put(postAgencyFail(error))
    console.log(error)
  }
}
function* updateAgency(action){  
  try {
      const response = yield call(() => post(url.UPUT_AGENCY+'/'+action.payload.id, action.payload.data))
      yield put(putAgencySuccess())
      yield put(getAgency())
  } catch (error) {
    console.log(error)
  }
}
function* deleteAgency(action){  
  try {
      const response = yield call(() => del(url.UDEL_AGENCY+'/'+action.payload))
      yield put(delAgencySuccess(response))
  } catch (error) {
    console.log(error)
  }
}

function* AgenciesSaga() {
  yield takeEvery(GET_GROUP_AGENCY, fetchGroupAgencies),
  yield takeEvery(GET_AGENCY, fetchAgencies),
  yield takeLatest(POST_GROUP_AGENCY, createGroupAgency),
  yield takeEvery(PUT_GROUP_AGENCY, updateGroupAgency),
  yield takeLatest(DELETE_GROUP_AGENCY, deleteGroupAgency)
  yield takeLatest(POST_AGENCY, createAgency),
  yield takeEvery(PUT_AGENCY, updateAgency),
  yield takeLatest(DELETE_AGENCY, deleteAgency)
}

export default AgenciesSaga
