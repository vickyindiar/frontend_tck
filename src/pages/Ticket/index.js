import React, { useState ,useEffect } from 'react'
import MetaTags from 'react-meta-tags'
import { Button, Card, Col, Container, Row, Nav, NavItem, NavLink } from "reactstrap"
import classnames from "classnames"
import { Link } from "react-router-dom"
import { map } from "lodash"
import { isEEmpty } from "lodash"
import { useDispatch, useSelector, batch } from "react-redux";
import GridView from './GridView'
import CreateModal from './CreateModal'
import { changeActiveTab, toggleModalCreate } from "../../store/tickets/actions";
import { ACTIVE_TAB_TYPE } from "../../store/tickets/actionTypes"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getTickets } from "../../store/tickets/actions"
import isEmpty from 'helpers/isEmpty_helper'

function index() {
  //const [activeTab, setactiveTab] = useState("1")
  const [newTicket, setNewTicket] = useState(2)
  
  const activeTab = useSelector(state => state.tickets.activeTab)
  const allTickets = useSelector(state => state.tickets.allTickets)
  const activeUser = useSelector(state => state.Login.user)
  const activeRole = useSelector(state => state.Login.activeRole)
  const showModal = useSelector(state => state.tickets.showModalCreateTicket)
  const isDBActive = useSelector(state => state.tickets.isDBActive)
  const dispatch = useDispatch();

  useEffect(() => {
    if(Object.keys(activeUser).length > 0){
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let tab = params.get('tab');
      if(!isEmpty(tab)){
        setActiveTab(tab, allTickets)
      }
      else{
        dispatch(getTickets())
      }
    }
  }, [activeUser])

  const setActiveTab = (tab, allTickets) => {
    dispatch(changeActiveTab(tab, allTickets, activeUser, activeRole))
    dispatch(getTickets());
  }

  const showCreateModal = () => {
    if(showModal){ return (<CreateModal />) }
    else return null;
  }

  const showGrid = () => {
    if(allTickets.length !== 0){ return (<GridView />) }
    else return null;
  }

    return (
        <React.Fragment>
        <div className="page-content page-content-ticketing" id="page-content-ticket">
          <MetaTags>
            <title>Ticket | Ticketing</title>
          </MetaTags>
          <Container fluid>
             {/* Render Breadcrumbs */}
          <Breadcrumbs title="Ticket" breadcrumbItem="Browser" />
          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
              <Card className="email-leftbar">
                <Button type="button" color="danger" className="" onClick={() => { dispatch(toggleModalCreate(true)) }} block disabled={!isDBActive} >
                  Create Ticket
                </Button>
                <div className="mail-list mt-4">
                  <Nav tabs className="nav-tabs-custom" vertical role="tablist">
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.ALL })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.ALL, allTickets) }} >
                        <i className="mdi mdi-email-outline me-2"></i>All
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.NEW_ASSIGNED })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.NEW_ASSIGNED, allTickets)   }} >
                        <i className="mdi mdi-star-outline me-2"></i>New Assign {" "}
                        {/* <span className="ml-1 float-end">({newTicket})</span> */}
                      </NavLink>
                    </NavItem>

                    {
                      activeRole.id < 2 &&
                      <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.UNASSIGNED })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.UNASSIGNED, allTickets)  }} >
                        <i className="mdi mdi-account-switch me-2"></i>All Unassigned
                      </NavLink>
                    </NavItem>

                    }
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.INPROGRESS })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.INPROGRESS, allTickets)  }} >
                        <i className="mdi mdi-timer-sand me-2"></i>All In Progress
                        </NavLink>
                    </NavItem>
                  

                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.PENDING })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.PENDING, allTickets)  }} >
                        <i className="mdi mdi-timer-sand me-2"></i>All Pending
                        </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.RECENTLY_UPDATE })} onClick={() => { setActiveTab(ACTIVE_TAB_TYPE.RECENTLY_UPDATE, allTickets)  }} >
                        <i className="mdi mdi-update me-2"></i>Recently Update
                        </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.RECENTLY_SOLVED })} onClick={() => {  setActiveTab(ACTIVE_TAB_TYPE.RECENTLY_SOLVED, allTickets)  }} >
                        <i className="mdi mdi-comment-check-outline me-2"></i>Recently Solved
                        </NavLink>
                    </NavItem>

                    {/* <NavItem>
                      <NavLink className={classnames({ active: activeTab === ACTIVE_TAB_TYPE.DELETED })} onClick={() => {  setActiveTab(ACTIVE_TAB_TYPE.DELETED, allTickets)  }} >
                        <i className="mdi mdi-trash-can-outline me-2"></i>Deleted
                        </NavLink>
                    </NavItem> */}

                  </Nav>
                </div>

                {/* <h6 className="mt-4">Labels</h6>

                <div className="mail-list mt-1">
                  <Link to="#">
                    <span className="mdi mdi-arrow-right-drop-circle text-info float-end"></span>
                     Theme Support
                  </Link>
                  <Link to="#">
                    <span className="mdi mdi-arrow-right-drop-circle text-warning float-end"></span>
                  Freelance
                 </Link>
                  <Link to="#">
                    <span className="mdi mdi-arrow-right-drop-circle text-primary float-end"></span>
                    Social
                  </Link>
                  <Link to="#">
                    <span className="mdi mdi-arrow-right-drop-circle text-danger float-end"></span>
                    Friends
                  </Link>
                  <Link to="#">
                    <span className="mdi mdi-arrow-right-drop-circle text-success float-end"></span>
                    Family
                  </Link> 
                </div>*/}

                {/* <h6 className="mt-4">Chat</h6>

                <div className="mt-2">
                  <Link to="#" className="media">
                    <img className="d-flex me-3 rounded-circle" src={} alt="skote" height="36" />
                    <Media className="chat-user-box" body>
                      <p className="user-title m-0">Scott Median</p>
                      <p className="text-muted">Hello</p>
                    </Media>
                  </Link>
                </div> */}
              </Card>

                {showCreateModal()}
             
              <div className="email-rightbar mb-3">
                <Card>
                 <GridView />
                </Card>
              </div>
            </Col>
          </Row>
          </Container>
        </div>
      </React.Fragment>
    )
}

export default index
