import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"

const Navbar = props => {
  const [dashboard, setdashboard] = useState(false)
  const [ui, setui] = useState(false)
  const [app, setapp] = useState(false)
  const [email, setemail] = useState(false)
  const [ecommerce, setecommerce] = useState(false)
  const [crypto, setcrypto] = useState(false)
  const [project, setproject] = useState(false)
  const [task, settask] = useState(false)
  const [contact, setcontact] = useState(false)
  const [blog, setBlog] = useState(false)
  const [component, setcomponent] = useState(false)
  const [form, setform] = useState(false)
  const [table, settable] = useState(false)
  const [chart, setchart] = useState(false)
  const [icon, seticon] = useState(false)
  const [map, setmap] = useState(false)
  const [extra, setextra] = useState(false)
  const [invoice, setinvoice] = useState(false)
  const [auth, setauth] = useState(false)
  const [utility, setutility] = useState(false)
  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })
  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    onClick={e => {
                      e.preventDefault()
                      setdashboard(!dashboard)
                    }}
                    to="/dashboard"
                  >
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Dashboard")} {props.menuOpen}
                    <div className="arrow-down"></div>
                  </Link>
                  <div
                    className={classname("dropdown-menu", { show: dashboard })}
                  >
                    <Link to="/admin/dashboard" className="dropdown-item">
                      {props.t("Default")}
                    </Link>
                    <Link to="#" className="dropdown-item">
                      {props.t("Saas")}
                    </Link>
                    <Link to="#" className="dropdown-item">
                      {props.t("Crypto")}
                    </Link>
                    <Link to="#" className="dropdown-item">
                      {props.t("Blog")}
                    </Link>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <Link to="/admin/ticket" onClick={e => { e.preventDefault(); setui(!ui) }} className="nav-link dropdown-toggle arrow-none" >
                    <i className="bx bx-task me-2"></i>
                    {props.t("Ticket")} 
                  </Link>
        
                </li>

                <li className="nav-item dropdown">
                  <Link to="/admin/knowledgebase" onClick={e => { e.preventDefault(); setapp(!app) }} className="nav-link dropdown-togglez arrow-none" >
                    <i className="bx bx-bulb me-2"></i>
                    {props.t("Knowledge Base")} 
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link to="/admin/faq" onClick={e => { e.preventDefault(); setapp(!app) }} className="nav-link dropdown-togglez arrow-none" >
                    <i className="bx bx-chat me-2"></i>
                    {props.t("FAQ")} 
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link to="/admin/changelog" className="nav-link dropdown-toggle arrow-none" onClick={e => { e.preventDefault(); setcomponent(!component) }} >
                    <i className="bx bx-trending-up me-2"></i>
                    {props.t("Changelog")}
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle arrow-none" to="/#" onClick={e => { e.preventDefault(); setextra(!extra) }} >
                    <i className="bx bx-cog me-2"></i>
                    {props.t("Settings")} <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: extra })}>
                    <div className="dropdown">
                      <Link to="/#" className="dropdown-item dropdown-toggle arrow-none" onClick={e => { e.preventDefault(); setinvoice(!invoice) }} >
                        {props.t("x")} 
                      </Link>
                    </div>

                    <div className="dropdown">
                      <Link to="/#" className="dropdown-item dropdown-toggle arrow-none" onClick={e => { e.preventDefault(); setauth(!auth) }} >
                        {props.t("y")}{" "}
                      </Link>
                    </div>

                    <div className="dropdown">
                      <Link className="dropdown-item dropdown-toggle arrow-none" to="/#" onClick={e => { e.preventDefault(); setutility(!utility) }} >
                        {props.t("Z")}
                      </Link>
                    </div>
                    
                  </div>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
