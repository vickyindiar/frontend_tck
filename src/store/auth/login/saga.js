import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { AUTHENTICATE_CHECK, LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess, AuthorizationCheckSuccess } from "./actions"

import { del, get, post, xput } from "../../../helpers/api_helper"
import * as url from "../../../helpers/url_helper"

function* loginUser({ payload: { user, history } }) {
  try {
     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") { //use this

      const body = { email: user.email, password: user.password };
      const response = yield call(() => post(url.UPOST_ADMINLOGIN, body))

      yield put(loginSuccess(response))
    } 
    history.push("/admin/ticket")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    yield put(logoutUserSuccess())
    history.push("/admin/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* AuthorizationCheck({payload:{history, location}}){
  try {
      const response = yield call(() => get(url.UPOST_ADMINCHECK))
      yield put(AuthorizationCheckSuccess(response))
  } catch (error) {
    if(error.message === 'Network Error'){
     history.push('/error/500')
    }
    else{
     console.log(error.message)
     yield put(apiError(error))
    //  localStorage.removeItem("_aat")
    //  localStorage.removeItem("_ar")
    //  localStorage.removeItem("_ad")
     history.push('/admin/login')
    }
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(AUTHENTICATE_CHECK, AuthorizationCheck)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
