import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter, useHistory } from "react-router-dom"

import { logoutClient } from "../../../store/actions"

const Logout = props => {
  const history = useHistory();
  useEffect(() => {
    props.logoutClient(history)
  })

  return <></>
}

Logout.propTypes = {
  logoutClient: PropTypes.func
}

export default withRouter(connect(null, { logoutClient })(Logout))
