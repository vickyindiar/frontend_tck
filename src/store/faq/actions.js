import {  GET_FAQS, GET_FAQS_SUCCESS, GET_FAQS_FAIL,
          GET_FAQS_BY_APP, GET_FAQS_BY_APP_SUCCESS, GET_FAQS_BY_APP_FAIL,
          GET_FAQ_TYPE, GET_FAQ_TYPE_SUCCESS, GET_FAQ_TYPE_FAIL,
          POST_FAQ, POST_FAQ_SUCCESS, POST_FAQ_FAIL,
          TOGGLE_MODAL_CREATE_FAQ, TOGGLE_MODAL_EDIT_FAQ,
          DO_FILTER_FAQS, 
          GET_LATEST_VER_APP,
          GET_LATEST_VER_APP_SUCCESS,
          GET_LATEST_VER_APP_FAIL, 
          PUT_FAQ,
          DELETE_FAQ,
          CHANGE_MODULE_TAB_ACTIVE} from "./actionTypes"

export const getFaqs = (freeToken) => ({ type: GET_FAQS, payload:{freeToken}})
export const getFaqsSuccess = faqs => ({ type: GET_FAQS_SUCCESS, payload: faqs })
export const getFaqsFail = error => ({ type: GET_FAQS_FAIL, payload: error })

export const getFaqsByApp = (appId, freeToken) => { return { type: GET_FAQS_BY_APP, payload: {appId, freeToken  }} }
export const getFaqsByAppSuccess = faqs => ({ type: GET_FAQS_BY_APP_SUCCESS, payload: faqs })
export const getFaqsByAppFail = error => ({ type: GET_FAQS_BY_APP_FAIL, payload: error })

export const postFaqs = (dataSubmit, appId) =>{ return { type: POST_FAQ, payload: { dataSubmit, appId } } }
export const postFaqsSuccess = faqs => ({ type: POST_FAQ_SUCCESS, payload: faqs })
export const postFaqsFail = error => ({ type: POST_FAQ_FAIL, payload: error })
export const toggleModalCreateFaq = modal => { return { type: TOGGLE_MODAL_CREATE_FAQ, payload: modal } }
  
export const updateFaq = (dataSubmit, appId) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
     formData.append(key, value) 
  }
  return{ type: PUT_FAQ, payload: { formData, appId } }
}

export const toggleModalEditFaq = modal => { return { type: TOGGLE_MODAL_EDIT_FAQ, payload: modal } }
export const deleteFaq = (id) => { return {type: DELETE_FAQ, payload: id } } 

export const doFilterFaqs = (filter) => {
    return { type: DO_FILTER_FAQS, payload: filter  }
}


export const changeModuleTab = (module) => ({ type:CHANGE_MODULE_TAB_ACTIVE, payload:module})
