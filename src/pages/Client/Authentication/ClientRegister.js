
import React, { useState, useEffect, useRef } from "react"
import MetaTags from 'react-meta-tags';
import { withRouter, Link, useHistory } from "react-router-dom"
import { Col, Container, Form, Row } from "reactstrap"
// import images
import logodark from "../../../assets/images/epsylon-header.png"
import logolight from "../../../assets/images/epsylon-header.png"
import CarouselPage from "./CarouselPage"
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'
import AuthCode from "react-auth-code-input"
import randomColor from '../../../helpers/random_color_helper'
import { useDispatch, useSelector } from "react-redux";
import { verifyMailClient, registerClient } from "store/actions"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { CLIENT_API_ERROR } from "store/client/auth/actionTypes"


const  ClientRegister = () => {
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [email, setemail] = useState(''); 
  const [pass, setpass] = useState(''); 
  const [passMode, setPassMode] = useState('text');
  const [verifiedVal, setverifiedVal] = useState('')
  const showVerifyCode = useSelector(state => state.authClient.showVerifyCode)
  const errorApi = useSelector(state => state.authClient.error)
  const errorApiType = useSelector(state => state.authClient.errorType)
  // const [showVerifyCode, setshowVerifyCode] = useState(true)
  const refValidfName = useRef(null);
  const refValidlName = useRef(null);
  const refValidEmail = useRef(null);
  const refValidPass = useRef(null);
  const refVerCode = useRef(null)
  const dispatch = useDispatch()
  const history = useHistory();
  useEffect(() => {
    if(localStorage.getItem("_cat")){
        history.push('/');
    }
  }, []);

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


  const passwordButton = {
    icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
    type: 'default',
    onClick: () => {
        let mode = passMode === 'password' ? 'text' : 'password';
        setPassMode(mode);
    }
  }

  const onRegisterClick = () => {
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    if(!showVerifyCode){
      let fNameValid = refValidfName.current.instance.validate().isValid;
      let lNameValid = refValidlName.current.instance.validate().isValid;
      let mailValid = refValidEmail.current.instance.validate().isValid;
      let passValid = refValidPass.current.instance.validate().isValid;
      if(fNameValid && lNameValid && mailValid && passValid ){
        dispatch(verifyMailClient(email, 'register'))
      }
    }
    else{
      if(verifiedVal.length === 4){
        let dataSubmit = {
          firstName: capitalizeFirstLetter(fName), 
          lastName: capitalizeFirstLetter(lName), 
          email, 
          password:pass,
          code: verifiedVal,
          color: randomColor()
        }
        dispatch(registerClient(dataSubmit, history))
      }
      else{
        alert('error verification code')
      }
    }
  }

    return (
        <React.Fragment>
        <div>
        <MetaTags>
            <title>Register | Ticketing </title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />
              <Col xl={3}>
                <div className="auth-full-page-content p-md-5 p-4" style={{paddingTop:"1.5rem !important"}}>
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-2 mb-md-3">
                        <Link to="/" className="d-block auth-logo">
                          <img src={logodark} alt="" height="30" className="auth-logo-dark" />
                          <img src={logolight} alt="" height="30" className="auth-logo-light" />
                        </Link>
                      </div>
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">Register account</h5>
                          <p className="text-muted">
                            Get your free Ticketing account now.
                          </p>
                        </div>
  
                        <div className="mt-4">
  
                        <div className="mb-3">
                            <TextBox 
                                name="fName"
                                value={fName}
                                showClearButton={true}
                                stylingMode='outlined'
                                placeholder="First Name"
                                valueChangeEvent="keyup"
                                onValueChanged={(e) => { setfName(e.value) }} 
                                >
                                <Validator ref={refValidfName}>
                                    <RequiredRule message="First name is required" />
                                </Validator>
                            </TextBox> 
                          </div>
  
                          <div className="mb-3">
                           <TextBox 
                                name="lName"
                                value={lName}
                                showClearButton={true}
                                stylingMode='outlined'
                                placeholder="Last Name"
                                valueChangeEvent="keyup"
                                onValueChanged={(e) => { setlName(e.value) }} >
                                <Validator ref={refValidlName}>
                                    <RequiredRule message="Last name is required" />
                                </Validator>
                            </TextBox> 
                          </div>
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
                                placeholder="Enter Password"
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
                                      value={'xxxx'}
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
                        
  
                            <div>
                              <p className="mb-0">
                                By registering you agree to the Ticketing{" "}
                                <a href="#" className="text-primary">
                                  Terms of Use
                                </a>
                              </p>
                            </div>
  
                            <div className="mt-3">
                              <button className="btn btn-primary btn-block " onClick={() => { onRegisterClick() }} disabled={showVerifyCode && verifiedVal.length < 4} >
                                {  showVerifyCode ? 'Register' : 'Verification Email' }
                                
                              </button>
                            </div>
  
                          <div className="mt-3 text-center">
                            <p>
                              Already have an account ?{" "}
                              <Link to="/login" className="font-weight-medium text-primary" >
                                {" "}
                                Login
                              </Link>{" "}
                            </p>
                          </div>
                        </div>
                       </div>
  
                      <div className="mt-3 mt-md-4 text-center">
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

export default React.memo(ClientRegister)




