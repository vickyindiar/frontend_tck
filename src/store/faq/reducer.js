import isEmpty from "helpers/isEmpty_helper"
import { 
  GET_FAQS_SUCCESS, GET_FAQS_FAIL, 
  GET_FAQS_BY_APP_SUCCESS, GET_FAQS_BY_APP_FAIL,
  
  POST_FAQ_FAIL, POST_FAQ_SUCCESS,
  TOGGLE_MODAL_CREATE_FAQ, TOGGLE_MODAL_EDIT_FAQ,
  RESET_FAQ_STATE,
  GET_FAQ_TYPE_SUCCESS, GET_FAQ_TYPE_FAIL,
  DO_FILTER_FAQS, GET_LATEST_VER_APP_SUCCESS, GET_LATEST_VER_APP_FAIL,
  PUT_FAQ,
  DELETE_FAQ,
  CHANGE_MODULE_TAB_ACTIVE,
  CHANGE_APP_ACTIVE

} from "./actionTypes"


const INIT_STATE = {
  appActive: 1,
  mTabActive: 1,
  sFaqs: [],
  sFaqsByTabs:[],
  
  
  allFaqs: [],
  filteredFaqs:[],
  lastVersionApp:'',
  modalCreateFaq:false,
  modalEditFaq:false,
  loadPanel: false,
  cLogType: [],
  error: {},
  errText: ''
}

const faq = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_MODULE_TAB_ACTIVE:
      let filteredFaq = state.sFaqs.filter(f => f.appId === state.appActive && f.moduleId === state.mTabActive )
      return{
        ...state,
        mTabActive: action.payload,
        sFaqsByTabs: filteredFaq
      }
      break;
    case CHANGE_APP_ACTIVE:
      return{
        ...state, appActive: action.payload
      }
      break;
    case GET_FAQS_BY_APP_SUCCESS:
      let filteredFaqByTab = action.payload.filter(f => f.appId === state.appActive && f.moduleId === state.mTabActive )
      return { 
        ...state,
         sFaqs: action.payload,
         sFaqsByTabs: filteredFaqByTab
      }
      break;
    case GET_FAQS_SUCCESS:
      return {
        ...state,
        allFaqs: [...action.payload],
        filteredFaqs : [...action.payload]
      }
      break
    case GET_FAQS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break
      case DO_FILTER_FAQS:
        let filtered  = []
        let all = [...state.allFaqs]
        if (action.payload === "" ) {
          filtered = [...all]
        }
        else{
          let splited = action.payload.toLowerCase().split(' ');
          filtered =[...all.filter((f) =>{
            if( !isEmpty(f.question) && splited.some(s => f.question.toLowerCase().includes(s))) return true
            if( !isEmpty(f.desc) && splited.some(s => f.desc.toLowerCase().includes(s))) return true
          })]
        }
        return{
          ...state,
          filteredFaqs : [...filtered]
        }
        break
    case POST_FAQ_SUCCESS: return { ...state, loadPanel: false, error:'', modalCreateFaq: false }
      break
    case POST_FAQ_FAIL: return { ...state, error: action.payload, errText: action.payload.response.data, loadPanel: false }
      break
    case TOGGLE_MODAL_CREATE_FAQ:  return { ...state, modalCreateFaq: action.payload }
      break
    case TOGGLE_MODAL_EDIT_FAQ:  return { ...state, modalEditFaq: action.payload }
      break
    case RESET_FAQ_STATE:
        return {...state, ...action.payload}
       break;
    default:
      return state
      break
  }
}

export default faq
