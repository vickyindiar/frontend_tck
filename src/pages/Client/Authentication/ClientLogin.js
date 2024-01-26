import React, { useState, useEffect, useRef } from "react"
import MetaTags from 'react-meta-tags';
import { withRouter, Link, useHistory } from "react-router-dom"
import { Col, Container, Form, FormGroup, Label, Row, Input } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
// import images
import logodark from "../../../assets/images/epsylon-header.png"
import logolight from "../../../assets/images/epsylon-header.png"
import CarouselPage from "./CarouselPage"
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'

import { CLIENT_API_ERROR } from "store/client/auth/actionTypes"
import { useDispatch, useSelector } from "react-redux"
import { loginClient } from "store/actions";
import toastr from "toastr"
import "toastr/build/toastr.min.css"



const ClientLogin = () => {
  const [email, setemail] = useState(''); 
  const [pass, setpass] = useState(''); 
  const [passMode, setPassMode] = useState('password');
  const refValidEmail = useRef(null);
  const refValidPass = useRef(null);
  const errorApi = useSelector(state => state.authClient.error)
  const errorApiType = useSelector(state => state.authClient.errorType)
  const dispatch = useDispatch()
  const history = useHistory();
 
  useEffect(() => {
    if(localStorage.getItem("_cat")){
        history.push('/');
    }
  }, []);

  useEffect(() => {
    if(errorApi !== "" && errorApiType.includes('login') ){
      showToastError(errorApi)
     dispatch({type: CLIENT_API_ERROR, payload: {errText: '',  errType: ''} });
    }
   }, [errorApi])

   const showToastError = (message) => {
    toastr.options = {
      positionClass: "toast-top-right",
      timeOut: 2000,
      extendedTimeOut: 500,
      closeButton: true,
      debug: false,
      progressBar: false,
      preventDuplicates: true,
      newestOnTop: false,
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      showDuration: 250,
      hideDuration: 250
    }

     toastr.error(message, " ")
  }

  const passwordButton = {
    icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
    type: 'default',
    onClick: () => {
        let mode = passMode === 'password' ? 'text' : 'password';
        setPassMode(mode);
    }
  }

  const onLoginClick = () => {
      let mailValid = refValidEmail.current.instance.validate().isValid;
      let passValid = refValidPass.current.instance.validate().isValid;
      if( mailValid && passValid ){
        dispatch(loginClient({email, pass}, history))
      }
  }

    return (
        <React.Fragment>
        <div>
        <MetaTags>
           <title>Login | Ticketing </title>
         </MetaTags>
           <Container fluid className="p-0">
             <Row className="g-0">
               <CarouselPage />
 
               <Col xl={3}>
                 <div className="auth-full-page-content p-md-5 p-4">
                   <div className="w-100">
                     <div className="d-flex flex-column h-100">
                       <div className="mb-4 mb-md-5">
                         <Link to="/" className="d-block auth-logo">
                           <img
                             src={logodark}
                             alt=""
                             height="30"
                             className="auth-logo-dark"
                           />
                           <img
                             src={logolight}
                             alt=""
                             height="30"
                             className="auth-logo-light"
                           />
                         </Link>
                       </div>
                       <div className="my-auto">
                         <div>
                           <h5 className="text-primary">Welcome Back !</h5>
                           <p className="text-muted">
                             Sign in to continue to Epsylon Ticketing.
                           </p>
                         </div>
 
                         <div className="mt-4">
 
                           
                         <div className="mb-3">
                         <TextBox 
                                name="email"
                                value={email}
                                showClearButton={true}
                                stylingMode='outlined'
                                placeholder="Email"
                                valueChangeEvent="keyup"
                                onValueChanged={(e) => { setemail(e.value) }} 
                                >
                                <Validator  ref={refValidEmail} >
                                    <RequiredRule message="Email is required" />
                                    <EmailRule message="Email is invalid" />

                                </Validator>
                            </TextBox> 
                         </div>
                         <div className="mb-0 ">
                            <div className="d-flex justify-content-end">
                                 <Link to="/forgot-password" className="text-muted" >
                                   Forgot password?
                                 </Link>
                            </div>
                         </div>
                         <div className="mb-3">
                        
                               <TextBox 
                                name="password"
                                mode={passMode}
                                defaultValue={pass}
                                showClearButton={true}
                                stylingMode='outlined'
                                placeholder="Enter Password"
                                valueChangeEvent="keyup"
                                onValueChanged={(e) => { setpass(e.value) }} >
                                    <TextBoxButton name="password-button" location="after" options={passwordButton} />
                                    <Validator ref={refValidPass} >
                                            <RequiredRule message="Password is required" />
                                      </Validator>
                                </TextBox>
                         </div>
 
                          <div className="form-check">
                               <Input type="checkbox" className="form-check-input" id="auth-remember-check" />
                               <label className="form-check-label" htmlFor="auth-remember-check" >
                                 Remember me
                               </label>
                          </div>
 
                          <div className="mt-3 d-grid">
                            <button className="btn btn-primary btn-block " onClick={(e, v) => { onLoginClick(e, v) }} >
                              Log In
                            </button>
                          </div>
 
                           <div className="mt-5 text-center">
                             <p>
                               Don't have an account ?{" "}
                               <Link
                                 to="/register"
                                 className="fw-medium text-primary"
                               >
                                 {" "}
                                 Signup now{" "}
                               </Link>{" "}
                             </p>
                           </div>
                         </div>
                       </div>
 
                       <div className="mt-4 mt-md-5 text-center">
                         <p className="mb-0">
                           © {new Date().getFullYear()} Ticketing. 
                           Crafted with{" "} <i className="mdi mdi-heart text-danger" /> by Epsylon
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               </Col>
             </Row>
           </Container>
         </div>
     </React.Fragment>
    )
}

export default React.memo(ClientLogin)
