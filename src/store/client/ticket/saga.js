import { call, put, takeEvery, select, takeLatest } from "redux-saga/effects"
import {  GET_CLIENT_TICKETS,  POST_CLIENT_TICKET_DETAIL,
         CREATE_CLIENT_TICKETS,
         GET_VERIFY_OPEN_TICKET_FAIL,
         GET_VERIFY_OPEN_TICKET_SUCCESS,
         GET_VERIFY_OPEN_TICKET 

      } from "./actionTypes"
import { getClientTicketsSuccess, getClientTicketsFail, 
         createClientTicketsSuccess,createClientTicketsFail,
         postClientTicketDetailSuccess, postClientTicketDetailFail
        } from "./actions"
import { del, get, post, postForm,  xput } from "../../../helpers/api_helper"
import * as url from "../../../helpers/url_helper"
import { getClientTickets } from "store/actions"
import isEmpty from "helpers/isEmpty_helper"


function* fetchClientTickets(action) {
  try {
    let headers={}
    if(!isEmpty(action.payload.freeToken)){
      headers.Authorization = `Bearer ${action.payload.freeToken}` 
    }
    if(!isEmpty(action.payload.ticketToken)){
      headers.TicketToken = `Bearer ${action.payload.ticketToken}` 
    }
    const response = yield call(() => get(url.UGET_CLIENT_TICKET, {}, headers ))
    yield put(getClientTicketsSuccess(response))
  } catch (error) {
      yield put(getClientTicketsFail(error))
      console.log(error);
    }
  }
  
  function* postClientTicketDetail(action){
    try {
      let headers={}
      if(!isEmpty(action.payload.freeToken)){
        headers.Authorization = `Bearer ${action.payload.freeToken}` 
      }
      const response = yield call(() => postForm(url.UPOST_CLIENTTICKETCOMMENT, action.payload.formData, {}, headers ))
      yield put(postClientTicketDetailSuccess(response))
      yield put(getClientTickets(action.payload.freeToken, action.payload.ticketToken));
    } catch (error) {
      console.log(error)
    }
  }

function* createClientTickets(action){  
  try {
      let headers={}
      if(!isEmpty(action.payload.freeToken)){
        headers.Authorization = `Bearer ${action.payload.freeToken}` 
      }
      const response = yield call(() => postForm(url.UPOST_CLIENT_TICKET,  action.payload.formData, {}, headers ))
      yield put(createClientTicketsSuccess(response)) // create ticket
      if(localStorage.getItem('_cat')){
        yield put(getClientTickets());  // update all tickets and data in gridview activeTab
        action.payload.history.push("/mytickets")
      }
      else{
        action.payload.history.push('/')
      }
  } catch (error) {
    yield put(createClientTicketsFail(error))
    console.log(error)
  }
}

function* verifyOpenTicket(action){
  try{
    let headers={}
    if(!isEmpty(action.payload.freeToken)){
      headers.Authorization = `Bearer ${action.payload.freeToken}` 
    }
    if(!isEmpty(action.payload.ticketToken)){
      headers.TicketToken = `Bearer ${action.payload.ticketToken}` 
    }
    const response = yield call(() => get(url.UGET_CLIENTOPENTICKET_VERIFY+'?code='+action.payload.code, {}, headers ))
    if(response){
      yield put(getClientTickets(action.payload.freeToken, action.payload.ticketToken))
      yield put({type: GET_VERIFY_OPEN_TICKET_SUCCESS})
    }
  }
  catch(error){
    yield put({ type: GET_VERIFY_OPEN_TICKET_FAIL, payload: error })
    console.log(error)
  }
}

function* ticketsClientSaga() {
  yield takeEvery(GET_CLIENT_TICKETS, fetchClientTickets),
  yield takeLatest(POST_CLIENT_TICKET_DETAIL, postClientTicketDetail),
  yield takeEvery(CREATE_CLIENT_TICKETS, createClientTickets),
  yield takeEvery(GET_VERIFY_OPEN_TICKET, verifyOpenTicket)
}

export default ticketsClientSaga
