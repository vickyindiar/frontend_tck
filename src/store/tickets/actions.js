import {
        GET_TICKETS, GET_TICKETS_FAIL, GET_TICKETS_SUCCESS,
        CHANGE_TICKETS,
        CHANGE_ACTIVE_TAB, ACTIVE_TAB_TYPE,
        CREATE_TICKETS, CREATE_TICKETS_SUCCESS, CREATE_TICKETS_FAIL,
        TOGGLE_MODAL_CREATE, TOGGLE_DRAWER_EDITOR, GET_ACTION_LIST, GET_OPTION_LIST, GET_OPTION_LIST_SUCCESS,
        GRIDVIEW_SELECTED_ROW, GRIDVIEW_MULTISELECTED_ROW,
        POST_TICKET_DETAIL, POST_TICKET_DETAIL_FAIL, POST_TICKET_DETAIL_SUCCESS,
        UPDATE_TICKET_STATUS, UPDATE_TICKET_STATUS_SUCCESS,
        POST_TICKET_ASSIGN, POST_TICKET_ASSIGN_SUCCESS,
        UPDATE_TICKET_ASSIGN_VIEWED,
        UPDATE_TICKET_COMMENT,
        DELETE_TICKET_COMMENT,
        GET_PRIORITY,
        GET_ENHANCEMENT,
        GET_PRIORITY_SUCCESS,
        GET_ENHANCEMENT_SUCCESS,
        PUT_PRIORITY_ENHANCE,
        GRIDVIEW_SELECTED_ROW_SUCCESS,
        GET_FILTERED_SEACRH_TICKET,
        GET_FILTERED_SEACRH_TICKET_SUCCESS,
        GET_DB_LIST,
        GET_DB_LIST_SUCCESS,
        CHANGE_DB_ACTIVE
  } from "./actionTypes"

  import { decryptData, _slt } from '../../helpers/crypt_helper'
  import isEmpty from '../../helpers/isEmpty_helper'
  import { minBy } from "lodash"
  import DataSource from 'devextreme/data/data_source';

export const getTickets = () => {
  return { type: GET_TICKETS }
}

export const getTicketsSuccess = tickets => {
  return {
  type: GET_TICKETS_SUCCESS,
  payload: tickets,
}}

export const getTicketsFail = error => { return {
  type: GET_TICKETS_FAIL,
  payload: error,
}}

export const getFilteredSearchTicket = text => {
  let formData = new FormData()
  formData.append('text', text) 
  return {
    type: GET_FILTERED_SEACRH_TICKET,
    payload: formData
}}

export const getFilteredSearchTicketSuccess = (ids, tickets) => {

  let reTickets = [];
  if(!isEmpty(ids)){
    reTickets = tickets.filter(f => ids.includes(f.id));
  }
  else{
    reTickets = [...tickets];
  }
  return {
    type: GET_FILTERED_SEACRH_TICKET_SUCCESS,
    payload: { tickets : reTickets, ids: ids}
}}

export const changeTickets = tickets => {
  return {
  type: CHANGE_TICKETS,
  payload: tickets,
}}

export const createTickets = (dataSubmit) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
 }
  return { type: CREATE_TICKETS, payload: formData}
}

export const createTicketsSuccess = tickets => {

  return {
    type: CREATE_TICKETS_SUCCESS,
    payload: tickets
  }
}

export const createTicketsFail = error => {
  return {
    type: CREATE_TICKETS_FAIL,
    payload: error
  }
}

export const toggleModalCreate = modal => {
  return {
    type: TOGGLE_MODAL_CREATE,
    payload: modal
  }
}

export const toggleDrawerEditor = modal => {
  return {
    type: TOGGLE_DRAWER_EDITOR,
    payload: modal
  }
}

