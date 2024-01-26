import { 
  API_ERROR,
  GET_USERS, GET_USERS_SUCCESS, GET_USERS_FAIL,
  POST_USER, POST_USER_SUCCESS, POST_USER_FAIL, TOGGLE_MODAL_CREATE_USER,
  PUT_USER, TOGGLE_MODAL_EDIT_USER,
  DELETE_USER,
  GET_SENDERS, GET_SENDERS_SUCCESS, GET_SENDERS_FAIL,
  GET_ROLES, GET_ROLES_SUCCESS, 
  GET_DEPARTMENTS, GET_DEPARTMENTS_SUCCESS,
  GET_TEAMS, GET_TEAMS_SUCCESS, GET_TEAMS_FAIL, 
  GET_TEAM_MANAGER, 
  GET_TEAM_MEMBER,
  POST_TEAM, POST_TEAM_SUCCESS, POST_TEAM_FAIL, TOGGLE_CARD_CREATE_TEAM,
  PUT_TEAM, TOGGLE_CARD_EDIT_TEAM,
  DELETE_TEAM,
  GET_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_FAIL,
  PUT_PROFILE, TOGGLE_PROFILE_EDIT,
  GET_PROFILE_TEAMS, GET_PROFILE_TEAMS_SUCCESS, 
  GET_PROFILE_TICKETS, GET_PROFILE_TICKETS_SUCCESS,
  GET_PROFILE_TICKETS_ASSIGN, GET_PROFILE_TICKETS_ASSIGN_SUCCESS
} from "./actionTypes"

export const getUsers = () => ({ type: GET_USERS })

export const getUsersSuccess = users => ({ type: GET_USERS_SUCCESS, payload: users, })

export const getUsersFail = error => ({ type: GET_USERS_FAIL, payload: error, })

export const postUsers = (dataSubmit) =>{ 
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
 return { type: POST_USER, payload: formData }
 }

export const postUsersSuccess = users => ({ type: POST_USER_SUCCESS, payload: users })
export const postUsersFail = error => ({ type: POST_USER_FAIL, payload: error })
export const toggleModalCreateUser = modal => { return { type: TOGGLE_MODAL_CREATE_USER, payload: modal } }

export const updateUser = (dataSubmit) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return{ type: PUT_USER, payload: {id: dataSubmit.Id, formData} }
}

export const toggleModalEditUser = modal => { return { type: TOGGLE_MODAL_EDIT_USER, payload: modal } }
export const deleteUser = (id) => { return {type: DELETE_USER, payload: {id} } } 



export const getRoles = () => ({ type: GET_ROLES })
export const getRolesSuccess = role => ({ type: GET_ROLES_SUCCESS, payload: role })
export const getDepartments = () => ({ type: GET_DEPARTMENTS })
export const getDepartmentsSuccess = depts => ({ type: GET_DEPARTMENTS_SUCCESS, payload: depts })


export const getSenders = () => ({ type: GET_SENDERS })
export const getSendersSuccess = sender => ({ type: GET_SENDERS_SUCCESS, payload: sender })
export const getSendersFail = error => ({ type: GET_SENDERS_FAIL, payload: error })


export const getTeams = (type) => ({ type: GET_TEAMS, payload:type })
export const getTeamsSuccess = teams => ({ type: GET_TEAMS_SUCCESS, payload: teams })
export const getTeamsFail = error => ({ type: GET_TEAMS_FAIL, payload: error })
export const toggleCardCreateTeam = show => { return { type: TOGGLE_CARD_CREATE_TEAM, payload: show } }
export const postTeams = (dataSubmit) =>{ return { type: POST_TEAM, payload: dataSubmit } }
export const postTeamsSuccess = teams => ({ type: POST_TEAM_SUCCESS, payload: teams })
export const postTeamsFail = error => ({ type: POST_TEAM_FAIL, payload: error })

export const toggleCardEditTeam = (show, id) => { return { type: TOGGLE_CARD_EDIT_TEAM, payload: {show, id}  } }
export const updateTeam = (dataSubmit) => { return{ type: PUT_TEAM, payload: {id: dataSubmit.Id, data:dataSubmit} } }
export const deleteTeam = (id) => { return {type: DELETE_TEAM, payload: {id} } } 

export const getTeamManger = users => {
  let mFilter = users.filter(f => f.userRoles.some(s => s.roleId === 3));
 return { type: GET_TEAM_MANAGER, payload: mFilter }
}
export const getTeamMember = users => {
  let mFilter = users.filter(f => f.userRoles.some(s => s.roleId === 4));
  return{ type: GET_TEAM_MEMBER, payload: mFilter }
}

export const getProfile = (id) => ({ type: GET_PROFILE, payload: id })
export const getProfileSuccess = profile => ({ type: GET_PROFILE_SUCCESS, payload: profile })
export const getProfileFail = error => ({ type: GET_PROFILE_FAIL, payload: error })
export const updateProfile = (dataSubmit, relogin, history) => {  
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return{ type: PUT_PROFILE, payload: {id: dataSubmit.Id, relogin, history, formData} } 
}
export const toggleProfileEdit = show => { return { type: TOGGLE_PROFILE_EDIT, payload: show  } }
export const getProfileTeams = () => ({ type: GET_PROFILE_TEAMS})
export const getProfileTeamsSuccess = teams => ({ type: GET_PROFILE_TEAMS_SUCCESS, payload: teams })

export const getProfileTickets = () => ({ type: GET_PROFILE_TICKETS })
export const getProfileTicketsSuccess = tickets => ({ type: GET_PROFILE_TICKETS_SUCCESS, payload: tickets })

export const getProfileTicketAssign = (id) => ({ type: GET_PROFILE_TICKETS_ASSIGN, payload:id})
export const getProfileTicketAssignSuccess = tickets => ({ type: GET_PROFILE_TICKETS_ASSIGN_SUCCESS, payload: tickets })




export const apiError = error => { return { type: API_ERROR, payload: error.response.data } }

