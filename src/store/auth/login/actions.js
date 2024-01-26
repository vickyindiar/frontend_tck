import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  AUTHENTICATE_CHECK,
  AUTHENTICATE_CHECK_SUCCESS
} from "./actionTypes"

import { encryptData, decryptData, _slt } from '../../../helpers/crypt_helper'
import {minBy} from 'lodash'

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = response => {
  let activeRole = minBy(response.role, e => e.roleId);
  let activeDept = minBy(response.dept, e => e.departmentId); 
  let payload = {user:response, activeRole, activeDept}
  localStorage.setItem("_aat", payload.user.token);
  localStorage.setItem("_ar", encryptData(JSON.stringify(activeRole), _slt))
  localStorage.setItem("_ad", encryptData(JSON.stringify(activeDept), _slt))
  localStorage.removeItem("_cat")
  localStorage.removeItem("_fat")
  return {
    type: LOGIN_SUCCESS,
    payload:payload,
  }
}

export const logoutUser = history => {

  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  localStorage.removeItem("_ar")
  localStorage.removeItem("_ad")
  localStorage.removeItem("_aat")
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error.response.data,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}

export const AuthorizationCheck = (history, location) => {
  return {
    type: AUTHENTICATE_CHECK,
    payload: {history, location}
  }
}

export const AuthorizationCheckSuccess = (response) => {
  let activeRole = {};
  let activeDept = {};
  if(!localStorage.getItem('_ar')){
    activeRole = minBy(response.role, e => e.roleId );
    localStorage.setItem("_ar", encryptData(JSON.stringify(activeRole), _slt))
  }
  else {
    activeRole = JSON.parse(decryptData(localStorage.getItem('_ar'), _slt));
  }

  if(!localStorage.getItem('_ad')){
    activeDept = minBy(response.dept, e => e.departmentId );
    localStorage.setItem("_ad", encryptData(JSON.stringify(activeRole), _slt))
  }
  else {
    activeDept = JSON.parse(decryptData(localStorage.getItem('_ad'), _slt));
  }
  const payload = {user:response, activeRole, activeDept}
  return {
    type: AUTHENTICATE_CHECK_SUCCESS,
    payload: payload
  }
}
