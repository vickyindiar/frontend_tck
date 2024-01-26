import {
  LOGIN_CLIENT,
  LOGIN_CLIENT_SUCCESS,
  LOGOUT_CLIENT,
  LOGOUT_CLIENT_SUCCESS,
  CLIENT_API_ERROR,
  AUTHENTICATE_CLIENT_CHECK,
  AUTHENTICATE_CLIENT_CHECK_SUCCESS,
  REGISTER_CLIENT,
  REGISTER_CLIENT_SUCCESS,
  VERIFICATION_MAIL_CHECK,
  VERIFICATION_MAIL_CHECK_SUCCESS,
  FPASSWORD_CLIENT,
  FPASSWORD_CLIENT_SUCCESS,
  REQ_FREE_TOKEN
} from "./actionTypes"

import { encryptData, decryptData, _slt } from '../../../helpers/crypt_helper'

export const loginClient = (client, history) => {
  return {
    type: LOGIN_CLIENT,
    payload: { client, history },
  }
}


export const loginClientSuccess = response => {
  let payload = {client:response}
  localStorage.setItem("_cat", response.token);
  localStorage.removeItem("_ar")
  localStorage.removeItem("_ad")
  localStorage.removeItem("_aat")
  return {
    type: LOGIN_CLIENT_SUCCESS,
    payload:payload,
  }
}

export const forgotPasswordClient = (data, history) => {
  return { type: FPASSWORD_CLIENT, payload: {data, history} }
}

export const forgotPasswordClientSuccess = () => {
  return {
    type: FPASSWORD_CLIENT_SUCCESS,
  }
}

export const logoutClient = history => {
  return {
    type: LOGOUT_CLIENT,
    payload: { history },
  }
}

export const logoutClientSuccess = () => {
  return {
    type: LOGOUT_CLIENT_SUCCESS,
  }
}

export const clientApiError = ({error, errType}) => {
  let err = '';
  if( error && error.hasOwnProperty('response') && error.response.hasOwnProperty('data')){
    err = error.response.data
  }
  else if(error && error.hasOwnProperty('response')){
    err = error.response.statusText
  }
  return {
    type: CLIENT_API_ERROR,
    payload: {errText: err, errType:errType},
  }
}

export const AuthorizationClientCheck = (history, location) => {
  return {
    type: AUTHENTICATE_CLIENT_CHECK,
    payload: {history, location}
  }
}

export const AuthorizationClientCheckSuccess = (response) => {
  const payload = {client:response}
  return {
    type: AUTHENTICATE_CLIENT_CHECK_SUCCESS,
    payload: payload
  }
}

export const registerClient = (data, history) => {
  return{
    type: REGISTER_CLIENT, 
    payload: {data, history}
  }
}
export const registerClientSuccess = (dataSubmit) => {
  return{
    type: REGISTER_CLIENT_SUCCESS, 
    payload: dataSubmit
  }
}
export const verifyMailClient = (email, type, freeToken ) => {
  return{
    type: VERIFICATION_MAIL_CHECK, 
    payload: {Email: email, Type:type, FreeToken:freeToken }
  }
}
export const verifyMailClientSuccess = () => {
  return{
    type: VERIFICATION_MAIL_CHECK_SUCCESS, 
  }
}

export const reqFreeToken = () => { return { type: REQ_FREE_TOKEN } }







