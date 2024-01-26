import { GET_APPS, GET_APPS_SUCCESS, GET_APPS_FAIL } from "./actionTypes"

const INIT_STATE = {
  allApps: [],
  error: {},
}

const misc = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_APPS_SUCCESS:
      return {
        ...state,
        allApps: action.payload,
      }
      break
    case GET_APPS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      break
    default:
      return state
  }
}

export default misc
