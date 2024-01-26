import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';

import { logoutUser, removeConnHub } from "../../store/actions"


const Logout = props => {
  const connHub = useSelector(state => state.notif.connHub)
  const history = useHistory();
  const dispatch = useDispatch()
  useEffect(() => {
    props.logoutUser(history)
  })

  useEffect(() => {
    if (connHub && connHub.connectionStarted) {
      connHub.stop()
        .then(() => {
           console.log('connection hub stopped')
           dispatch(removeConnHub())
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return <></>
}

Logout.propTypes = {
  logoutUser: PropTypes.func
}

export default withRouter(connect(null, { logoutUser })(Logout))