export const changeActiveTab = (tab, allTickets, activeUser, activeRole, activedDept ) => {
  let reTickets = [];
  let filtered  = [];
 switch (tab) {
    case ACTIVE_TAB_TYPE.ALL:
       reTickets = [...allTickets];
    break;
    case ACTIVE_TAB_TYPE.NEW_ASSIGNED:
      reTickets = [...allTickets.filter(e => {
        if(activeRole.id < 2 ){
          let assignManager = e.ticketAssigns.find(f => f.assignType === "M");
          if(assignManager) return (assignManager.assignType === "M" && assignManager.viewed === false)
          else 
            return true;
        }
        else{
          let assigned = e.ticketAssigns.find(f => f.userId === activeUser.id);
          if(assigned) return (assigned.viewed === false)
          else 
            return true;
        }
      })];
     break;
    case ACTIVE_TAB_TYPE.UNASSIGNED:
       filtered = allTickets.filter(e => {
       return ( e.ticketAssigns.length === 1 && e.ticketAssigns[0].assignType === "M" )
      })
      reTickets = [...filtered]
      break;
    case ACTIVE_TAB_TYPE.PENDING:
       filtered = allTickets.filter(e => { return  e.status.id === 4  });
       reTickets = [...filtered]
      break;
    case ACTIVE_TAB_TYPE.RECENTLY_UPDATE:
      filtered = allTickets.filter(e => { return  !isEmpty(e.updatedAt)  });
      filtered.sort((a, b) => { return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()});
      reTickets = [...filtered]
      break;
    case ACTIVE_TAB_TYPE.RECENTLY_SOLVED:
      filtered = allTickets.filter(e => { return  e.status.id === 5 });
      filtered.sort((a, b) => { return new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()});
      reTickets = [...filtered]
      break;
    case ACTIVE_TAB_TYPE.INPROGRESS:
      filtered = allTickets.filter(e => { return  e.status.id === 3 });
      reTickets = [...filtered]
    break;
    default:
     break;
 }
  return {
    type: CHANGE_ACTIVE_TAB,
    payload: {tab, reTickets}
  }
}

export const getActionList = () => {
  const list = [
    { value: 'T', text: 'Assign To Team', ar:[1, 2, 3], ad:[1, 2, 3] },
    { value: 'U', text: 'Assign To User', ar:[1, 2, 3], ad:[1, 2, 3] },
    { value: 'S', text: 'Update Status', ar:['all'], ad:['all']}
  //  { value: 'D', text: 'Delete',  ar:['all'], ad:['all'] }
  ]
  let ar = JSON.parse(decryptData(localStorage.getItem("_ar"), _slt))
  let ad = JSON.parse(decryptData(localStorage.getItem("_ad"), _slt))
  let filteredList = list.filter(e => (e.ar.includes('all') || e.ar.includes(ar.roleId) && (e.ad.includes('all') || e.ad.includes(ad.departmentId) )))

  return {
    type: GET_ACTION_LIST,
    payload: filteredList
  }
}

export const getOptionList = (type) => {
  return{
    type: GET_OPTION_LIST,
    payload: type
  } 
}

