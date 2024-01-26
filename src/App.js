import PropTypes from 'prop-types'
import React, {useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { Switch, BrowserRouter as Router, useHistory, useLocation } from "react-router-dom"
import { connect } from "react-redux"
// Import Routes all
import { userRoutes, clientRoutes, authRoutes } from "./routes/allRoutes"
// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"
// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import ClientPageLayout from "./components/ClientPageLayout"

// Import scss
import "./assets/scss/theme.scss"
import "./assets/scss/custom-ticketing.scss"
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.custom-scheme.css';


import { AuthorizationCheck } from './store/auth/login/actions'
import { AuthorizationClientCheck, initFirebase } from 'store/actions';
import isEmpty from 'helpers/isEmpty_helper';


// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"
// initFirebaseBackend(config.google)



// import fakeBackend from "./helpers/AuthType/fakeBackend"
// Activating fake backend
//fakeBackend()

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }


//test editing


const App = () => {
  const location = useLocation();
  const appHistory = useHistory();
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.Login.isAuthenticated);
  const isClientAuthenticated = useSelector(state => state.authClient.isAuthenticated);
  const propsLayout = useSelector(state => state.Layout)

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (propsLayout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  //  dispatch(initFirebase()); init notification
  useEffect(() => {

    if( !isEmpty(localStorage.getItem('_cTab'))) {
      var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      window.name = 'TCK_APP_TAB_ID_'+seq;
      localStorage.setItem('_cTab', window.name)
    }


    if(isAuthenticated){
     dispatch( AuthorizationCheck(appHistory, location));
    }
    if(isClientAuthenticated){
      dispatch(AuthorizationClientCheck(appHistory, location))
    }
  }, [])
  const [tabs, setTabs] = useState(/* ... some initial state ... */);

  const isAdmin = window.location.href.includes("admin");
  const Layout = getLayout()
  return (
    <React.Fragment>
      {/* <Router> */}
        <Switch>
          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              isAdmin={isAdmin}
              exact
            />
          ))}

          
          {clientRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={ClientPageLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              isAdmin={isAdmin}
              access={route.access}
              exact
            />
          ))}

          {userRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              isAdmin={isAdmin}
              access={route.access}
              exact
            />
          ))}
        </Switch>
      {/* </Router> */}
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

export default App
