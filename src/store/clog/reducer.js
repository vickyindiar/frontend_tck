import isEmpty from "helpers/isEmpty_helper"
import { GET_CLOGS_SUCCESS, GET_CLOGS_FAIL, 
  POST_CLOG_FAIL, POST_CLOG_SUCCESS,
  TOGGLE_MODAL_CREATE_CLOG, TOGGLE_MODAL_EDIT_CLOG,
  RESET_CLOG_STATE,
  GET_CLOG_TYPE_SUCCESS, GET_CLOG_TYPE_FAIL,
  DO_FILTER_CLOGS, GET_LATEST_VER_APP_SUCCESS, GET_LATEST_VER_APP_FAIL,
  PUT_CLOG,
  DELETE_CLOG,
  GET_LATEST_CLOG_SUCCESS,
  GET_LATEST_CLOG_FAIL,
  SET_APP_ACTIVE
} from "./actionTypes"

const INIT_STATE = {
  allCLogs: [],
  filteredCLogs:[],
  lastVersionApp:'',
  latestClog: [],
  modalCreateCLog:false,
  modalEditCLog:false,
  loadPanel: false,
  cLogType: [],
  appActive: {},
  error: {},
  errText: '',
  ruleVersion : {
    mayor: { type:'mayor',    start: 0, end: 2 },
    minor: { type:'minor',    start: 2, end: 4 },
    year : { type:'year',     start: 4, end: 6 },
    md   : { type:'montdate', start: 6, end: 10 },
    build: { type:'build',    start: 10, end: 13 }
  }
}

const clog = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLOGS_SUCCESS:
      return {
        ...state,
        allCLogs: [...action.payload],
        filteredCLogs : [...action.payload]
      }
      break
    case GET_CLOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break
    case POST_CLOG_SUCCESS: return { ...state, loadPanel: false, error:'', modalCreateCLog: false }
      break
    case POST_CLOG_FAIL: return { ...state, error: action.payload, errText: action.payload.response.data, loadPanel: false }
      break
    case TOGGLE_MODAL_CREATE_CLOG:  return { ...state, modalCreateCLog: action.payload }
      break
    case TOGGLE_MODAL_EDIT_CLOG:  return { ...state, modalEditCLog: action.payload }
      break
    case GET_CLOG_TYPE_SUCCESS:
      return { ...state, cLogType: action.payload }
      break
    case GET_CLOG_TYPE_FAIL:
      return { ...state, error: action.payload, }
      break
    case DO_FILTER_CLOGS:
      let filterDetail = [];
      let filtered  = []
      let all = [...state.allCLogs]
      if (action.payload === "" ) {
        filtered = [...all]
      }
      else{
        filtered =[...all.filter((f) =>{
          if( !isEmpty(f.apps) && f.apps.name.toLowerCase().includes(action.payload.toLowerCase())) return true
          if( !isEmpty(f.version) && f.version.toLowerCase().includes(action.payload.toLowerCase().replace('.', ''))) return true
          else{
            let result = []
             f.cLogDetails.forEach(e => {
              if( e.title.toLowerCase().includes(action.payload.toLowerCase()) || e.desc.toLowerCase().includes(action.payload.toLowerCase()) ) {
                let isIncluded = filterDetail.findIndex(el => el.clogId === f.id)
                if( isIncluded >= 0){ filterDetail[isIncluded].detailId.push(e.id) }
                else{ filterDetail.push({clogId:f.id, detailId: [e.id]}) }
                result.push(true)
              } 
               else { result.push(false) }
             }
            )
            return result.includes(true);
          }
        })]

        // //BUG: 
        // if(filterDetail.length > 0) {
        // let NewFiltered = [];
        //   filtered.forEach((fe, index) => {
        //      let newCLogDetail=[...fe.cLogDetails.filter((el) => {
        //       return filterDetail.some((f) => {
        //         return fe.id === f.clogId &&  f.detailId.includes(el.id);
        //       });
           
        //     })];
        //     NewFiltered = [...NewFiltered, fe]
        //     NewFiltered[index].cLogDetails = [...newCLogDetail];
        //   })
        // filtered = NewFiltered;
        // }
        ///
      }
      return {...state, filteredCLogs : [...filtered]}
      break;
    case GET_LATEST_VER_APP_SUCCESS: return { ...state, lastVersionApp: action.payload.toString(), error:'' }
      break
    case GET_LATEST_VER_APP_FAIL: return { ...state, error: action.payload}
      break
    case GET_LATEST_CLOG_SUCCESS:
      return {
        ...state,
        latestClog: action.payload
      }
      break
    case GET_LATEST_CLOG_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break
    case SET_APP_ACTIVE: 
     return {
       ...state,
       appActive: action.payload
     }
     break
    case RESET_CLOG_STATE:
        return {...state, ...action.payload}
       break;
    default:
      return state
      break
  }
}

export default clog
