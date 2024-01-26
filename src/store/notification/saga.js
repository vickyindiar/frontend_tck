import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

import { ASK_PERMISSION_NOTIF, ADD_REGISTERED_FCM, INIT_FIREBASE, INIT_FIREBASE_SUCCESS, SET_APP_MSG_NTF, GET_NOTIFS, GET_NOTIFS_SUCCESS, PUT_NOTIFS,
   CHECKING_NOTIF_COUNT, CHECKING_NOTIF_COUNT_SUCCESS, MARK_ALL_NOTIF, MARK_ALL_NOTIF_SUCCESS } from "./actionTypes"
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, put as xput  } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import config from '../../config'
import { initializeApp } from "firebase/app"



function* initialApp(){
  try {
    const app = yield initializeApp(config.google);
    const messaging = yield getMessaging(app);
    yield put( {type:INIT_FIREBASE_SUCCESS, payload: {app, messaging}})
    yield put({type: SET_APP_MSG_NTF, payload:messaging})
  } catch (error) {
    console.log(error)
  }
}

function* getPermissionNtf(action){
  try {
    const messaging = getMessaging();
    const token = yield getToken(messaging, {vapidKey: config.google.vapidkey});
    if(token){
      let notify = {...action.payload, fcmToken: token};
      localStorage.setItem("_ntft", token);
      const response = yield call(() => post(url.UPOST_REGISTERED_FCM, notify))
    }
    else{
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error)
  }
}

function* getNotifs(){
  try {
    const response = yield call(() => get(url.UGET_NOTIFICATION));
    yield put({type: GET_NOTIFS_SUCCESS, payload:response})
  } catch (error) {
    console.log(error)
  }
}

function* countNewNotif(){
  try {
    const response = yield call(() => get(url.UGET_NOTIFICATION));
    yield put({type: CHECKING_NOTIF_COUNT_SUCCESS, payload:response})
  } catch (error) {
    console.log(error)
  }
}

function* updateNotif(action){
  try {
    let {notif, history} = action.payload;
    const response = yield call(() => xput(url.UPUT_NOTIFICATION, notif ));
    const query = new URLSearchParams(notif.link).values();
    let tid = null;
    let op = null;
    let i = 0;
    for(var value of query) {
      if(i === 0){ tid = value }
      else if(i === 1){ op = value}
      i++;
    }
    history.push(`?tid=${tid}&open=${op}`)
    yield put({type: GET_NOTIFS})
  } catch (error) {
    console.log(error)
  }
}

function* readAllNotif(){
  try {
    const response = yield call(() => get(url.UPUT_MARK_ALLREAD));
    yield put({type: MARK_ALL_NOTIF_SUCCESS, payload: response})
    yield put({type: GET_NOTIFS})
  } catch (error) {
    console.log(error)
  }
}

function* notifsSaga() {
   yield takeLatest(INIT_FIREBASE, initialApp),
   yield takeEvery(ASK_PERMISSION_NOTIF, getPermissionNtf),
   yield takeEvery(GET_NOTIFS, getNotifs),
   yield takeLatest(CHECKING_NOTIF_COUNT, countNewNotif),
   yield takeEvery(PUT_NOTIFS, updateNotif),
   yield takeEvery(MARK_ALL_NOTIF, readAllNotif)
}

export default notifsSaga
