import { combineReducers } from "redux"
// Front
import Layout from "./layout/reducer"
// Authentication
import Login from "./auth/login/reducer"
//main app
import tickets from "./tickets/reducer"
import users from "./users/reducer"
import misc from "./misc/reducer"
import dash from "./dashboard/reducer"
import clog from "./clog/reducer"
import faq from "./faq/reducer"
import kbase from "./kbase/reducer"
import notif from "./notification/reducer"
import agency from "./agency/reducer"

import authClient from "./client/auth/reducer"
import ticketsClient from "./client/ticket/reducer"
import homeClient from "./client/home/reducer"


const rootReducer = combineReducers({
  Layout,
  Login,
  tickets,
  users,
  misc,
  dash,
  clog,
  faq,
  kbase,
  agency,
  notif,
  authClient,
  ticketsClient,
  homeClient
})

export default rootReducer
