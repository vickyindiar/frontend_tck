import isEmpty from "helpers/isEmpty_helper"
import {  
  GET_CLIENT_TICKETS_SUCCESS, GET_CLIENT_TICKETS_FAIL,
  CHANGE_CLIENT_ACTIVE_TICKET,
  POST_CLIENT_TICKET_DETAIL, POST_CLIENT_TICKET_DETAIL_SUCCESS, POST_CLIENT_TICKET_DETAIL_FAIL,
  CREATE_CLIENT_TICKETS,  CREATE_CLIENT_TICKETS_SUCCESS,  CREATE_CLIENT_TICKETS_FAIL, RESET_CLIENT_TICKET_STATE, TOGGLE_VERIFY_OPEN_TICKET, GET_VERIFY_OPEN_TICKET_SUCCESS, GET_VERIFY_OPEN_TICKET_FAIL,
  // CHANGE_ACTIVE_TAB,
  // TOGGLE_MODAL_CREATE, GET_ACTION_LIST, GET_OPTION_LIST_SUCCESS,
  // GRIDVIEW_SELECTED_ROW, GRIDVIEW_MULTISELECTED_ROW, TOGGLE_DRAWER_EDITOR,
} from "./actionTypes"


const INIT_STATE = {
  allTickets: [],
  activeTicket: 0,
  loadingCreate: false,
  loadingPost: false,
  showVerifyOpen: false,
  isVerifiedToOpen: false,
  error: {},
  success: false
}

const tickets = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLIENT_TICKETS_SUCCESS:
        return { ...state, 
        allTickets: action.payload, 
        activeTicket: !isEmpty(action.payload) && (state.activeTicket === 0) ? action.payload[0].id : state.activeTicket,
      }
        break;
    case CHANGE_CLIENT_ACTIVE_TICKET:
        return {...state, activeTicket: action.payload}
        break;
    case GET_CLIENT_TICKETS_FAIL:
        return { ...state, error: action.payload, }
        break;
    case POST_CLIENT_TICKET_DETAIL:
        return {  ...state, loadingPost: true }
        break;
    case POST_CLIENT_TICKET_DETAIL_SUCCESS:
        return { ...state, loadingPost: false }
        break;
    case CREATE_CLIENT_TICKETS:
        return { ...state, loadingCreate: true }
        break;
    case CREATE_CLIENT_TICKETS_SUCCESS:
        return { ...state, loadingCreate: false, success: true}
        break;
    case CREATE_CLIENT_TICKETS_FAIL:
        return { ...state, loadingCreate: false, error: { error: action.payload, errorText: action.payload.response.data},  succes: false }
        break;  
    case TOGGLE_VERIFY_OPEN_TICKET:
        return {...state, showVerifyOpen: action.payload  } 
        break;
    case GET_VERIFY_OPEN_TICKET_SUCCESS:
        return {...state, showVerifyOpen: false }
        break;
    case GET_VERIFY_OPEN_TICKET_FAIL :
        return {...state, error: { error: action.payload, errorText: action.payload.response.data } }  
        break;
    case RESET_CLIENT_TICKET_STATE:
        return {...state, ...action.payload}
        break;
    default:
      return state
  }
}

export default tickets
