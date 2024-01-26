import { call, put, takeEvery, select, takeLatest } from "redux-saga/effects"
import { CREATE_TICKETS, GET_TICKETS, GRIDVIEW_SELECTED_ROW, GET_OPTION_LIST, POST_TICKET_DETAIL, POST_TICKET_ASSIGN,
         UPDATE_TICKET_STATUS, UPDATE_TICKET_ASSIGN_VIEWED,
        DELETE_TICKET_COMMENT, UPDATE_TICKET_COMMENT, GET_PRIORITY, GET_ENHANCEMENT, PUT_PRIORITY_ENHANCE,  GET_FILTERED_SEACRH_TICKET, GET_DB_LIST } from "./actionTypes"
import { getTicketsSuccess, getTicketsFail, createTicketsSuccess,
         createTicketsFail, getTickets, changeActiveTab, toggleModalCreate,
         getOptionListSuccess,
         setSelectedSingleRow,
         setSelectedSingleRowSuccess,
         postTicketDetailSuccess, postTicketDetailFail,
         postTicketAssignSuccess,
         updateTicketStatusSuccess,
         getFilteredSearchTicketSuccess,
         getDBListSuccess
        } from "./actions"
import { del, get, post, postForm,  xput } from "../../helpers/api_helper"
import * as url from "../../helpers/url_helper"
import { getEnhancementSuccess, getPrioritySuccess  } from "store/actions"
import isEmpty from "helpers/isEmpty_helper"

function* fetchTickets() {
  try {
     let activeRole = yield select((state) =>  state.Login.activeRole);
     let activeUser = yield select((state) =>  state.Login.user);
     let qUrl = `${url.UGET_TICKET}?u=${activeUser.id}&r=${activeRole.roleId}`;
      const response = yield call(() => get(qUrl))
      yield put(getTicketsSuccess(response))
      let allTickets = yield select((state) =>  state.tickets.allTickets)
      let activeTab = yield select((state) => state.tickets.activeTab)
      yield put(changeActiveTab(activeTab, allTickets, activeUser, activeRole)) // purpose : update last data in gridview active tab
  
      let oldSelectedRow = yield select((state) =>  state.tickets.selectedSingleRow)
      if(!isEmpty(oldSelectedRow)){
        let sRow = yield allTickets.find(f => f.id === oldSelectedRow.id)
        yield put(setSelectedSingleRow(sRow)) //update selected single row
      }
  
    } catch (error) {
      yield put(getTicketsFail(error))
      console.log(error);
  }
}

function* fecthTicketDetails(action){
  try{
    const response = yield call(() => get(url.UGET_SELECTED_TICKET_DETAIL+'/'+action.payload.id))
    yield put(setSelectedSingleRowSuccess(response[0]));
  }
  catch(error){
    console.log(error)
  }
}

function* createTickets(action){  
  try {
      const response = yield call(() => postForm(url.UPOST_TICKET,  action.payload))
      yield put(toggleModalCreate(false)) //close modal create
      yield put(createTicketsSuccess(response)) // create ticket
      yield put(getTickets());  // update all tickets and data in gridview activeTab
      localStorage.removeItem('draf_ticket')
  } catch (error) {
    if(error.message === 'Network Error'){
      console.log(error)
      window.location.reload()
    }
    yield put(createTicketsFail(error))
   
  }
}

function* fetchOptionList(action){
  try {
    let response = [];
    let activeUser = yield select((state) =>  state.Login.user);
    let activeRole = yield select((state) =>  state.Login.activeRole);
    let activeDept = yield select((state) =>  state.Login.activeDept);
    let selectedSingleRow = yield select((state) =>  state.tickets.selectedSingleRow);

    if(action.payload === 'T'){ response = yield call(() => get(url.UGET_TEAMS)) }
    else if(action.payload === 'U'){ response = yield call(() => get(url.UGET_USERS)) }
    else if(action.payload === 'S'){ response = yield call(() => get(url.UGET_STATUS)) } 
    else if(action.payload === 'D'){ response = [] } //delete
    let param = {
      response,
      assignType: action.payload, 
      activeUser, 
      activeRole, 
      activeDept, 
      selectedSingleRow
    }
    yield put(getOptionListSuccess(param))
    
  } catch (error) {
    console.log(error.response);
  }
}

