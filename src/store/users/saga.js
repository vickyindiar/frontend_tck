import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Crypto Redux States
import { GET_DEPARTMENTS, GET_ROLES, GET_SENDERS, 
      GET_USERS, POST_USER, PUT_USER, DELETE_USER, 
      GET_TEAMS, POST_TEAM, PUT_TEAM, DELETE_TEAM,
      GET_PROFILE, PUT_PROFILE, GET_PROFILE_TEAMS, GET_PROFILE_TICKETS_ASSIGN, GET_PROFILE_TICKETS } from "./actionTypes"
import { getUsers, getUsersSuccess, getUsersFail,
         postUsersSuccess, postUsersFail,
         getSendersSuccess, getSendersFail,
         toggleModalCreateUser,
         getRolesSuccess, getDepartmentsSuccess,
         getTeams, getTeamsSuccess, getTeamsFail,
         apiError, 
         toggleModalEditUser,
         postTeamsSuccess, toggleCardCreateTeam, toggleCardEditTeam, 
         getProfile, getProfileSuccess,  getProfileFail, toggleProfileEdit, 
         getProfileTeamsSuccess, getProfileTicketAssignSuccess, getProfileTicketsSuccess } from "./actions"
import { AuthorizationCheck, logoutUser  } from '../auth/login/actions'
import * as url from "../../helpers/url_helper"
import { del, get, post, postForm, xput } from "../../helpers/api_helper"
import Logout from "pages/Authentication/Logout"


const header = {
  'x-api-version': '1.0'
}


function* fetchUsers() {
  try {
    const response = yield call(() => get(url.UGET_USERS))
    yield put(getUsersSuccess(response))
  } catch (error) {
    yield put(getUsersFail(error))
  }
}

function* createUser(action){
  try {
    const response = yield call(() => postForm(url.UPOST_USERS, action.payload))
    yield put(toggleModalCreateUser(false));
    yield put(postUsersSuccess(response))
    yield put(getUsers())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* updateUser(action){
  try {
    const response = yield call(() => postForm(url.UPUT_USER+'/'+action.payload.id, action.payload.formData))
    yield put(toggleModalEditUser(false))
    yield put(getUsers())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* deleteUser(action){
  try {
    const response = yield call(() => del(url.UDEL_USER+'/'+action.payload.id))
    yield put(getUsers())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* fetchRole() {
  try {
      const response = yield call(() => get(url.UGET_ROLES))
      yield put(getRolesSuccess(response))
  } catch (error) {
    console.log(error)
  }
}

function* fetchDepartment() {
  try {
      const response = yield call(() => get(url.UGET_DEPTS))
      yield put(getDepartmentsSuccess(response))
  } catch (error) {
    console.log(error)
  }
}

function* fetchSenders() {
  try {
      const response = yield call(() => get(url.UGET_SENDERS))
      yield put(getSendersSuccess(response))
  } catch (error) {
      yield put(getSendersFail(error))
  }
}


function* fetchTeams(action) {
  let URL = url.UGET_TEAMS;
  if(action.payload === 'settings'){ URL = url.UGET_TEAMS_SETTING }
  else{ URL = url.UGET_TEAMS; }
  try {
    const response = yield call(() => get(URL))
    yield put(getTeamsSuccess(response))
  } catch (error) {
      yield put(getTeamsFail(error))
  }
}


function* createTeam(action){
  try {
    const response = yield call(() => post(url.UPOST_TEAMS, action.payload))
    yield put(toggleCardCreateTeam(false))
    yield put(postTeamsSuccess(response))
    yield put(getTeams())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* updateTeam(action){
  try {
    const response = yield call(() => post(url.UPUT_TEAM+'/'+action.payload.id, action.payload.data))
    yield put(toggleCardEditTeam(false, null))
    yield put(getTeams())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* deleteTeam(action){
  try {
    const response = yield call(() => del(url.UDEL_TEAM+'/'+action.payload.id))
    yield put(getTeams())
  } catch (error) {
    yield put(apiError(error))
  }
}

function* fetchProfile(action) {
  try {
    const response = yield call(() => get(url.UGET_USERS+'/'+action.payload));
    yield put(getProfileSuccess(response))
  } catch (error) {
      yield put(getProfileFail(error))
  }
}

function* updateProfile(action){
  try {
    const response = yield call(() => postForm(url.UPUT_USER+'/'+action.payload.id, action.payload.formData))
    yield put(toggleProfileEdit(false))
    yield put(getProfile(action.payload.id))
    if(action.payload.relogin){
      yield put(logoutUser(action.payload.history))
    }
    else{
      yield put(AuthorizationCheck(action.payload.history))
    }
  } catch (error) {
    yield put(apiError(error))
  }
}

function* fetchTeamProfile() {
  try {
    const response = yield call(() => get(url.UGET_TEAMS_PROFILE));
    yield put(getProfileTeamsSuccess(response))

  } catch (error) {
      yield put(apiError(error))
  }
}

function* fetchTicketProfile() {
  try {
    const response = yield call(() => get(url.UGET_TICKET_PROFILE));
    yield put(getProfileTicketsSuccess(response))
  } catch (error) {
      yield put(apiError(error))
  }
}

function* fetchTicketAssignProfile(action) {
  try {//
    const response = yield call(() => get(url.UGET_TICKETASSIGN_BYUSER +'/'+action.payload));
    yield put(getProfileTicketAssignSuccess(response))
  } catch (error) {
      yield put(apiError(error))
  }
}



function* usersSaga() {
  yield takeEvery(GET_USERS, fetchUsers),
  yield takeLatest(POST_USER, createUser),
  yield takeEvery(PUT_USER, updateUser),
  yield takeLatest(DELETE_USER, deleteUser),
  yield takeEvery(GET_ROLES, fetchRole),
  yield takeEvery(GET_DEPARTMENTS, fetchDepartment),
  yield takeEvery(GET_SENDERS, fetchSenders),
  yield takeEvery(GET_TEAMS, fetchTeams),
  yield takeLatest(POST_TEAM, createTeam),
  yield takeEvery(PUT_TEAM, updateTeam),
  yield takeLatest(DELETE_TEAM, deleteTeam),
  yield takeEvery(GET_PROFILE, fetchProfile),
  yield takeEvery(PUT_PROFILE, updateProfile),
  yield takeEvery(GET_PROFILE_TEAMS, fetchTeamProfile),
  yield takeEvery(GET_PROFILE_TICKETS, fetchTicketProfile)
  yield takeEvery(GET_PROFILE_TICKETS_ASSIGN, fetchTicketAssignProfile)



}

export default usersSaga
