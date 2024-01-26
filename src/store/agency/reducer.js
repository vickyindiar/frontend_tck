import { 
  SET_CHANGES,
  SET_EDIT_ROW_KEY,
  GET_GROUP_AGENCY_SUCCESS,
  GET_AGENCY_SUCCESS,
  POST_GROUP_AGENCY_SUCCESS,
  PUT_GROUP_AGENCY_SUCCESS,
  DELETE_GROUP_AGENCY_SUCCESS,
  SET_CHANGES_DETAIL,
  SET_EDIT_ROW_KEY_DETAIL,
  POST_AGENCY_SUCCESS,
  PUT_AGENCY_SUCCESS,
  DELETE_AGENCY_SUCCESS,

} from "./actionTypes"
import applyChanges from 'devextreme/data/apply_changes';

const INIT_STATE = {
  data: [],
  changes: [],
  editRowKey: null,

  dsGroupAgencies : [],
  dsAgencies: [],
    
  changesDetail: [],
  editRowKeyDetail: null,

  loadPanel: false,
  error: {},
  errText: ''
}

const agency = (state = INIT_STATE, action) => {
  let newData;
  switch (action.type) {
    case GET_GROUP_AGENCY_SUCCESS:
      return{...state, dsGroupAgencies: action.payload}
      break
    case GET_AGENCY_SUCCESS:
        return {
        ...state,
        dsAgencies: action.payload
        }
        break
    case SET_CHANGES:
        return {
          ...state,
          changes: action.payload,
        }
        break
    case SET_EDIT_ROW_KEY:
        return {
          ...state,
          editRowKey: action.payload,
        }
        break
    case POST_GROUP_AGENCY_SUCCESS:
      return {
        ...state,
        dsGroupAgencies: [...action.payload.group],
        changes: [],
        editRowKey: null
      }
      break
    case PUT_GROUP_AGENCY_SUCCESS:
        return {
          ...state,
          changes: [],
          editRowKey: null
        }
        break
    case DELETE_GROUP_AGENCY_SUCCESS:
      return {
        ...state,
        changes: [],
        editRowKey: null
      }
      break
    case SET_CHANGES_DETAIL:
        return {
          ...state,
          changesDetail: action.payload,
        }
        break
    case SET_EDIT_ROW_KEY_DETAIL:
        return {
          ...state,
          editRowKeyDetail: action.payload,
        }
        break
    case POST_AGENCY_SUCCESS:
      return {
        ...state,
        dsAgencies: [...action.payload.agencies],
        changesDetail: [],
        editRowKeyDetail: null
      }
      break
    case PUT_AGENCY_SUCCESS:
        return {
          ...state,
          changesDetail: [],
          editRowKeyDetail: null
        }
        break
    case DELETE_AGENCY_SUCCESS:
      return {
        ...state,
        dsAgencies: [...action.payload],
        changesDetail: [],
        editRowKeyDetail: null
      }
      break
    default:
      return state
      break
  }
}

export default agency