export const getOptionListSuccess = ({response, assignType, activeUser, activeRole, activeDept, selectedSingleRow}) => {
  let optionList = [];
  if(assignType === 'T'){ optionList = [...response] }
  else if(assignType === 'U'){
    optionList = [];
    if(activeRole.roleId === 3){  //config for manager
      optionList = response.filter(f => {
        let mRole = minBy(f.userRoles, 'roleId');
        f.maxRole = mRole.roles.name;
        f.maxRoleId = mRole.roleId;

        let isHasHigherRole = (f.userRoles.filter(fI => fI.roleId >= activeRole.roleId).length > 0);
        let isHasDiffDept = (f.userDepts.filter(fI => fI.departmentId !== activeDept.departmentId).length > 0);
        let isHasDept = (f.userDepts.filter(fI => fI.departmentId === activeDept.departmentId).length > 0);
        return ( 
          (isHasHigherRole && isHasDept) || (isHasDiffDept)
        )
      });
     optionList = optionList.sort((a, b) => a.maxRoleId - b.maxRoleId);

    }
    else if(activeRole === 4){
      optionList = response.filter(f => {
        let isHasHigherRole = (f.userRoles.filter(fI => fI.roleId >= activeRole.roleId).length > 0);
        let isHasDiffDept = (f.userDepts.filter(fI => fI.departmentId !== activeDept.departmentId).length > 0);
        let isHasDept = (f.userDepts.filter(fI => fI.departmentId === activeDept.departmentId).length > 0);
        return ( 
          (isHasHigherRole && isHasDept) || (isHasDiffDept)
        )
      });
    }
    else {
      optionList = [...response]
    }
  }
  else if(assignType === 'S'){ optionList = [...response] } 
  else if(assignType === 'D'){ response = [] } //delete

  return {
    type: GET_OPTION_LIST_SUCCESS,
    payload: optionList
  }
}

// 
export const setSelectedSingleRow = (row) => {
  return { type: GRIDVIEW_SELECTED_ROW, payload: row}
}
export const setSelectedSingleRowSuccess = (detail) => {
  return {type:GRIDVIEW_SELECTED_ROW_SUCCESS, payload: detail}
}

export const setSelectedMultiRow = (rows) => {
  return { type: GRIDVIEW_MULTISELECTED_ROW, payload: rows}
}

export const postTicketDetail = (dataSubmit) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return { type : POST_TICKET_DETAIL, payload: formData }
}

export const postTicketDetailSuccess = tickets => {
  return {
    type: POST_TICKET_DETAIL_SUCCESS,
    payload: tickets
  }
}

export const postTicketDetailFail = error => {
  return {
    type: POST_TICKET_DETAIL_FAIL,
    error: error
  }
}

export const updateTicketStatus = (dataSubmit) => {
  return { type : UPDATE_TICKET_STATUS, payload: dataSubmit }
}

export const updateTicketStatusSuccess = tickets => {
  return {
    type: UPDATE_TICKET_STATUS_SUCCESS,
    payload: tickets
  }
}

export const updateTicketAssignViewed = (param) => {
  return { type: UPDATE_TICKET_ASSIGN_VIEWED  , payload: param }
}

export const postTicketAssign = (param) => {
  return { type : POST_TICKET_ASSIGN, payload: param }
}

export const postTicketAssignSuccess = tickets => {
  return {
    type: POST_TICKET_ASSIGN_SUCCESS,
    payload: tickets
  }
}

export const updateTicketComment = (comment) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(comment)) {
     if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return{
    type: UPDATE_TICKET_COMMENT,
    payload: formData
  }
}

export const deleteTicketComment = (comment) => {
  return{
    type: DELETE_TICKET_COMMENT,
    payload: comment
  }
}

export const getPriority = (freeToken) => ({ type: GET_PRIORITY, payload:{token:freeToken} })

export const getPrioritySuccess = (pr) => ({ type: GET_PRIORITY_SUCCESS, payload: pr })

export const getEnhancement = () => ({ type: GET_ENHANCEMENT })

export const getEnhancementSuccess = (eh) => ({ type: GET_ENHANCEMENT_SUCCESS, payload: eh })

export const updatePriorityEnhance = (data) => ( { type : PUT_PRIORITY_ENHANCE, payload: data } )

export const getDBList = (type) => {
  return{
    type: GET_DB_LIST,
    payload: type
  } 
}

export const getDBListSuccess = ({response}) => {
  let dbList =  []
  response.forEach(f => {
    let nData = {}
    nData.text = f.year
    nData.value = f.year
    nData.active = f.active
    dbList.push(nData)
  })
  return {
    type: GET_DB_LIST_SUCCESS,
    payload: dbList
  }
}

export const changeDBActive = (data) => {
  return {
    type: CHANGE_DB_ACTIVE,
    payload: data
  }
}


