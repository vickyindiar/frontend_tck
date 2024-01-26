import {  GET_KBASES, GET_KBASES_SUCCESS, GET_KBASES_FAIL,
          GET_KBASES_BYID, GET_KBASES_BYID_SUCCESS, GET_KBASES_BYID_FAIL,
          GET_KBASES_BY_APP, GET_KBASES_BY_APP_SUCCESS, GET_KBASES_BY_APP_FAIL,
          POST_KBASE, POST_KBASE_SUCCESS, POST_KBASE_FAIL,
          TOGGLE_MODAL_CREATE_KBASE, TOGGLE_MODAL_EDIT_KBASE,
          DO_FILTER_KBASES, 
          PUT_KBASE,
          DELETE_KBASE,
          CHANGE_APP_ACTIVE,
          CHANGE_MODULE_ACTIVE} from "./actionTypes"

export const getKbases = (freeToken) => ({ type: GET_KBASES, payload:{freeToken} })
export const getKbasesSuccess = kbase => ({ type: GET_KBASES_SUCCESS, payload: kbase })
export const getKbasesFail = error => ({ type: GET_KBASES_FAIL, payload: error })

export const getKbasesById = (id, freeToken) => ({ type: GET_KBASES_BYID, payload:{ id, freeToken} })
export const getKbasesByIdSuccess = kbase => ({ type: GET_KBASES_BYID_SUCCESS, payload: kbase })
export const getKbasesByIdFail = error => ({ type: GET_KBASES_BYID_FAIL, payload: error })

export const getKbasesByApp = (appId, moduleId, freeToken) => { return { type: GET_KBASES_BY_APP, payload: {appId, moduleId, freeToken}} }
export const getKbasesByAppSuccess = kbase => ({ type: GET_KBASES_BY_APP_SUCCESS, payload: kbase })
export const getKbasesByAppFail = error => ({ type: GET_KBASES_BY_APP_FAIL, payload: error })

export const postKbases = (dataSubmit, appId, moduleId) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
    if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return { type : POST_KBASE, payload: {data: formData, appId, moduleId} }
}

export const postKbasesSuccess = faqs => ({ type: POST_KBASE_SUCCESS, payload: faqs })
export const postKbasesFail = error => ({ type: POST_KBASE_FAIL, payload: error })

export const toggleModalCreateKbase = modal => { 
  return { type: TOGGLE_MODAL_CREATE_KBASE, payload: modal } 
}
  
export const updateKbase = (dataSubmit, appId, moduleId) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
    if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return{ type: PUT_KBASE, payload: { data: formData, id:dataSubmit.Id, appId, moduleId, history } }
}

export const toggleModalEditKbase = modal => { return { type: TOGGLE_MODAL_EDIT_KBASE, payload: modal } }
export const deleteKbase = (id, appId, moduleId, history) => { return {type: DELETE_KBASE, payload: {id, appId, moduleId, history } } } 

export const doFilterKbases = (filter) => {
    return { type: DO_FILTER_KBASES, payload: filter  }
}

export const changeAppActive = (app) => ({ type:CHANGE_APP_ACTIVE, payload:app})
export const changeModuleActive = (module) => ({ type:CHANGE_MODULE_ACTIVE, payload:module})
