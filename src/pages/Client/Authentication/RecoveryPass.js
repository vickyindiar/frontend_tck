
import React, { useState, useEffect, useRef } from "react"
import MetaTags from 'react-meta-tags';
import { withRouter, Link, useHistory } from "react-router-dom"
import { Col, Container, Form, FormGroup, Label, Row, Input } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
// import images
import logodark from "../../../assets/images/epsylon-header.png"
import logolight from "../../../assets/images/epsylon-header.png"
import CarouselPage from "./CarouselPage"
import AuthCode from "react-auth-code-input"
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordClient, verifyMailClient } from "store/actions"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { CLIENT_API_ERROR } from "store/client/auth/actionTypes"



function RecoveryPass() {
  const [email, setemail] = useState(''); 
  const [pass, setpass] = useState(''); 
  const [passMode, setPassMode] = useState('password');
  const [verifiedVal, setverifiedVal] = useState('')
  const showVerifyCode = useSelector(state => state.authClient.showVerifyCode)
  const errorApi = useSelector(state => state.authClient.error)
  const errorApiType = useSelector(state => state.authClient.errorType)
  const dispatch = useDispatch()
  const history = useHistory();

  const refValidEmail = useRef(null);
  const refValidPass = useRef(null);
  const passwordButton = {
    icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
    type: 'default',
    onClick: () => {
        let mode = passMode === 'password' ? 'text' : 'password';
        setPassMode(mode);
    }
  }

  useEffect(() => {
    if(errorApi !== "" && errorApiType.includes('register') ){
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



  const onConfirmClick = () => {
    if(!showVerifyCode){
      let mailValid = refValidEmail.current.instance.validate().isValid;
      let passValid = refValidPass.current.instance.validate().isValid;
      if(mailValid && passValid ){
         dispatch(verifyMailClient(email, 'forgot-password'))
      }
    }
    else{
      if(verifiedVal.length === 4){
        let dataSubmit = {
          email, 
          password:pass,
          code: verifiedVal,
        }
        dispatch(forgotPasswordClient(dataSubmit, history))
        setemail('')
        setpass('')
        setPassMode('password')
      }
    }
  }

    return (
        <React.Fragment>
        <div>
        <MetaTags>
            <title>Recover Password | Ticketing</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />
              <Col xl={3}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-4 mb-md-5">
                        <a href="/" className="d-block auth-logo">
                          <img src={logodark} alt="" height="30" className="auth-logo-dark" />
                          <img src={logolight} alt="" height="30" className="auth-logo-light" />
                        </a>
                      </div>
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary"> Reset Password </h5>
                          <p className="text-muted">Re-Password with Ticketing.</p>
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
                                      disabled={showVerifyCode}      
                                  >
                                      <Validator ref={refValidEmail} >
                                          <RequiredRule message="Email is required" />
                                          <EmailRule message="Email is invalid" />
                                      </Validator>
                                  </TextBox> 
                                </div>
                                <div className="mb-3">
                                  <TextBox 
                                      name="password"
                                      mode={passMode}
                                      defaultValue={pass}
                                      showClearButton={true}
                                      stylingMode='outlined'
                                      placeholder="Enter New Password"
                                      valueChangeEvent="keyup"
                                      onValueChanged={(e) => { setpass(e.value) }} >
                                          <TextBoxButton name="password-button" location="after" options={passwordButton} />
                                          <Validator  ref={refValidPass} >
                                            <RequiredRule message="Password is required" />
                                          </Validator>
                                  </TextBox>
                                </div>
                                {
                                    showVerifyCode && 
                                    <>
                                      <div className="mb-1">
                                        <h5>Verify your email</h5>
                                        <p>
                                            Please enter the 4 digit code sent to{" "}
                                            <span className="font-weight-semibold">
                                            {email}
                                            </span>
                                        </p>
                                      </div>
                                      <div className="mb-3">
                                        <AuthCode
                                            characters={4}
                                            className="form-control form-control-lg text-center"
                                            allowedCharacters="^[A-Z, a-z, 0-9]"
                                            onChange={(e) => {setverifiedVal(e);}}
                                            inputStyle={{
                                              width: "50px",
                                              height: "40px",
                                              padding: "5px",
                                              borderRadius: "8px",
                                              fontSize: "15px",
                                              textAlign: "center",
                                              marginRight: "15px",
                                              border: "1px solid #ced4da",
                                              textTransform: "none",
                                            }}
                                          />
                                      </div>
                                    </>
                                }
                                <div className="text-end">
                                    <button className="btn btn-primary w-md " onClick={() => { onConfirmClick() }} disabled={showVerifyCode && verifiedVal.length < 4} >   {  showVerifyCode ? 'Confirm' : 'Verification Email' }</button>
                                </div>
                          <div className="mt-5 text-center">
                            <p>
                              Remember It ?{" "}
                              <Link to="/login" className="fw-medium text-primary" >
                                {" "}
                                  Sign In here
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

export default React.memo(RecoveryPass)
