// if you want add some menu
// 1. add route path in here
// 2. add view menu on components/verticalLayout/SidebarContent.js

import React from "react"
import { Redirect } from "react-router-dom"

import Client from "../pages/Client"


// User Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"

// Client
import ClientLogin from "../pages/Client/Authentication/ClientLogin"
import ClientRegister from "../pages/Client/Authentication/ClientRegister"
import ClientLogout from "pages/Client/Authentication/ClientLogout"
import RecoveryPass from "pages/Client/Authentication/RecoveryPass"
import ClientTicket from "pages/Client/Ticket/index"
import ClientCreateTicket from "pages/Client/Ticket/TicketFormCreate"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
// Ticket
import Ticket from "../pages/Ticket/index"
import Faq from "../pages/Faq/index"
import KnowledgeBase from "../pages/KnowledgeBase/index"
import KBaseDetail from "../pages/KnowledgeBase/KBaseDetail"
import ChangeLog from "../pages/ChangeLog/index"
//setting
import SettingUser from "../pages/Setting/User/index"
import SettingTeam from "../pages/Setting/Team/index"
import SettingProfile from "../pages/Setting/Profile/index"
import SettingClient from "../pages/Setting/Agency/index"
//Error
import Pages500 from "../pages/Error/pages-500"

const userRoutes = [
  { path: "/admin/dashboard", component: Dashboard },
  // //profile
  { path: "/admin/ticket", component: Ticket },
  { path: "/admin/faq", component: Faq },
  { path: "/admin/changelog/sysadxx", component: ChangeLog },
  { path: "/admin/changelog/sysadd5", component: ChangeLog },
  { path: "/admin/changelog/sysadweb", component: ChangeLog },
  { path: "/admin/changelog/ticketing", component: ChangeLog },
  { path: "/admin/knowledgebase", component: KnowledgeBase },
  { path: "/admin/knowledgebase/detail", component: KBaseDetail },
  { path: "/admin/setting/user", component: SettingUser, access:[1] },
  { path: "/admin/setting/team", component: SettingTeam, access:[1, 2]},
  { path: "/admin/setting/profile", component: SettingProfile},
  { path: "/admin/setting/client", component: SettingClient},
  // this route should be at the end of all other routes
  { path: "/admin", exact: true, component: () => <Redirect to="/admin/ticket" /> },
]


const clientRoutes = [
  { path: "/mytickets", component: ClientTicket },
  { path: "/faq", component: Faq },
  { path: "/knowledgebase", component: KnowledgeBase },
  { path: "/knowledgebase/detail", component: KBaseDetail },
  { path: "/create-ticket", component: ClientCreateTicket },
  { path: "/", exact: true, component: Client }
]

const authRoutes = [
  { path: "/register", component: ClientRegister },
  { path: "/login", component: ClientLogin },
  { path: "/forgot-password", component: RecoveryPass },
  { path: "/logout", component: ClientLogout },
  { path: "/admin/login", component: Login },
  { path: "/admin/logout", component: Logout },
  { path: "/error/500", component: Pages500}
  // { path: "/", exact: true, component: Client },
]

export { userRoutes, clientRoutes, authRoutes }
