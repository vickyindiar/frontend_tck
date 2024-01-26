import React, {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap"
import isEmpty from '../../../helpers/isEmpty_helper'
import AuthCode from "react-auth-code-input"
import { Link, useHistory } from "react-router-dom"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { verificationOpenTicket, toggleVerifyOpenTicket, reqFreeToken } from 'store/actions'
import { RESET_CLIENT_TICKET_STATE, RESET_CLIENT_AUTH_STATE } from 'store/client/ticket/actionTypes'



function VerificationModal() {
    const [verifiedVal, setverifiedVal] = useState('')
    const showModal = useSelector(state => state.ticketsClient.showVerifyOpen)
    const error = useSelector(state => state.ticketsClient.error)
    const freeToken = useSelector(state => state.authClient.freeToken) 
    const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)

    const history = useHistory();
    const dispatch = useDispatch()
    const toastOption = () => {
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
            hideDuration: 250,
            onHidden: () => { 
                 dispatch({type: RESET_CLIENT_TICKET_STATE, payload: {success: false, error:{}, loadingCreate: false} });  
            } 
          }
    }
    const showToastError = (message) => {
        toastOption();
        toastr.error(message, " ")
    }

    useEffect(() => {
      if(!isEmpty(error)){
        if(error.hasOwnProperty("errorText")) showToastError(error.errorText)
      }
    }, [error])

    useEffect(() => {
      if(!isAuthenticatedClient){
        dispatch(reqFreeToken())
      }
    }, [])


    const onVerifiCode = () => {
        const search = history.location.search;
        const ticketToken = new URLSearchParams(search).get('tcid');
        dispatch(verificationOpenTicket(freeToken, ticketToken, verifiedVal, history))
    }

    return (
        <>
         <Modal isOpen={showModal} 
            role="dialog" 
            autoFocus={true} 
            centered={true} 
            size={'md'} 
            className="verificationOpenTicket" 
            tabIndex="-1" 
            backdrop="static"
            backdropClassName="bd-modal-verify-open-ticket"
            toggle={() => { dispatch(toggleVerifyOpenTicket(!showModal)) }} >
                <div className="modal-content">
                  {/* <ModalHeader  > Verification </ModalHeader> */}
                  <ModalBody style={{paddingBottom:'0.25rem'}}>
                      <Row className="mb-1">
                          <Col>
                                 <h5><strong>Verification Code</strong></h5>
                                <p> Please enter the included 4 digit code from your inbox mail{" "} </p>
                          </Col>
                      </Row>
                      <Row>
                          <Col>
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
                          </Col>
                      </Row>
                  </ModalBody>
                  <ModalFooter style={{paddingTop:'0.25rem', paddingBottom:'0.25rem'}}>
                    <Button type="button" color="primary" onClick={() => { onVerifiCode() } }  disabled={ verifiedVal.length < 4} >
                      Verify <i className="fab fa-telegram-plane ms-1"></i>
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>  
        </>
    )
}

export default React.memo(VerificationModal)
