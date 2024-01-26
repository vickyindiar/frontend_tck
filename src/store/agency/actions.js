import {  
  
          GET_GROUP_AGENCY, GET_GROUP_AGENCY_SUCCESS, GET_GROUP_AGENCY_FAIL,
          GET_AGENCY, GET_AGENCY_SUCCESS, GET_AGENCY_FAIL,

          SET_CHANGES,
          SET_EDIT_ROW_KEY,
          POST_GROUP_AGENCY, POST_GROUP_AGENCY_SUCCESS, POST_GROUP_AGENCY_FAIL,
          PUT_GROUP_AGENCY, PUT_GROUP_AGENCY_SUCCESS, PUT_GROUP_AGENCY_FAIL,
          DELETE_GROUP_AGENCY, DELETE_GROUP_AGENCY_SUCCESS, DELETE_GROUP_AGENCY_FAIL,

          SET_CHANGES_DETAIL,
          SET_EDIT_ROW_KEY_DETAIL,
          POST_AGENCY, POST_AGENCY_SUCCESS, POST_AGENCY_FAIL,
          PUT_AGENCY, PUT_AGENCY_SUCCESS, PUT_AGENCY_FAIL,
          DELETE_AGENCY, DELETE_AGENCY_SUCCESS, DELETE_AGENCY_FAIL,
       
        
        } from "./actionTypes"

export const getGroupAgency = (freeToken) => ({ type: GET_GROUP_AGENCY, payload: {token: freeToken} })
export const getGroupAgencySuccess = groupAgency => ({ type: GET_GROUP_AGENCY_SUCCESS, payload: groupAgency })
export const getGroupAgencyFail = error => ({ type: GET_GROUP_AGENCY_FAIL, payload: error })

export const getAgency = (freeToken) => ({ type: GET_AGENCY, payload: {token: freeToken} })
export const getAgencySuccess = Agency => ({ type: GET_AGENCY_SUCCESS, payload: Agency })
export const getAgencyFail = error => ({ type: GET_AGENCY_FAIL, payload: error })

export const setChanges = (changes) => ({ type: SET_CHANGES, payload: changes });
export const setEditRowKey = (editRowKey) => ({ type: SET_EDIT_ROW_KEY, payload: editRowKey })

export const postGroupAgency = (changes) =>( { type: POST_GROUP_AGENCY, payload: { data: changes.data, changes}  } )
export const postGroupAgencySuccess = (group, changes) => ({ type: POST_GROUP_AGENCY_SUCCESS, payload: { group, changes } })
export const postGroupAgencyFail = error => ({ type: POST_GROUP_AGENCY_FAIL, payload: error })
  
export const putGroupAgency = (id, data) => ( { type: PUT_GROUP_AGENCY, payload: {id, data} } )
export const putGroupAgencySuccess = Agency => ({ type: PUT_GROUP_AGENCY_SUCCESS, payload: Agency })
export const putGroupAgencyFail = error => ({ type: PUT_GROUP_AGENCY_FAIL, payload: error })

export const delGroupAgency = (id) => { return {type: DELETE_GROUP_AGENCY, payload: id } } 
export const delGroupAgencySuccess = Agency => ({ type: DELETE_GROUP_AGENCY_SUCCESS, payload: Agency })
export const delGroupAgencyFail = error => ({ type: DELETE_GROUP_AGENCY_FAIL, payload: error })

export const setChangesDetail = (changes) => ({ type: SET_CHANGES_DETAIL, payload: changes });
export const setEditRowKeyDetail = (editRowKey) => ({ type: SET_EDIT_ROW_KEY_DETAIL, payload: editRowKey })

export const postAgency = (changes) =>( { type: POST_AGENCY, payload: { data: changes.data, changes}  } )
export const postAgencySuccess = (agencies, changes) => ({ type: POST_AGENCY_SUCCESS, payload: { agencies, changes } })
export const postAgencyFail = error => ({ type: POST_AGENCY_FAIL, payload: error })
  
export const putAgency = (id, data) => ( { type: PUT_AGENCY, payload: {id, data} } )
export const putAgencySuccess = Agency => ({ type: PUT_AGENCY_SUCCESS, payload: Agency })
export const putAgencyFail = error => ({ type: PUT_AGENCY_FAIL, payload: error })

export const delAgency = (id) => { return {type: DELETE_AGENCY, payload: id } } 
export const delAgencySuccess = Agency => ({ type: DELETE_AGENCY_SUCCESS, payload: Agency })
export const delAgencyFail = error => ({ type: DELETE_AGENCY_FAIL, payload: error })


