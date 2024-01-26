import isEmpty from "helpers/isEmpty_helper"
import { 
  GET_KBASES_SUCCESS, GET_KBASES_FAIL, 
  GET_KBASES_BYID_SUCCESS, GET_KBASES_BYID_FAIL,
  GET_KBASES_BY_APP_SUCCESS, GET_KBASES_BY_APP_FAIL,
  
  POST_KBASE_FAIL, POST_KBASE_SUCCESS,
  TOGGLE_MODAL_CREATE_KBASE, TOGGLE_MODAL_EDIT_KBASE,
  RESET_KBASE_STATE,
  PUT_KBASE,
  DELETE_KBASE,
  CHANGE_MODULE_ACTIVE,
  CHANGE_APP_ACTIVE,
  DO_FILTER_KBASES

} from "./actionTypes"

const INIT_STATE = {
  appActive: '',
  moduleActive: '',
  sKbases: {},
  allKbases: [],
  filteredKbases:[],
  modalCreateKbase:false,
  modalEditKbase:false,
  loadPanel: false,
  error: {},
  errText: ''
}

const faq = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_APP_ACTIVE:
      return{
        ...state, appActive: action.payload
      }
      break;
    case CHANGE_MODULE_ACTIVE:
      return{
        ...state, moduleActive: action.payload
      }
      break;
    case GET_KBASES_SUCCESS:
        return {
          ...state,
          allKbases: [...action.payload],
          filteredKbases : [...action.payload]
        }
        break
    case GET_KBASES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
        break
    case GET_KBASES_BY_APP_SUCCESS:
      return { 
        ...state,
         filteredKbases: action.payload
      }
      break
    case GET_KBASES_BYID_SUCCESS:
      return {
        ...state,
        sKbases: action.payload,
      }
      break
    case GET_KBASES_BYID_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break
    case POST_KBASE_SUCCESS: return { ...state, loadPanel: false, error:'', modalCreateKbase: false }
      break
    case POST_KBASE_FAIL: return { ...state, error: action.payload, errText: action.payload.response.data, loadPanel: false }
      break
    case TOGGLE_MODAL_CREATE_KBASE:  return { ...state, modalCreateKbase: action.payload }
      break
    case TOGGLE_MODAL_EDIT_KBASE:  return { ...state, modalEditKbase: action.payload }
      break
    case DO_FILTER_KBASES:
      let filterDetail = [];
      let filtered  = []
      let all = [...state.allKbases]
      if (action.payload === "" ) {
        filtered = [...all]
      }
      else{
        let splited = action.payload.toLowerCase().split(' ');
        filtered =[...all.filter((f) =>{
          if( !isEmpty(f.title) && splited.some(s => f.title.toLowerCase().includes(s))) return true
          if( !isEmpty(f.body) && splited.some(s => f.body.toLowerCase().includes(s))) return true
        })]
      }
      return {...state, filteredKbases : [...filtered]}
      break;
    case RESET_KBASE_STATE:
        return {...state, ...action.payload}
       break;
    default:
      return state
      break
  }
}

export default faq
