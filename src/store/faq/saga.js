import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects"
import { DELETE_FAQ, GET_FAQS,GET_FAQS_BY_APP, GET_FAQS_BY_APP_SUCCESS, GET_FAQ_TYPE, GET_LATEST_VER_APP, POST_FAQ, PUT_FAQ, RESET_FAQ_STATE } from "./actionTypes"
import { getFaqs, getFaqsSuccess, getFaqsByAppSuccess, getFaqsFail, getFaqTypeSuccess, getFaqTypeFail, getlatestVerAppSuccess, getlatestVerAppFail, postFaqsSuccess, postFaqsFail } from "./actions"
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, put as xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"
import { getFaqsByAppFail, changeModuleTab, getFaqsByApp } from "store/actions"

function* fetchFaqs(action) {
  try {
    let headers={}
    if(!isEmpty(action.payload.freeToken)){
      headers.Authorization = `Bearer ${action.payload.freeToken}` 
    }
    if(!isEmpty(action.payload.ticketToken)){
      headers.TicketToken = `Bearer ${action.payload.ticketToken}` 
    }
      const response = yield call(() => get(url.UGET_FAQS, {}, headers))
      yield put(getFaqsSuccess(response))
  } catch (error) {
    yield put(getFaqsFail(error))
  }
}

function* fetchFaqsByApp(action) {
  try {
    let headers={}
    if(!isEmpty(action.payload.freeToken)){
      headers.Authorization = `Bearer ${action.payload.freeToken}` 
    }
    const response = yield call(() => get(url.UGET_FAQS_BY_APP + '/'+action.payload.appId, {}, headers ))
    yield put(getFaqsByAppSuccess(response))
  } catch (error) {
    yield put(getFaqsByAppFail(error))
  }
}

function* createFaq(action){  
  try {
      const response = yield call(() => post(url.UPOST_FAQ,  action.payload.dataSubmit))
      yield put(postFaqsSuccess());
      yield put(getFaqsByApp(action.payload.appId));  
  } catch (error) {
    yield put(postFaqsFail(error))
    console.log(error)
  }
}
function* updateFaq(action){  
  try {
      const response = yield call(() => postForm(url.UPUT_FAQ,  action.payload.formData))
      yield put({type: RESET_FAQ_STATE, payload: { modalEditFaq: false } })
      yield put(getFaqsByApp(action.payload.appId));   
  } catch (error) {
    console.log(error)
  }
}
function* deleteFaq(action){  
  try {
      const response = yield call(() => del(url.UDEL_FAQ+'/'+action.payload))
      yield put(getFaqs());  
  } catch (error) {
    console.log(error)
  }
}

function* faqsSaga() {
  yield takeEvery(GET_FAQS, fetchFaqs),
  yield takeEvery(GET_FAQS_BY_APP, fetchFaqsByApp),
  yield takeLatest(POST_FAQ, createFaq),
  yield takeEvery(PUT_FAQ, updateFaq),
  yield takeLatest(DELETE_FAQ, deleteFaq)
}

export default faqsSaga
