import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react"

import { connect, useDispatch, useSelector } from "react-redux"
import { Row, Col } from "reactstrap"
import ReactDrawer from 'react-drawer';
import { Link, useHistory } from "react-router-dom"
import 'react-drawer/lib/react-drawer.css';

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap"

// Import menuDropdown
// import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
// import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import RightSidebar from "../CommonForBoth/RightSidebar"
// import megamenuImg from "../../assets/images/megamenu-img.png"



//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"
import { doFilterCLogs } from 'store/clog/actions';
import { doFilterKbases } from 'store/kbase/actions';
import {getFilteredSearchTicket} from 'store/tickets/actions'

const Header = props => {
  const [search, setsearch] = useState(false)
  const [searchValue, setsearchValue] = useState('')
  const [megaMenu, setmegaMenu] = useState(false)
  const [socialDrp, setsocialDrp] = useState(false)
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [position, setPosition] = useState();
  const [open, setOpen] = useState(false);
  const history = useHistory()
  const dispatch = useDispatch()
  
//  const leftMenu = useSelector(state => state.Layout.leftMenu)


useEffect(() => {
  if(history){
    if(history.location.pathname.includes('changelog')){
      dispatch(doFilterCLogs(searchValue))
    }
    else if(history.location.pathname.includes('knowledgebase')){
      dispatch(doFilterKbases(searchValue))
    }
    else if(history.location.pathname.includes('admin/ticket')){
      const timeOutId = setTimeout(() =>  
      dispatch(getFilteredSearchTicket(searchValue)
      ), 500);
      return () => clearTimeout(timeOutId);
    }
  }
}, [searchValue])

  function toggleRightDrawer() {
    setPosition('right');
    setOpen(!open)
  }

  const onDrawerClose = () => {
    setOpen(false);
  }

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle(isOpen) {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
    dispatch(toggleLeftmenu(!isOpen))
  }


  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <button
              type="button"
              onClick={() => {
                tToggle(props.leftMenu)
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder={props.t("Search") + "..."}
                  value = {searchValue}
                  onChange={(e) => {setsearchValue(e.target.value)}}
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search)
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label=""
                        value = {searchValue}
                        onChange={ (e) => setsearchValue(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

        

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen()
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            {/* <NotificationDropdown /> */}
            <ProfileMenu />

            {/* <div onClick={() => { toggleRightDrawer() }} disabled={open} className="dropdown d-inline-block" > */}
              {/* <button type="button" className="btn header-item noti-icon right-bar-toggle" > */}
                {/* <i className="bx bx-cog bx-spin" /> */}
                {/* <i className="bx bx-cog" /> */}
              {/* </button> */}
            {/* </div> */}
          </div>
        </div>
        <ReactDrawer
          open={open}
          position={position}
          onClose={onDrawerClose}
        >
          <RightSidebar onClose={onDrawerClose} />
        </ReactDrawer>
      </header>

    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
