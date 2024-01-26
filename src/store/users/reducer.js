import { 
  GET_USERS_SUCCESS, GET_USERS_FAIL, 
  POST_USER, POST_USER_SUCCESS, POST_USER_FAIL,
  GET_SENDERS_SUCCESS, GET_SENDERS_FAIL, 
  TOGGLE_MODAL_CREATE_USER,  TOGGLE_MODAL_EDIT_USER,
  API_ERROR,
  GET_ROLES_SUCCESS, GET_DEPARTMENTS_SUCCESS,
  GET_TEAMS_SUCCESS, 
  GET_TEAM_MANAGER,
  GET_TEAM_MEMBER,
  TOGGLE_CARD_CREATE_TEAM, TOGGLE_CARD_EDIT_TEAM,
  TOGGLE_PROFILE_EDIT, GET_PROFILE_SUCCESS, GET_PROFILE_FAIL,
   GET_PROFILE_TEAMS_SUCCESS, GET_PROFILE_TICKETS_ASSIGN_SUCCESS, GET_PROFILE_TICKETS_SUCCESS
  } from "./actionTypes"

const INIT_STATE = {
  allUsers: [],
  allSenders: [],
  allRoles: [],
  allDepartments: [],
  allTeams:[],
  dsTeamManagers: [],
  dsTeamMembers:[],
 
  modalCreateUser:false,
  modalEditUser:false,
  cardCreateTeam:false,
  cardEditTeam:false,
  cardEditTeamId:null,
  editProfileState: false,
  loadPanel: false,
  error: '',

  dsProfile:[],
  dsProfileTeams:[],
  dsProfileTickets: [],
  dsProfileTicketAssign:[]
}

const users = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS: return { ...state, allUsers: action.payload, loadPanel: false, error: '' }
      break;
    case GET_USERS_FAIL: return { ...state, error: action.payload }
      break;
    case POST_USER: return { ...state, loadPanel: true} 
    break;
    case POST_USER_SUCCESS: return { ...state, loadPanel: false, error:'' }
    break;
    case POST_USER_FAIL: return { ...state, error: action.payload, loadPanel: false }
    break;
    case TOGGLE_MODAL_CREATE_USER:  return { ...state, modalCreateUser: action.payload }
    break; 
    case TOGGLE_MODAL_EDIT_USER:  return { ...state, modalEditUser: action.payload }
    break; 
    case GET_ROLES_SUCCESS: return { ...state, allRoles: action.payload }
    break;
    case GET_DEPARTMENTS_SUCCESS: return { ...state, allDepartments: action.payload }
    break;
    case GET_SENDERS_SUCCESS: return { ...state, allSenders: action.payload }
    break;
    case GET_SENDERS_FAIL: return { ...state, error: action.payload }
    break;
    case GET_TEAMS_SUCCESS: return { ...state, allTeams: action.payload }
    break;
    case GET_TEAM_MANAGER: return { ...state, dsTeamManagers: action.payload }
    break;
    case GET_TEAM_MEMBER: return { ...state, dsTeamMembers: action.payload }
    break;
    case TOGGLE_CARD_CREATE_TEAM:  return { ...state, cardCreateTeam: action.payload }
    break;
    case TOGGLE_CARD_EDIT_TEAM:  return { ...state, cardEditTeam: action.payload.show, cardEditTeamId: action.payload.id }
    break;
    case TOGGLE_PROFILE_EDIT:  return { ...state, editProfileState: action.payload }
    break;
    case GET_PROFILE_SUCCESS: return { ...state, dsProfile: action.payload }
    break;
    case GET_PROFILE_FAIL: return { ...state, error: action.payload }
    break;
    case GET_PROFILE_TEAMS_SUCCESS: return { ...state, dsProfileTeams: action.payload} 
    break;
    case GET_PROFILE_TICKETS_SUCCESS: return { ...state, dsProfileTickets: action.payload} 
    break;
    case GET_PROFILE_TICKETS_ASSIGN_SUCCESS: return { ...state, dsProfileTicketAssign: action.payload} 
    break;
    case API_ERROR:
      state = { ...state, error: action.payload, loadPanel: false, modalCreateUser:false }
      break
    default:
      return state
  }
}

export default users
