import { GET_TICKETS, GET_TICKETS_SUCCESS, GET_TICKETS_FAIL, CHANGE_TICKETS, 
  CHANGE_ACTIVE_TAB,
  CREATE_TICKETS, CREATE_TICKETS_SUCCESS, CREATE_TICKETS_FAIL,
  TOGGLE_MODAL_CREATE, GET_ACTION_LIST, GET_OPTION_LIST_SUCCESS,
  GRIDVIEW_SELECTED_ROW_SUCCESS, GRIDVIEW_MULTISELECTED_ROW, TOGGLE_DRAWER_EDITOR,
  POST_TICKET_DETAIL, POST_TICKET_DETAIL_SUCCESS, RESET_TICKET_STATE, TICKET_ERROR_TYPE, GET_PRIORITY_SUCCESS, GET_ENHANCEMENT_SUCCESS,
  GET_FILTERED_SEACRH_TICKET_SUCCESS, GET_DB_LIST, GET_DB_LIST_SUCCESS, CHANGE_DB_ACTIVE
} from "./actionTypes"

const INIT_STATE = {
  activeTab: '1',
  allTickets: [],
  tickets:[],
  showModalCreateTicket: false,
  openDrawerEditor: false,
  actionList: [],
  optionList:[],
  dbList: [],
  isDBActive: sessionStorage.getItem("_dbact") ? sessionStorage.getItem("_dbact") : false,
  selectedSingleRow:{},
  selectedMultiRow: [],
  searchedId : [],

  dsPriority:[],
  dsEnhancement:[],

  loadingFetch: false,
  loadingCreate: false,
  loadingPost: false,
  error: {},
  errText: '',
  errType: ''
}

const tickets = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TICKETS:
      return { ...state, loadingFetch: true}
    case GET_TICKETS_SUCCESS:
      return { ...state, allTickets: action.payload, loadingFetch: false }
      break;
    case GET_TICKETS_FAIL:
      return { ...state, error: action.payload, loadingFetch: false}
      break;
    case CHANGE_TICKETS:
        return { ...state, tickets: action.payload }
        break;
    case CHANGE_ACTIVE_TAB:
        return{
          ...state,
          activeTab: action.payload.tab,
          tickets : action.payload.reTickets
        }
        break;
    case CREATE_TICKETS:
          return { ...state, loadingCreate: true }
          break;
    case CREATE_TICKETS_SUCCESS:
        return { ...state, loadingCreate: false, allTickets: action.payload }
        break;
    case CREATE_TICKETS_FAIL:
        return { ...state,
           loadingCreate: false, 
           error: action.payload,
           errType: TICKET_ERROR_TYPE.CREATE_TICKET,
           errText: action.payload.response.data
        }
        break;
    case TOGGLE_MODAL_CREATE:
        return { ...state, showModalCreateTicket: action.payload }
        break;
    case TOGGLE_DRAWER_EDITOR:
        return { ...state, openDrawerEditor: action.payload }
        break;
    case GET_ACTION_LIST:
        return {...state, actionList: [...action.payload]}
        break;
    case GET_OPTION_LIST_SUCCESS:
        return {...state, optionList: action.payload }
        break;
    case GRIDVIEW_SELECTED_ROW_SUCCESS:
      return {...state, selectedSingleRow: {...action.payload}}
      break;
    case GRIDVIEW_MULTISELECTED_ROW:
      return {...state, selectedMultiRow: [...action.payload]}
      break;
    case POST_TICKET_DETAIL:
      return {  ...state, loadingPost: true }
      break;
    case POST_TICKET_DETAIL_SUCCESS:
       return { ...state, loadingPost: false }
       break;
    case GET_PRIORITY_SUCCESS:
      return {...state, dsPriority: action.payload}
      break;
    case GET_ENHANCEMENT_SUCCESS:
      return {...state, dsEnhancement: action.payload}
      break;
    case GET_FILTERED_SEACRH_TICKET_SUCCESS:
        return { ...state, tickets: action.payload.tickets, searchedId: action.payload.ids,  loadingFetch: false }
        break;
    case RESET_TICKET_STATE:
      return {...state, ...action.payload}
     break;
    case GET_DB_LIST_SUCCESS:
      return {...state, dbList: action.payload }
    break;
    case CHANGE_DB_ACTIVE:
      return {...state, isDBActive: action.payload}
    default:
      return state
  }
}

export default tickets
