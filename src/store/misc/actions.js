import { GET_APPS, GET_APPS_SUCCESS, GET_APPS_FAIL } from "./actionTypes"

export const getApps = (freeToken) => ({
  type: GET_APPS,
  payload: {token: freeToken}
})

export const getAppsSuccess = apps => ({
  type: GET_APPS_SUCCESS,
  payload: apps,
})

export const getAppsFail = error => ({
  type: GET_APPS_FAIL,
  payload: error,
})
