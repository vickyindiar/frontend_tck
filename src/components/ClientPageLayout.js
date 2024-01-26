import React, { useState } from "react"
import { withRouter, Link } from "react-router-dom"
import epsylon from '../assets/images/epsylon.png'
import ClientProfileMenu from './ClientProfileMenu'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavbarText } from 'reactstrap'

import { useSelector, useDispatch } from 'react-redux';

const ClientPageLayout = ({children, location}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const connNotif = useSelector(state => state.notif.connNotif)
  const getNavItem =() => {
    if(localStorage.getItem("_cat")){
     return(<ClientProfileMenu /> )
    }
    else{
      return (<NavItem className="auth-navbar"> <Link style={{textDecoration:"none", marginRight:"20px"}}  to="/login">{"Sign In or Sign Up"}</Link></NavItem>)
    }
  }

  const onClickNotif = () =>{
      connNotif.invoke('SendMessage', { 'Message': 'woy' })

  }


    return (
      <React.Fragment>
           <Navbar color="light" light  expand="sm" className="pr-2 pl-2 bg-transparent" style={{marginLeft:'1rem', marginRight:'1rem' }}  >
            <NavbarBrand href="/" ><img src={epsylon} width="30" height="30" alt="logo" /></NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar className="">
               <Nav navbar style={{marginRight:'auto'}}  > 
                <NavItem ></NavItem>
              </Nav> 
              <Nav navbar  > 
                { getNavItem() }
                <NavbarText className="d-none d-md-block d-lg-block" style={{textDecoration:"none", borderLeft:"solid 2px grey" }}></NavbarText>
                {/* <NavItem className="auth-navbar"> <Link style={{textDecoration:"none", marginLeft:"20px"}} to="/admin/login">{"an admin ?"}</Link></NavItem> */}
              </Nav> 
            </Collapse>
          </Navbar>
          <React.Fragment>
             {children}
          </React.Fragment>
      
      </React.Fragment>
    )
}

export default withRouter(ClientPageLayout)
