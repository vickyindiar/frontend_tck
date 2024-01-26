import { call, put, takeEvery } from "redux-saga/effects"

import { GET_DASHBOARD_TICKET } from "./actionTypes"
import { getDashTicketSuccess, getDashTicketFail } from "./actions"
import * as url from "../../helpers/url_helper"
import { del, get, post, xput } from "../../helpers/api_helper"
import isEmpty from "helpers/isEmpty_helper"

function* fetchDashTickets(action) {
  try {
      const response = yield call(() => get(url.UGET_DASH_TICKET))
      yield put(getDashTicketSuccess(response))
  } catch (error) {
    yield put(getDashTicketFail(error))
  }
}

function* dashSaga() {
  yield takeEvery(GET_DASHBOARD_TICKET, fetchDashTickets)
}

export default dashSaga
