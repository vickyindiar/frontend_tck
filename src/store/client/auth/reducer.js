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
  VERIFICATION_MAIL_CHECK_SUCCESS,
  FPASSWORD_CLIENT,
  FPASSWORD_CLIENT_SUCCESS,
  REQ_FREE_TOKEN,
  REQ_FREE_TOKEN_SUCCESS,
  VERIFICATION_MAIL_CHECK,
  RESET_CLIENT_AUTH_STATE
  
} from "./actionTypes"
import {isEmpty} from 'lodash'
import { encryptData, decryptData, _slt } from '../../../helpers/crypt_helper'

const initAuthenticated = !isEmpty(localStorage.getItem('_cat')) ? true : false;
const initialState = {
  error: "",
  errorType:"",
  loading: false,
  client: {},
  isAuthenticated: initAuthenticated,
  showVerifyCode: false,
  loadingVerify: false,
  freeToken: ''
}

const loginClient = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_CLIENT:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_CLIENT_SUCCESS:
      state = {
        ...state,
        loading: false,
        client: {...action.payload.client},
        freeToken: '',
        isAuthenticated: true,
      }
      break
    case FPASSWORD_CLIENT:
      state = {
        ...state,
        loading: true,
      }
      break
    case FPASSWORD_CLIENT_SUCCESS:
      state = {
        ...state,
        loading: false,
        isAuthenticated: false,
        showVerifyCode: false
      }
      break
    case LOGOUT_CLIENT:
      state = { ...state, loading: true }
      break
    case LOGOUT_CLIENT_SUCCESS:
      state = { ...state, loading: false, client:{}, isAuthenticated: false }
      break
    case AUTHENTICATE_CLIENT_CHECK:
      state = {...state, loading: true}
      break
    case AUTHENTICATE_CLIENT_CHECK_SUCCESS:
      state = {...state, loading: false, client: {...action.payload.client}, isAuthenticated: true }
      break
    case REGISTER_CLIENT:
      state = {...state, loading: true}
      break
    case REGISTER_CLIENT_SUCCESS:
      state = {...state, loading: false, showVerifyCode: false, error:'', errorType:'' }
      break
    case VERIFICATION_MAIL_CHECK:
      state = {...state, loadingVerify: true }
      break
    case VERIFICATION_MAIL_CHECK_SUCCESS:
      state = {...state, showVerifyCode: true, loadingVerify: false }
      break
    case CLIENT_API_ERROR:
        state = { ...state, 
          error: action.payload.errText, 
          errorType: action.payload.errType,
          loading: false,
          showVerifyCode: false
        }
        break
    case REQ_FREE_TOKEN_SUCCESS:
      state = {
        ...state,
        freeToken: action.payload
      }
      break
    case RESET_CLIENT_AUTH_STATE:
      state = {
        ...state,
        ...action.payload
      }
    default:
      state = { ...state }
      break
  }
  return state
}

export default loginClient
