import PropTypes from 'prop-types'
import MetaTags from 'react-meta-tags';
import React, { useState, useEffect } from "react"

import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap"

// Redux
import { connect } from "react-redux"
import { withRouter, Link, useHistory } from "react-router-dom"

// availity-reactstrap-validation
//import { AvForm, AvField } from "availity-reactstrap-validation"

//Social Media Imports
// import { GoogleLogin } from "react-google-login"
// // import TwitterLogin from "react-twitter-auth"
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

// actions
import { loginUser, apiError, socialLogin } from "../../store/actions"

// import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/epsylon.png"

//Import config
// import { facebook, google } from "../../config"

//devextreme component
//import { Validator, RequiredRule, CustomRule } from 'devextreme-react/validator'; 
// import ValidationGroup from 'devextreme-react/validation-group';

import { Button } from 'devextreme-react/button';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'; 

const Login = props => {
  const [userName, setUserName] = useState(''); //adminsuper@epsylonhome.com
  const [pass, setPassword] = useState(''); //adminsuper
  const [passMode, setPassMode] = useState('password');
  const history = useHistory();
  useEffect(() => {
    if(localStorage.getItem("_aat")){
        history.push('/admin');
    }
    if(sessionStorage.getItem('_db')){
      sessionStorage.removeItem("_db")
    }
  }, []);


  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
  
    props.loginUser({email: userName, password: pass}, history)
  }

  const passwordButton = {
    icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
    type: 'default',
    onClick: () => {
        let mode = passMode === 'password' ? 'text' : 'password';
        setPassMode(mode);
    }
  }
  const valueNameChanged = (e) => { setUserName(e.value) }

 const valuePassChanged = (e) => { setPassword(e.value); }

 const changeDBYear = (e) => {

 }

  // const signIn = (res, type) => {
  //   const { socialLogin } = props
  //   if (type === "google" && res) {
  //     const postData = {
  //       name: res.profileObj.name,
  //       email: res.profileObj.email,
  //       token: res.tokenObj.access_token,
  //       idToken: res.tokenId,
  //     }
  //     socialLogin(postData, props.history, type)
  //   } else if (type === "facebook" && res) {
  //     const postData = {
  //       name: res.name,
  //       email: res.email,
  //       token: res.accessToken,
  //       idToken: res.tokenId,
  //     }
  //     socialLogin(postData, props.history, type)
  //   }
  // }

  //handleGoogleLoginResponse
  // const googleResponse = response => {
  //   signIn(response, "google")
  // }

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  // const facebookResponse = response => {
  //   signIn(response, "facebook")
  // }
  return (
    <React.Fragment>
     <MetaTags>
          <title>Admin Login | Ticketing</title>
        </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                   <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Ticketing.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row> 
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-white">
                          <img src={logo} alt="" className="rounded-circle" height="70" />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {/* <form noValidate action="#" method="GET" onSubmit={(e, v) => { handleValidSubmit(e, v) }}> */}
                    {/* <AvForm className="form-horizontal" onValidSubmit={(e, v) => { handleValidSubmit(e, v) }} > */}
                      {
                  
                        props.error && typeof props.error === "string" ? ( <Alert color="danger">{props.error}</Alert> ) : null
                      }
                      <div className="mb-4">
                        {/* <AvField name="email" label="Email" value="admin@themesbrand.com" className="form-control" placeholder="Enter email" type="email" required /> */}
           
                        <TextBox 
                            name="email"
                            defaultValue={userName}
                            showClearButton={true}
                            stylingMode='outlined'
                            // placeholder="Email"
                            label="Email"
                            labelMode={'floating'}
                            valueChangeEvent="keyup"
                            onValueChanged={valueNameChanged} >
                            <Validator >
                                <RequiredRule message="Email is required" />
                                <EmailRule message="Email is invalid" />
                                {/* <CustomRule message={props.error} /> */}
                            </Validator>

                        </TextBox>                   
                      </div>

                      <div className="mb-4">
                        {/* <AvField name="password" label="Password" value="123456" type="password" required placeholder="Enter Password" /> */}
                        <TextBox 
                           name="password"
                            mode={passMode}
                            defaultValue={pass}
                            showClearButton={true}
                            stylingMode='outlined'
                            // placeholder="Enter Password"
                            label="Password"
                            labelMode={'floating'}
                            valueChangeEvent="keyup"
                            onValueChanged={valuePassChanged} >
                                   <TextBoxButton
                                     name="password-button"
                                     location="after"
                                     options={passwordButton}
                                    />
                                 <Validator>
                                        <RequiredRule message="Password is required" />
                                  </Validator>
                        </TextBox>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="customControlInline" />
                        <label className="form-check-label" htmlFor="customControlInline" >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button className="btn btn-primary btn-block" onClick={(e, v) => { handleValidSubmit(e, v) }} >
                          Log In
                        </button>
                      </div>
                      
                

                      {/* <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={renderProps => (
                                <Link
                                to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                          </li>
                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId={google.CLIENT_ID}
                              render={renderProps => (
                                <Link
                                to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => {}}
                            />
                          </li>
                        </ul>
                      </div> */}

                      {/* <div className="text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div> */}
                    {/* </AvForm> */}
                    {/* </form> */}
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Ticketing. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Epsylon
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  const { error } = state.Login
  return { error }
}

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
)

Login.propTypes = {
  error: PropTypes.any,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func
}