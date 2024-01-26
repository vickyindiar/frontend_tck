import React, {useState, useEffect} from 'react'
import { Link, useHistory } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import {useDispatch, useSelector  } from 'react-redux' 
import isEmpty from '../../../helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { askForPermissionToReceiveNotifications, getNotification, getTickets, checkingNotifCount, setConnNotif, markAllNotif, updateNotif } from 'store/actions'
import { onMessage } from "firebase/messaging"
import { NOTIF_TYPE_TICKET_CREATE } from '../../../store/notification/actionTypes'
import { map,size } from 'lodash'
import moment from "moment"
import { usePageVisibility } from "../../../helpers/page_visibility_helper";


const NotificationDropdown = props => {
  const [menu, setMenu] = useState(false)
  const activeUser = useSelector(state => state.Login.user)
  const allNotif = useSelector(state => state.notif.allNotif)
  const oriNotifCount = useSelector(state => state.notif.oriNotifCount)
  const newNotifCount = useSelector(state => state.notif.newNotifCount)
  const firebaseMessage = useSelector(state => state.notif.firebaseMessage)
  const [showNotif, setshowNotif] = useState(true)
  const [notifPayload, setnotifPayload] = useState({})
  const pageActive = usePageVisibility()
  const [firstLoad, setfirstLoad] = useState(true)

  const dispatch = useDispatch()
  const history = useHistory()

  const toastOption = () => {
      toastr.options = {
          positionClass: "toast-top-right",
          timeOut: 2000,
          extendedTimeOut: 1000,
          closeButton: true,
          debug: false,
          progressBar: false,
          preventDuplicates: false,
          newestOnTop: false,
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "slideDown",
          hideMethod: "slideUp",
          showDuration: 1000,
          hideDuration: 1000,
          onHidden: () => { 
              setshowNotif(false)
              setnotifPayload({})
          } 
      }
  }

  useEffect(() => {
     dispatch(getNotification())
  }, [])

  // useEffect(() => {
  //   if(!pageActive){
  //     if(firstLoad){setfirstLoad(false)}
  //   }
  //   else{
  //     if(!firstLoad){
  //       dispatch(checkingNotifCount())
  //     }
  //   }
  // }, [pageActive])

  // useEffect(() => {
  //   if(newNotifCount != -1){
  //     if(newNotifCount > oriNotifCount){
  //       let hr = window.location.href
  //       if(hr.includes('admin/ticket')){
  //           dispatch(getNotification())
  //           dispatch(getTickets())
  //       }
  //       // else if(?){ } do update data for other page
  //     }
  //   }
  // }, [newNotifCount])

  useEffect(() => {
      if(isEmpty(localStorage.getItem('_ntft')) && ! isEmpty(activeUser)){
          dispatch(askForPermissionToReceiveNotifications(activeUser))
      }
  }, [activeUser])

  useEffect(() => {
      if(showNotif && !isEmpty(notifPayload)){
          toastOption();
          let body = notifPayload.notification.body;
          body = body.length > 40 ? body.substring(0, 30) + '...' : body;  
          toastr.info(body, notifPayload.notification.title)
      }
  }, [showNotif, notifPayload])

  useEffect(() => {
      if(firebaseMessage){
          onMessage(firebaseMessage, (payload) => {  //WHEN RECIEVE NOTIFICATION FROM SERVER
              setnotifPayload(payload)
              setshowNotif(true)
              dispatch(getNotification())
          })
      }
  }, [firebaseMessage])

  const ntfOnClick = (notif) => {
      dispatch(updateNotif(notif, history))
  }

  const onMarkAll = () => {
    dispatch(markAllNotif())
  }
  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="dropdown d-inline-block" tag="li" >
        <DropdownToggle className="btn header-item noti-icon " tag="button" id="page-header-notifications-dropdown" >
          <i className={!isEmpty(allNotif) ? "bx bx-bell bx-tada" : "bx bx-bell" } />
          {
              !isEmpty(allNotif) ? <span className="badge bg-danger rounded-pill">{   size(allNotif) }</span> : null
          }
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {"Notifications"} </h6>
              </Col>
              <div className="col-auto">
                {
                  !isEmpty(allNotif) &&   <a href="#" className="small" onClick={() => onMarkAll() }> {" "} Mark All Read </a>
                }
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "auto", maxHeight:"400px" }}>
            {
              !isEmpty(allNotif) && Object.keys(allNotif).map((v, i) => 
                (
                  <a href="#" onClick={() => { ntfOnClick(allNotif[v][0]) } } className="text-reset notification-item" key={'NOTIFICATION_ITEM'+i} style={{cursor:'pointer'}} >
                    <div className="media">
                      <div className="avatar-xs me-3">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          <i className="mdi mdi-ticket-account" />
                        </span>
                      </div>
                      <div className="media-body">
                        <h6 className="mt-0 mb-1"> {allNotif[v][0].title} </h6>
                        <div className="font-size-12 text-muted">
                          <p className="mb-1"> {allNotif[v][0].message} </p>
                          <p className="mb-0">
                            <i className="mdi mdi-clock-outline" />{" "}
                            { allNotif[v][0].updatedAt ? moment(allNotif[v][0].updatedAt).fromNow(): moment(allNotif[v][0].createdAt).fromNow() }
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              )
            }
            
          </SimpleBar>
          {/* <div className="p-2 border-top d-grid">
            <Link className="btn btn-sm btn-link font-size-14 btn-block text-center" to="#" >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {" "}{"View all"}{" "}
            </Link>
          </div> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}
const areEqual = (prevProps, nextProps) => { return true; };
export default React.memo(NotificationDropdown, areEqual)
