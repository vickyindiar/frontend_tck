import {  GET_CLOGS, GET_CLOGS_SUCCESS, GET_CLOGS_FAIL,
          GET_CLOG_TYPE, GET_CLOG_TYPE_SUCCESS, GET_CLOG_TYPE_FAIL,
          POST_CLOG, POST_CLOG_SUCCESS, POST_CLOG_FAIL,
          TOGGLE_MODAL_CREATE_CLOG, TOGGLE_MODAL_EDIT_CLOG,
          DO_FILTER_CLOGS, 
          GET_LATEST_VER_APP,
          GET_LATEST_VER_APP_SUCCESS,
          GET_LATEST_VER_APP_FAIL, 
          PUT_CLOG,
          DELETE_CLOG,
          GET_LATEST_CLOG,
          GET_LATEST_CLOG_SUCCESS,
          GET_LATEST_CLOG_FAIL,
          SET_APP_ACTIVE} from "./actionTypes"

export const getCLogs = (app) => ({ type: GET_CLOGS, payload: app })
export const getCLogsSuccess = clogs => ({ type: GET_CLOGS_SUCCESS, payload: clogs })
export const getCLogsFail = error => ({ type: GET_CLOGS_FAIL, payload: error })

export const postCLogs = (dataSubmit) =>{ 
    let formData = new FormData()
    for (let [key, value] of Object.entries(dataSubmit)) {
       if(key === 'medias'){
        value.forEach((file, i) => {
          formData.append(`file`, file)
        });
      } 
      else{ formData.append(key, value) }
    }
   return { type: POST_CLOG, payload: formData }
}
export const postCLogsSuccess = clogs => ({ type: POST_CLOG_SUCCESS, payload: clogs })
export const postCLogsFail = error => ({ type: POST_CLOG_FAIL, payload: error })
export const toggleModalCreateCLog = modal => { return { type: TOGGLE_MODAL_CREATE_CLOG, payload: modal } }
  
export const updateCLog = (dataSubmit) => {
  let formData = new FormData()
  for (let [key, value] of Object.entries(dataSubmit)) {
      if(key === 'medias'){
      value.forEach((file, i) => {
        formData.append(`file`, file)
      });
    } 
    else{ formData.append(key, value) }
  }
  return{ type: PUT_CLOG, payload: {id: dataSubmit.Id, formData} }
}

export const toggleModalEditCLog = modal => { return { type: TOGGLE_MODAL_EDIT_CLOG, payload: modal } }
export const deleteCLog = (id) => { return {type: DELETE_CLOG, payload: id } } 

export const getCLogType = () => ({ type: GET_CLOG_TYPE })
export const getCLogTypeSuccess = clogs => ({ type: GET_CLOG_TYPE_SUCCESS, payload: clogs })
export const getCLogTypeFail = error => ({ type: GET_CLOG_TYPE_FAIL, payload: error })

export const getlatestVerApp = (appId) => ({ type: GET_LATEST_VER_APP, payload:appId })
export const getlatestVerAppSuccess = ver => ({ type: GET_LATEST_VER_APP_SUCCESS, payload: ver })
export const getlatestVerAppFail = error => ({ type: GET_LATEST_VER_APP_FAIL, payload: error })

export const getlatestCLog = () => ({ type: GET_LATEST_CLOG})
export const getlatestCLogSuccess = clog => ({ type: GET_LATEST_CLOG_SUCCESS, payload: clog })
export const getlatestCLogFail = error => ({ type: GET_LATEST_CLOG_FAIL, payload: error })

export const doFilterCLogs = (filter) => {
    return { type: DO_FILTER_CLOGS, payload: filter  }
}

export const setAppActive = (app) => {
  return {type: SET_APP_ACTIVE, payload: app }
} 
