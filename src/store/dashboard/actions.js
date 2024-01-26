import { GET_DASHBOARD_TICKET, GET_DASHBOARD_TICKET_SUCCESS, GET_DASHBOARD_TICKET_FAIL } from "./actionTypes"

export const getDashTicket = () => ({
  type: GET_DASHBOARD_TICKET
})

export const getDashTicketSuccess = tickets => ({
  type: GET_DASHBOARD_TICKET_SUCCESS,
  payload: tickets,
})

export const getDashTicketFail = error => ({
  type: GET_DASHBOARD_TICKET_FAIL,
  payload: error,
})
