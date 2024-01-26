import { 
  GET_NOTIFS_SUCCESS, 
  GET_NOTIFS_FAIL, 
  RESET_NOTIF_STATE, 
  SET_CONNECTION_HUB, 
  ASK_PERMISSION_NOTIF, 
  INIT_FIREBASE_SUCCESS,
  SET_APP_MSG_NTF,
  CHECKING_NOTIF_COUNT_SUCCESS,
  REMOVE_CONNECTION_HUB
} from "./actionTypes"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { groupBy, size } from "lodash";

const INIT_STATE = {
  firebaseApp: null,
  firebaseMessage: null,
  connHub:  null,
  allRegist: [],
  allNotif: {},
  oriNotifCount: -1,
  newNotifCount: -1,
  errText: ''
}

const notif = (state = INIT_STATE, action) => {
  switch (action.type) {
    case INIT_FIREBASE_SUCCESS:
      return {...state, firebaseApp: action.payload}
      break;
    case SET_APP_MSG_NTF:
      return{
        ...state,
        firebaseMessage: action.payload
      }
    case ASK_PERMISSION_NOTIF:
      return {
        ...state
      }
      break;
    case SET_CONNECTION_HUB:
      return {
        ...state,
        connHub: action.payload
      }
      break;
    case REMOVE_CONNECTION_HUB:
      return {
        ...state, connHub: null
      }
      break;
    case GET_NOTIFS_SUCCESS:
      let all = [];
      action.payload.forEach(p => {
        all = [...all, ...p.notifs]
      });
      all = all.sort((a, b) => b.id - a.id)
      let grouped = groupBy(all, e => e.ntfType && e.title)
      return {
        ...state,
        allRegist: action.payload,
        allNotif: grouped,
        oriNotifCount: size(all)
      }
      break;
    case CHECKING_NOTIF_COUNT_SUCCESS:
      let arr = [];
      action.payload.forEach(p => {
        arr = [...arr, ...p.notifs]
      });
      arr = arr.sort((a, b) => b.id - a.id)
      let grArr = groupBy(arr, e => e.ntfType && e.title) 
      return {
        ...state,
        newNotifCount: size(arr)
      }
      break;
    case GET_NOTIFS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break;

    case RESET_NOTIF_STATE:
        return {...state, ...action.payload}
    break;
    default:
      return state
      break
  }
}

export default notif
