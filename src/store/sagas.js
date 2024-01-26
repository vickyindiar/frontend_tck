import { all, fork } from "redux-saga/effects"

//public
import LayoutSaga from "./layout/saga"
// main app 
import AuthSaga from "./auth/login/saga"
import ticketsSaga from "./tickets/saga"
import usersSaga from "./users/saga"
import miscsSaga from "./misc/saga"
import dashSaga from "./dashboard/saga"
import clogsSaga from "./clog/saga"
import faqsSaga from "./faq/saga"
import kbaseSaga from "./kbase/saga"
import agenciesSaga from "./agency/saga"
import notifsSaga from "./notification/saga"

//client
import AuthClientSaga from "./client/auth/saga"
import ticketsClientSaga from "./client/ticket/saga"

export default function* rootSaga() {
  yield all([
    LayoutSaga(),
    fork(AuthSaga),
    fork(ticketsSaga),
    fork(usersSaga),
    fork(miscsSaga),
    fork(dashSaga),
    fork(AuthClientSaga),
    fork(ticketsClientSaga),
    fork(clogsSaga),
    fork(faqsSaga),
    fork(kbaseSaga),
    fork(notifsSaga),
    fork(agenciesSaga)
  ])
}
