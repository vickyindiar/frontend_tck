import React, { useState, useEffect } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from "reactstrap"
import { withTranslation } from "react-i18next"
import {  useSelector } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import isEmpty from "helpers/isEmpty_helper"
import HubConfig from './HubConfig'

const ClientProfileMenu = () => {
  const [menu, setMenu] = useState(false)
  const client = useSelector(state => state.authClient.client);

  const profileImage = () => {
    if(!isEmpty(client) && Object.keys(client).length > 0){
      if(client.image){
        return (   <img className="rounded-circle header-profile-client" src={client.image} alt={client.firstName} />)
      }
      else{
        return ( 
          <div className="avatar-xs" >
            <span className={ "avatar-title rounded-circle text-white font-size-14" } style={{background:client.color, opacity:0.65 }} >
                {client.firstName.charAt(0) + ' ' + client.lastName.charAt(0) }
            </span>
         </div>
         )
      }
    }
  }

  return (
    <React.Fragment>
      <HubConfig />
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block" >
        
        <DropdownToggle className="btn" id="page-header-client-dropdown" tag="button" style={{paddingTop:'0px', paddingBottom:'0px', marginTop:'0px', marginBottom:'0px' }} >
          {
            // profileImage()
          }
          {
              !isEmpty(client) &&  <span className="d-none d-xl-inline-block ms-2 me-1">{client.firstName + ' ' + client.lastName}</span>
          }
         
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"/>
        </DropdownToggle>
        
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/mytickets">
            {" "}
            <i className="bx bx-client font-size-16 align-middle me-1"/>
            { "My Tickets" }{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1"/>
            { "Lock screen" }
          </DropdownItem> */}
          <div className="dropdown-divider"/>
          <Link to={location => ({ ...location, pathname: "/logout" })}className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
            <span>{"Logout"}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}


export default withRouter((withTranslation()(React.memo(ClientProfileMenu))))
