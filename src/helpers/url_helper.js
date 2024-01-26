import config from '../config';


//CLIENT
export const UPOST_CLIENTREGISTER_VERIFY = `${config.apiURL}client/reg-mail-verify`
export const UPOST_CLIENTREGISTER = `${config.apiURL}client/register`
export const UPOST_CLIENTLOGIN = `${config.apiURL}client/login`
export const UPOST_CLIENTFPASS_VERIFY= `${config.apiURL}client/forgot-mail-verify`
export const UPOST_CLIENTFPASS = `${config.apiURL}client/forgot-password`
export const UPOST_CLIENTCHECK = `${config.apiURL}client/authcheck`
export const UGET_CLIENT_FREETOKEN = `${config.apiURL}client/free-token`

export const UGET_CLIENT_TICKET = `${config.apiURL}ticket/client`
export const UPOST_CLIENT_TICKET = `${config.apiURL}ticket/client`
export const UPOST_CLIENTTICKETCOMMENT = `${config.apiURL}ticket/client/post-comment`
export const UPOST_CLIENTCREATETICKET_VERIFY = `${config.apiURL}ticket/client/create-ticket-verify`
export const UGET_CLIENTOPENTICKET_VERIFY = `${config.apiURL}ticket/client/open-ticket-verify`


//ADMIN
//========> auth && users
export const UPOST_ADMINLOGIN = `${config.apiAdminURL}login`
export const UPOST_ADMINCHECK = `${config.apiAdminURL}authcheck`



//========> ticket
export const UGET_TICKET = `${config.apiURL}ticket`
export const UGET_SELECTED_TICKET_DETAIL = `${config.apiURL}ticket/selected-ticket`
export const UGET_FILTERED_SEARCH_TICKET = `${config.apiURL}ticket/filtered-search-ticket` ///{text}
export const UGET_DASH_TICKET = `${config.apiURL}ticket/dashboard`
export const UPOST_TICKET = `${config.apiURL}ticket`
export const UPOST_TICKETCOMMENT = `${config.apiURL}ticket/post-comment`
export const UPOST_TICKETASSIGN = `${config.apiURL}ticket/ticket-assign`
export const UUPDATE_TICKETSTATUS = `${config.apiURL}ticket/status-update`
export const UUPDATE_TICKETASSIGNVIEWED = `${config.apiURL}ticket/ticket-assign-viewed`
export const UUPDATE_TICKETCOMMENT = `${config.apiURL}ticket/update-comment`
export const UDELETE_TICKETCOMMENT = `${config.apiURL}ticket/delete-comment`
export const UGET_TICKETASSIGN_BYUSER = `${config.apiURL}ticketassign/byuser`
  //priotiry
    export const UGET_PRIORITY = `${config.apiURL}priority`
    export const UGET_ENHANCEMENT = `${config.apiURL}enhancement`
    export const UUPDATE_PRIORITY_ENHANCE = `${config.apiURL}ticket/update-priority-enhance`
    export const UGET_DB_LIST = `${config.apiURL}ticket/dblist`

//=======>  users profile senders
export const UGET_SENDERS = `${config.apiURL}sender`
export const UGET_USERS = `${config.apiURL}user`
export const UPOST_USERS = `${config.apiURL}user`
export const UPUT_USER = `${config.apiURL}user`
export const UDEL_USER = `${config.apiURL}user`

export const UGET_TEAMS = `${config.apiURL}team`
export const UPOST_TEAMS = `${config.apiURL}team`
export const UPUT_TEAM = `${config.apiURL}team`
export const UDEL_TEAM = `${config.apiURL}team`

export const UGET_ROLES = `${config.apiURL}role`
export const UGET_DEPTS = `${config.apiURL}department`

export const UGET_TEAMS_SETTING = `${config.apiURL}team/setting-teams`
export const UGET_TEAMS_PROFILE = `${config.apiURL}team/profile-teams`
export const UGET_TICKET_PROFILE = `${config.apiURL}ticket/profile-tickets`

//=======> Misc
export const UGET_APPS = `${config.apiURL}app`
export const UGET_STATUS = `${config.apiURL}stat`

//=======> CLog
export const UGET_CLOGS = `${config.apiURL}clog`
export const UPOST_CLOG = `${config.apiURL}clog`
export const UPUT_CLOG = `${config.apiURL}clog`
export const UDEL_CLOG = `${config.apiURL}clog`
export const UGET_CLOGTYPE = `${config.apiURL}clog/type`
export const UGET_LAST_VERAPP = `${config.apiURL}clog/last-version`
export const UGET_LATEST_CLOG = `${config.apiURL}clog/latest`


//========> Faq
export const UGET_FAQS = `${config.apiURL}faq`
export const UGET_FAQS_BY_APP = `${config.apiURL}faq`
export const UPOST_FAQ = `${config.apiURL}faq`
export const UPUT_FAQ = `${config.apiURL}faq/put`
export const UDEL_FAQ = `${config.apiURL}faq`

//========> KnowledgeBase
export const UGET_KBASES = `${config.apiURL}kbase`
export const UGET_KBASES_BY_APP = `${config.apiURL}kbase/byapp` //?app=''&&module=''
export const UPOST_KBASE = `${config.apiURL}kbase`
export const UPUT_KBASE = `${config.apiURL}kbase`
export const UDEL_KBASE = `${config.apiURL}kbase`

//========> Master Client
export const UGET_GROUP_AGENCIES = `${config.apiURL}agency/group-agencies`
export const UPOST_GROUP_AGENCY = `${config.apiURL}agency/group-agencies`
export const UPUT_GROUP_AGENCY = `${config.apiURL}agency/group-agencies`
export const UDEL_GROUP_AGENCY = `${config.apiURL}agency/group-agencies`
export const UGET_AGENCIES = `${config.apiURL}agency/agencies`
export const UPOST_AGENCY = `${config.apiURL}agency/agencies`
export const UPUT_AGENCY = `${config.apiURL}agency/agencies`
export const UDEL_AGENCY = `${config.apiURL}agency/agencies`


//======> notification
export const UPOST_REGISTERED_FCM = `${config.apiURL}notify/register-notify`
export const UGET_NOTIFICATION = `${config.apiURL}notify`
export const UPUT_NOTIFICATION = `${config.apiURL}notify`
export const UPUT_MARK_ALLREAD = `${config.apiURL}notify/mark-all-read`



//PROFILE
export const POST_UPDATE_AVATAR = `${config.apiAdminURL}user/update-avatar`
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"



//======> REMOVE LATER
//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register" 
//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"