function* postTicketDetail(action){
  try {
    const response = yield call(() => postForm(url.UPOST_TICKETCOMMENT, action.payload))
    yield put(postTicketDetailSuccess(response))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* postTicketAssign(action){
  try {
    yield call(() => post(url.UPOST_TICKETASSIGN, action.payload ))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* updateTicketStatus(action){
  try {
    yield call(() => post(url.UUPDATE_TICKETSTATUS, action.payload))
    //yield put(updateTicketStatusSuccess(response))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* updateTicketAssignViewed(action){
  try {
    yield call(() => post(url.UUPDATE_TICKETASSIGNVIEWED, action.payload))
   // yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* updateTicketComment(action){
  try {
    yield call(() => postForm(url.UUPDATE_TICKETCOMMENT, action.payload))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* deleteTicketComment(action){
  try {
    yield call(() => post(url.UDELETE_TICKETCOMMENT, action.payload))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}
function* fetchPriority(action){
  try {
    let headers={}
    if(!isEmpty(action.payload.token)){
      headers.Authorization = `Bearer ${action.payload.token}` 
    }
    const response = yield call(() => get(url.UGET_PRIORITY, {}, headers))
    yield put( getPrioritySuccess(response));
  } catch (error) {
    console.log(error.response)
  }
}
function* fetchEnhancement(action){
  try {
    const response = yield call(() => get(url.UGET_ENHANCEMENT, action.payload))
    yield put(getEnhancementSuccess(response));
  } catch (error) {
    console.log(error.response)
  }
}

function* updatePriorityEnhance(action){
  try {
    yield call(() => post(url.UUPDATE_PRIORITY_ENHANCE+'/'+action.payload.Id, action.payload))
    yield put(getTickets());
  } catch (error) {
    console.log(error.response)
  }
}

function* fetchFilteredTicket(action){
  try{
      const response = yield call(() => postForm(url.UGET_FILTERED_SEARCH_TICKET, action.payload  ))

       let activeRole = yield select((state) =>  state.Login.activeRole);
       let activeUser = yield select((state) =>  state.Login.user);
       let allTickets = yield select((state) =>  state.tickets.allTickets)
       let activeTab = yield select((state) => state.tickets.activeTab)
       yield put(changeActiveTab(activeTab, allTickets, activeUser, activeRole)) 
       let tickets = yield select((state) => state.tickets.tickets)
      yield put(getFilteredSearchTicketSuccess(response, tickets))
  }
  catch(error){
    console.log(error)
  }
}

function* fetchDBList(action){
  try {
    let response = [];
    response = yield call(() => get(url.UGET_DB_LIST))
    let param = { response }
    yield put(getDBListSuccess(param))
  } catch (error) {
    console.log(error.response);
  }
}

function* ticketsSaga() {
  yield takeEvery(GET_TICKETS, fetchTickets),
  yield takeEvery(GRIDVIEW_SELECTED_ROW, fecthTicketDetails)
  yield takeEvery(CREATE_TICKETS, createTickets),
  yield takeEvery(GET_OPTION_LIST, fetchOptionList),
  yield takeLatest(POST_TICKET_DETAIL, postTicketDetail),
  yield takeLatest(POST_TICKET_ASSIGN, postTicketAssign),
  yield takeEvery(UPDATE_TICKET_STATUS, updateTicketStatus),
  yield takeEvery(UPDATE_TICKET_ASSIGN_VIEWED, updateTicketAssignViewed),
  yield takeEvery(UPDATE_TICKET_COMMENT, updateTicketComment),
  yield takeEvery(DELETE_TICKET_COMMENT, deleteTicketComment),
  yield takeEvery(GET_PRIORITY, fetchPriority),
  yield takeEvery(GET_ENHANCEMENT, fetchEnhancement),
  yield takeEvery(PUT_PRIORITY_ENHANCE, updatePriorityEnhance)
  yield takeLatest(GET_FILTERED_SEACRH_TICKET, fetchFilteredTicket)
  yield takeEvery(GET_DB_LIST, fetchDBList)
}

export default ticketsSaga
