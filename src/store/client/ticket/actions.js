import {
        GET_CLIENT_TICKETS, GET_CLIENT_TICKETS_SUCCESS, GET_CLIENT_TICKETS_FAIL,
        CHANGE_CLIENT_ACTIVE_TICKET,
        POST_CLIENT_TICKET_DETAIL, POST_CLIENT_TICKET_DETAIL_SUCCESS,  POST_CLIENT_TICKET_DETAIL_FAIL, 
        CREATE_CLIENT_TICKETS, CREATE_CLIENT_TICKETS_SUCCESS, CREATE_CLIENT_TICKETS_FAIL, TOGGLE_VERIFY_OPEN_TICKET, GET_VERIFY_OPEN_TICKET, GET_VERIFY_OPEN_TICKET_SUCCESS,

        // CHANGE_TICKETS,
        // CHANGE_ACTIVE_TAB, ACTIVE_TAB_TYPE,
        // TOGGLE_MODAL_CREATE, TOGGLE_DRAWER_EDITOR, GET_ACTION_LIST, GET_OPTION_LIST, GET_OPTION_LIST_SUCCESS,
        // GRIDVIEW_SELECTED_ROW, GRIDVIEW_MULTISELECTED_ROW,

        // UPDATE_TICKET_STATUS, UPDATE_TICKET_STATUS_SUCCESS,
        // POST_TICKET_ASSIGN, POST_TICKET_ASSIGN_SUCCESS,
        // UPDATE_TICKET_ASSIGN_VIEWED,
        // UPDATE_TICKET_COMMENT,
        // DELETE_TICKET_COMMENT
      } from "./actionTypes"

  import { decryptData, _slt } from '../../../helpers/crypt_helper'
  import isEmpty from '../../../helpers/isEmpty_helper'
  import { minBy } from "lodash"


export const getClientTickets = (freeToken, ticketToken) => { return { type: GET_CLIENT_TICKETS, payload: {freeToken, ticketToken} } }
export const getClientTicketsSuccess = tickets => { return { type: GET_CLIENT_TICKETS_SUCCESS, payload: tickets, }}
export const getClientTicketsFail = error => { return { type: GET_CLIENT_TICKETS_FAIL, payload: error }}
export const changeClientActiveTicket = (id) => { return {type: CHANGE_CLIENT_ACTIVE_TICKET, payload: id}}
export const postClientTicketDetail = (dataSubmit, freeToken, ticketToken) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     if(key === 'medias'){
       value.forEach((file, i) => {
         formData.append(`file`, file)
        });
      } 
      else{ formData.append(key, value) }
    }
    return { type : POST_CLIENT_TICKET_DETAIL, payload: {formData, freeToken, ticketToken}}
}
  
export const postClientTicketDetailSuccess = tickets => {
  return {
    type: POST_CLIENT_TICKET_DETAIL_SUCCESS,
    payload: tickets
  }
}

export const postClientTicketDetailFail = error => {
  return {
    type: POST_CLIENT_TICKET_DETAIL_FAIL,
    error: error
  }
}

export const createClientTickets = (dataSubmit, history, freeToken) => {
    let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
      if(key === 'medias'){
      value.forEach((file, i) => {
          formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return { type: CREATE_CLIENT_TICKETS, payload: {formData, history, freeToken}}
}

export const createClientTicketsSuccess = tickets => {
  return {
    type: CREATE_CLIENT_TICKETS_SUCCESS,
    payload: tickets
  }
}

export const createClientTicketsFail = error => {
  return {
    type: CREATE_CLIENT_TICKETS_FAIL,
    error: error
  }
}

export const toggleVerifyOpenTicket = modal => {
  return {
    type: TOGGLE_VERIFY_OPEN_TICKET,
    payload: modal
  }
}

export const verificationOpenTicket = (freeToken, ticketToken, code, history) => {
  return {
    type: GET_VERIFY_OPEN_TICKET,
    payload: {code, freeToken, ticketToken, history}
  }
}


// export const updateTicketStatus = (dataSubmit) => {
//   return { type : UPDATE_TICKET_STATUS, payload: dataSubmit }
// }

// export const updateTicketStatusSuccess = tickets => {
//   return {
//     type: UPDATE_TICKET_STATUS_SUCCESS,
//     payload: tickets
//   }
// }

// export const updateTicketAssignViewed = (param) => {
//   return { type: UPDATE_TICKET_ASSIGN_VIEWED  , payload: param }
// }

// export const updateTicketComment = (comment) => {
//   let formData = new FormData()
//   for (let [key, value] of Object.entries(comment)) {
//      if(key === 'medias'){
//       value.forEach((file, i) => {
//         formData.append(`file`, file)
//       });
//     } 
//     else{ formData.append(key, value) }
//   }
//   return{
//     type: UPDATE_TICKET_COMMENT,
//     payload: formData
//   }
// }

// export const deleteTicketComment = (comment) => {
//   return{
//     type: DELETE_TICKET_COMMENT,
//     payload: comment
//   }
// }

