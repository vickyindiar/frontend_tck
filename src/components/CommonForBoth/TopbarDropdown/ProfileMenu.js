import React, { useState, useEffect } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from "reactstrap"
//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect, useSelector } from "react-redux"
import { withRouter, Link } from "react-router-dom"

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false)
  const user = useSelector(state => state.Login.user);

  const profileImage = () => {
    if(Object.keys(user).length > 0){
      if(user.image){
        return (   <img className="rounded-circle header-profile-user" src={user.image} alt={user.firstName} />)
      }
      else{
        return ( 
          <div className="avatar-xs" style={{display:"inline-block"}}>
            <span className={ "avatar-title rounded-circle text-white font-size-14" } style={{background:user.color, opacity:0.65 }} >
                {user.firstName.charAt(0) + ' ' + user.lastName.charAt(0) }
            </span>
         </div>
         )
      }
    }
  }

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block" >
        
        <DropdownToggle className="btn header-item " id="page-header-user-dropdown" tag="button" >
          {
            profileImage()
          }
          <span className="d-none d-xl-inline-block ms-2 me-1">{user.firstName}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"/>
        </DropdownToggle>
        
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/admin/setting/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1"/>
            {"Profile"}{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1"/>
            {"Lock screen"}
          </DropdownItem> */}
          <div className="dropdown-divider"/>
          <Link to={location => ({ ...location, pathname: "/admin/logout" })}className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
            <span>{"Logout"}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

export default withRouter((withTranslation()(ProfileMenu)))
