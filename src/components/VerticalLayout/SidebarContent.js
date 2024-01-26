import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

//i18n
import { withTranslation } from "react-i18next"
import isEmpty from "helpers/isEmpty_helper"
import { getlatestCLog } from "store/actions"

const SidebarContent = props => {
  const ref = useRef()
  const activeRole = useSelector(state => state.Login.activeRole)
  const latestClog = useSelector(state => state.clog.latestClog)
  const isDBActive = useSelector(state => state.tickets.isDBActive)
  const [hasNewCL, sethasNewCL] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getlatestCLog())
  }, [])


  const isBadgeDashboardViewed = () =>  {
    let lcClog = localStorage.getItem('_clInfo');
    if(!isEmpty(lcClog)){
      lcClog = JSON.parse(lcClog);
      sethasNewCL(!lcClog.f)
    }
  }
  const hideBadgeDashboard = (p) => {
      if(p.includes('dashboard') && !isEmpty(latestClog)){
        let lcClog = localStorage.getItem('_clInfo');
        if(!isEmpty(lcClog)){
          let lc = { v: latestClog.id, f: true }
          localStorage.setItem('_clInfo', JSON.stringify(lc))
          sethasNewCL(false)
        }
      }
  }

  useEffect(() => {
    if(!isEmpty(latestClog)){
      let lcClog = localStorage.getItem('_clInfo');
      if(isEmpty(lcClog)){
         let lc = { v: latestClog.id, f: false }
        localStorage.setItem('_clInfo', JSON.stringify(lc))
        sethasNewCL(true)
      }
      else{
        lcClog = JSON.parse(lcClog)
        if(lcClog.v !== latestClog.id){
          let lc = { v: latestClog.id, f: false }
          localStorage.setItem('_clInfo', JSON.stringify(lc))
          sethasNewCL(true)
        }
      }
    }
  }, [latestClog])


  
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
    isBadgeDashboardViewed()
    hideBadgeDashboard(props.location.pathname)
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }
  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/admin/dashboard" className="">
                <i className="bx bx-home-circle"></i>
               {  hasNewCL && (
                  <span className="badge rounded-pill bg-danger float-end">
                    New
                  </span>
                   )
                }
                <span>{props.t("Dashboards")}</span>
              </Link>
              {/* <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/admin/dashboard">{props.t("Default")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Saas")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Crypto")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Blog")}</Link>
                </li>
              </ul> */}
            </li>

            <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link to="/admin/ticket" className=" ">
                <i className="bx bx-task"></i>
                <span>{props.t("Ticket")}</span>
              </Link>
            </li>

     
            <li>
              <Link to={isDBActive ? "/admin/knowledgebase" : '#'} className={isDBActive ? '' : 'disabled-link'}>
                <i className="bx bx-bulb"></i>
                <span>{props.t("Knowledge Base")}</span>
              </Link>
            </li>

            <li>
              <Link to={isDBActive ? "/admin/faq" : "#"} className={isDBActive ? '' : 'disabled-link'}>
                <i className="bx bx-chat"></i>
                <span>{props.t("FAQ")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className={isDBActive ? 'has-arrow' : 'disabled-link has-arrow'}>
                <i className="bx bx-trending-up"></i>
                <span>{props.t("Changelog")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to={isDBActive ? "/admin/changelog/sysadxx": '#'}  className={isDBActive ? '' : 'disabled-link'}>{props.t("SysAd XX")}</Link>
                    </li>
                    <li>
                      <Link to={isDBActive ? "/admin/changelog/sysadd5": '#'}  className={isDBActive ? '' : 'disabled-link'}>{props.t("SysAd D5")}</Link>
                    </li>
                    <li>
                      <Link to={isDBActive ? "/admin/changelog/sysadweb": '#'} className={isDBActive ? '' : 'disabled-link'}>{props.t("SysAd Web")}</Link>
                    </li>
                    <li>
                      <Link to={isDBActive ?"/admin/changelog/ticketing": '#'} className={isDBActive ? '' : 'disabled-link'}>{props.t("Ticketing")}</Link>
                    </li>
              </ul>
            </li>


            <li className="menu-title" >{props.t("Settings")}</li>

            <li>
              <Link to="/#" className={isDBActive ? 'has-arrow' : 'disabled-link has-arrow'}>
                <i className="bx bx-cog"></i>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="true">
                {
                  activeRole.roleId < 2 && (
                    <li>
                      <Link to={isDBActive ? "/admin/setting/user" : '#'}  className={isDBActive ? '' : 'disabled-link'}>{props.t("Users")}</Link>
                    </li>
                  )
                }
                {
                  activeRole.roleId < 3 && (
                    <li>
                      <Link to={isDBActive ? "/admin/setting/team": '#'} className={isDBActive ? '' : 'disabled-link'}>{props.t("Teams")}</Link>
                    </li>
                  )
                }
                  <li>
                    <Link to={isDBActive ? "/admin/setting/profile": '#'} className={isDBActive ? '' : 'disabled-link'}>{props.t("Profile")}</Link>
                  </li>
                  {
                  activeRole.roleId < 2 && (
                    <li>
                      <Link to={isDBActive ? "/admin/setting/client": '#'} className={isDBActive ? '' : 'disabled-link'}>{props.t("Client")}</Link>
                    </li>
                  )
                }
               
                {/* <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
