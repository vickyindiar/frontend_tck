import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { AUTHENTICATE_CLIENT_CHECK, FPASSWORD_CLIENT, LOGIN_CLIENT, LOGOUT_CLIENT, REGISTER_CLIENT, REQ_FREE_TOKEN, REQ_FREE_TOKEN_SUCCESS, VERIFICATION_MAIL_CHECK } from "./actionTypes"
import { clientApiError, loginClientSuccess, AuthorizationClientCheckSuccess, verifyMailClientSuccess, registerClientSuccess , logoutClientSuccess} from "./actions"

import { del, get, post, xput } from "../../../helpers/api_helper"
import * as url from "../../../helpers/url_helper"
import { forgotPasswordClientSuccess } from "store/actions"
import isEmpty from "helpers/isEmpty_helper"


function* loginClient({ payload: { client, history } }) {
  try {
      const body = { email: client.email, password: client.pass };
      const response = yield call(() => post(url.UPOST_CLIENTLOGIN, body))
      yield put(loginClientSuccess(response))
      localStorage.removeItem('_fat')
      history.push("/")
  } catch (error) {
    yield put(clientApiError({error, errType:'login'}))
    console.log(error)

  }
}
function* forgotPassClient({ payload: { data, history } }) {
  try {
      const body = { email: data.email, password: data.password };
      const response = yield call(() => post(`${url.UPOST_CLIENTFPASS}?code=${data.code}` , body))
      yield put(forgotPasswordClientSuccess(response))
      history.push("/login")
  } catch (error) {
    yield put(clientApiError({error, errType:'forgot'}))
    console.log(error)
  }
}

function* logoutClient({ payload: { history } }) {
  try {
    localStorage.removeItem("_cat")
    yield put(logoutClientSuccess())
    history.push("/")
  } catch (error) {
    yield put(clientApiError({error, errType:'logout'}))
    console.log(error)

  }
}


function* AuthorizationClientCheck({payload:{history, location}}){
  try {
      const response = yield call(() => get(url.UPOST_CLIENTCHECK))
      yield put(AuthorizationClientCheckSuccess(response))
  } catch (error) {
    if(error.message === 'Network Error'){
     history.push('/error/500')
    }
    else{
      localStorage.removeItem("_cat")
      yield put(clientApiError({error, errType:'auth'}))
      window.location.reload();
      console.log(error)
    }
  }
}

function* verifiMailClient(action) {
  try {
    let urlx = '';
    let headers={}
    if(!isEmpty(action.payload.FreeToken)){
      headers.Authorization = `Bearer ${action.payload.FreeToken}` 
    }
    if(action.payload.Type === 'forgot-password')  urlx = url.UPOST_CLIENTFPASS_VERIFY 
    else if(action.payload.Type === 'register')  urlx = url.UPOST_CLIENTREGISTER_VERIFY
    else if(action.payload.Type === 'create-ticket') urlx = url.UPOST_CLIENTCREATETICKET_VERIFY
    const response = yield call(() => post(urlx, action.payload, {}, headers ))
    yield put(verifyMailClientSuccess())
  } catch (error) {
    yield put(clientApiError({error, errType:action.payload.Type}))
  }
}

function* registerClient({ payload: { data, history } }) {
  try {
      const body = { 
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email, 
        Password: data.password,
        Color: data.color 
      };
      const response = yield call(() => post(`${url.UPOST_CLIENTREGISTER}?code=${data.code}` , body ))
      yield put(registerClientSuccess(response))
      history.push("/login")
  } catch (error) {
    yield put(clientApiError({error, errType:'register'}))
  }
}

function* getFreeToken(){
  try {
      const response = yield call(() => get(url.UGET_CLIENT_FREETOKEN))
      localStorage.setItem("_fat", response);
      yield put({type:REQ_FREE_TOKEN_SUCCESS, payload: response})
  } catch (error) {
     console.log(error)
  }

}

function* authClientSaga() {
  yield takeEvery(VERIFICATION_MAIL_CHECK, verifiMailClient)
  yield takeEvery(REGISTER_CLIENT, registerClient)
  yield takeEvery(LOGIN_CLIENT, loginClient)
  yield takeEvery(FPASSWORD_CLIENT, forgotPassClient)
  yield takeEvery(AUTHENTICATE_CLIENT_CHECK, AuthorizationClientCheck)
  yield takeEvery(LOGOUT_CLIENT, logoutClient)
  yield takeEvery(REQ_FREE_TOKEN, getFreeToken)
}

export default authClientSaga
