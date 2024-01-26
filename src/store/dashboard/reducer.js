import { GET_DASHBOARD_TICKET, GET_DASHBOARD_TICKET_SUCCESS, GET_DASHBOARD_TICKET_FAIL } from "./actionTypes"

const INIT_STATE = {
  dashTicket: [],
  error: {},
}

const dash = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DASHBOARD_TICKET_SUCCESS:
      return { ...state, dashTicket: action.payload }
      break
    case GET_DASHBOARD_TICKET_FAIL:
      return { ...state, error: action.payload }
      break
    default:
      return state
  }
}

export default dash
