import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  AUTHENTICATE_CHECK,
  AUTHENTICATE_CHECK_SUCCESS
} from "./actionTypes"
import {isEmpty} from 'lodash'
import { encryptData, decryptData, _slt } from '../../../helpers/crypt_helper'

const initAuthenticated = !isEmpty(localStorage.getItem('_aat')) ? true : false;
const initActiveRole =!isEmpty(localStorage.getItem('_ar')) ? JSON.parse(decryptData(localStorage.getItem('_ar'), _slt)) : {};
const initActiveDept =!isEmpty(localStorage.getItem('_ad')) ? JSON.parse(decryptData(localStorage.getItem('_ad'), _slt)) : {};

const initialState = {
  error: "",
  loading: false,
  user: {},
  isAuthenticated: initAuthenticated,
  activeRole: initActiveRole,
  activeDept: initActiveDept,
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        user: {...action.payload.user},
        isAutheticated: true,
        activeRole: {...action.payload.activeRole},
        activeDept: {...action.payload.activeDept}
      }

      break
    case LOGOUT_USER:
      state = { ...state, loading: true }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state, loading: false, user:{}, isAutheticated: false, activeRole:{}, activeDept:{}}
      break
    case AUTHENTICATE_CHECK:
      state = {...state, loading: true}
      break
    case AUTHENTICATE_CHECK_SUCCESS:
      state = {...state, loading: false, user: {...action.payload.user}, isAutheticated: true, activeRole: {...action.payload.activeRole},
      activeDept: {...action.payload.activeDept}}
      break
    case API_ERROR:
        state = { ...state, error: action.payload, loading: false, user:{}, isAutheticated:false, activeRole:{}, activeDept:{} }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
