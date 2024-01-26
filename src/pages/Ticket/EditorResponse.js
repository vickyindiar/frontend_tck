import React,{ useState, useEffect, useRef, useCallback } from 'react'
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { map } from "lodash"
import { Card, CardBody, Media, Row, UncontrolledTooltip,  Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import moment from "moment"
import { useSelector, useDispatch } from 'react-redux'
import config from '../../config'
import EditorResponseAttach from './EditorResponseAttach'
import EditorResponseEdit from './EditorResponseEdit'
import EditorResponseLast from './EditorResponseLast'
import EditorResponseReply from './EditorResponseReply'
import {postTicketDetail, deleteTicketComment} from '../../store/actions'
import SweetAlert from "react-bootstrap-sweetalert"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import isEmpty from 'helpers/isEmpty_helper'
import copyTextToClipboard from 'helpers/copy_to_clipboard_helper'
import { changeActiveTab, toggleModalCreate } from "../../store/tickets/actions";
import toastr from "toastr"
import "toastr/build/toastr.min.css"

function EditorResponse() {
    // eslint-disable-next-line no-unused-vars
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
    const activeUser = useSelector(state => state.Login.user)
    // const activeRole = useSelector(state => state.Login.activeRole)
    // const showModal = useSelector(state => state.tickets.showModalCreateTicket)

    const [messageBox, setMessageBox] = useState(null)
    const [showModalEditComment, setshowModalEditComment] = useState(false)
    const [showModalDeleteComment, setshowModalDeleteComment] = useState(false)
    const [showSuccessAlert, setshowSuccessAlert] = useState(false)
    const [descSuccessAlert, setdescSuccessAlert] = useState('')
    const [idEditValue, setidEditValue] = useState(null)
    const [commentEditValue, setcommentEditValue] = useState('')
    const [deletedComment, setdeletedComment] = useState(null)
    const [cSrc, setcSrc] = useState('')
    const [openLightBox, setopenLightBox] = useState(false)
    const dispatch = useDispatch();

    const toastOption = () => {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 1000,
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
            showDuration: 150,
            hideDuration: 150,
         }
    }
    const showToastCopied = (message) => {
        toastOption();
        toastr.success(message, " ")
    }

    useEffect(() => {
        //all this code for open image preview react-image-lightbox purpose
         if( !isEmpty(selectedSingleRow) ){
            if(selectedSingleRow.comment.includes('<img') || selectedSingleRow.medias.length > 0){
                let p = document.getElementById(`header_component_${selectedSingleRow.id}`);
                let imglist = p.getElementsByTagName('img');
                for (let i = 0; i < imglist.length; i++) {
                    imglist[i].addEventListener("click", () => {
                        setopenLightBox(true);
                        setcSrc(imglist[i].src)
                    });
                    
                }
            }
            if(selectedSingleRow.ticketDetails.length > 0){
                selectedSingleRow.ticketDetails.forEach((detail, i) => {
                    if(detail.comment.includes('<img') || detail.medias.length > 0){
                        let p = document.getElementById(`comment_component_${detail.id}`);
                        let imglist = p.getElementsByTagName('img');
                        for (let i = 0; i < imglist.length; i++) {
                            imglist[i].addEventListener("click", () => {
                                setopenLightBox(true);
                                setcSrc(imglist[i].src)
                            });
                            
                        }
                    }
                    if(i === selectedSingleRow.ticketDetails.length - 1){
                        if(detail.comment.includes('<img') || detail.medias.length > 0){
                            let p = document.getElementById(`last_response_component_${detail.id}`);
                            let imglist = p.getElementsByTagName('img');
                            for (let i = 0; i < imglist.length; i++) {
                                imglist[i].addEventListener("click", () => {
                                    setopenLightBox(true);
                                    setcSrc(imglist[i].src)
                                });
                                
                            }
                        }
                    }
                });
            }
         }
    }, [selectedSingleRow])

    const copyToClipboard = (text) => {
        copyTextToClipboard(text).then(() => {
            showToastCopied('Copied to clipboard !')   
        })
    }

    const mediaHeaderImage = (data, isComment, detail, key) => {
        let id = data.ticketType === "E" ? data.senders.id  : data.users.id;
        let fullName = data.ticketType === "E" ? data.senders.firstName + ' ' + data.senders.lastName : data.users.firstName + ' ' + data.users.lastName;
        let src = data.ticketType === "E" ?`${config.apiURL}media/sender/${data.senders.id}` : `${config.apiURL}media/user/${data.users.id}`;
        let email = data.ticketType === "E" ? data.senders.email  : data.users.email;
        let image = data.ticketType === "E" ? data.senders.image  : data.users.image;
        let color = data.ticketType === "E" ? data.senders.color  : data.users.color;
            
        if(image){
            return (
            <Media className="mb-3">
                <div className="align-self-center me-3">
                   <img  src={src} className="rounded-circle avatar-xs" alt={fullName} id={"headerTicket-user" + key} />
                </div>

                <Media className="overflow-hidden" body>
                <h5 className="text-truncate font-size-12 mb-1"> {email} </h5>
                {
                    !isComment ? 
                    (
                        <p className="text-truncate mb-0"> 
                            <i className="mdi mdi-ticket-confirmation-outline align-self-center me-1 mr-2" />
                                <span style={{cursor:'pointer'}} onClick={() => copyToClipboard(data.ticketNumber)}> { data.ticketNumber } </span> 
                            <i className="bx bx-time-five align-self-center me-1" style={{marginLeft: "1rem"}} />
                               { moment(data.createdAt).format( "DD-MM-YY HH:mm" ) }
                        </p>
                    )
                    : 
                    (
                        <p className="text-truncate mb-0"> 
                             <i className="bx bx-time-five align-self-center me-1" />
                              { detail.updatedAt ? moment(detail.updatedAt).format( "DD-MM-YY HH:mm" ) :  moment(detail.createdAt).format( "DD-MM-YY HH:mm" ) }
                         </p>
                    )
                }
                </Media>
                <UncontrolledTooltip placement="top" target={"headerTicket-user" + key} >
                    {fullName}
                </UncontrolledTooltip>
            </Media>
            )
          }
          else { //if sender has not image creeate avatar
              return(
                <Media className="mb-3" >
                <div className="align-self-center">
                    <div className="avatar-xs d-flex me-3" id={"headerTicket-user" + key} >
                        <span className={ "avatar-title rounded-circle text-white font-size-18"  }  style={{background:color, opacity:0.65 }} >
                            {fullName.charAt(0) + fullName.charAt(fullName.indexOf(' ') + 1) }
                        </span>
                        <UncontrolledTooltip placement="top" target={"headerTicket-user" + key} >
                            {fullName}
                        </UncontrolledTooltip>
                    </div>
                </div>

                <Media className="overflow-hidden" body>
                <h5 className="text-truncate font-size-12 mb-1">            
                  {email} 
                </h5>
                {
                    !isComment ? 
                    (
                        <p className="text-truncate mb-0"> 
                            <i className="mdi mdi-ticket-confirmation-outline align-self-center me-1 mr-2" />
                                <span style={{cursor:'pointer'}} onClick={() => copyToClipboard(data.ticketNumber)}> { data.ticketNumber } </span> 
                            <i className="bx bx-time-five align-self-center me-1" style={{marginLeft: "1rem"}} />
                               { moment(data.createdAt).format( "DD-MM-YY HH:mm" ) }
                        </p>
                    )
                    : 
                    (
                        <p className="text-truncate mb-0"> 
                             <i className="bx bx-time-five align-self-center me-1" />
                              { detail.updatedAt ? moment(detail.updatedAt).format( "DD-MM-YY HH:mm" ) :  moment(detail.createdAt).format( "DD-MM-YY HH:mm" ) }
                         </p>
                    )
                }
           
                </Media>
             </Media>

              )
          }
    }


    const mediaCommentImage = (data, key) => {
        if(data.users !== null){
            if(data.users.image){
                return (
                <Media className="mb-3" >
                    <Media className="overflow-hidden mr-3" body>
               
                    <h5 className="text-truncate font-size-12 mb-1">
                 
                        {data.users.fullName}
                    </h5>
                    <p className="text-truncate mb-0"> 
                            {
                                data.private && <i className= {"mdi mdi-lock-check-outline " } style={{marginRight:'10px', fontSize:'16px', color:'red' }}></i> 
                            }
                            <i className="bx bx-time-five align-self-center me-1" />
                            { data.updatedAt ?  moment(data.updatedAt).format( "DD-MM-YY HH:mm" ) + `(edited)` :  moment(data.createdAt).format( "DD-MM-YY HH:mm" )}
                        </p>
                    </Media>
                    <div className="align-self-center me-3">
                       <img  src={`${config.apiURL}media/user/${data.users.userId}`} className="rounded-circle avatar-xs" style={{marginLeft:'10px'}} alt={data.users.fullName}  id={"media-comment-img" + data.users.userId+key}/>
                    </div>
                    <UncontrolledTooltip placement="top" target={"media-comment-img" + data.users.userId+key} >
                        {data.users.fullName}
                    </UncontrolledTooltip>
                </Media>
                )
              }
              else { //if user has not image creeate avatar
                return(
                <Media className="mb-3" >
                    <Media className="overflow-hidden" body>
                    <h5 className="text-truncate font-size-12 mb-1"> {data.users.email} </h5>
                    <p className="text-truncate mb-0">
                            {
                                data.private && <i className= {"mdi mdi-lock-check-outline " } style={{marginRight:'10px', fontSize:'16px', color:'red' }}></i> 
                            } 
                            <i className="bx bx-time-five align-self-center me-1" />
                            { data.updatedAt ?  moment(data.updatedAt).format( "DD-MM-YY HH:mm" ) + `(edited)` :  moment(data.createdAt).format( "DD-MM-YY HH:mm" )}
                        </p>
                    </Media>
                    <div className="align-self-center me-3">
                        <div className="avatar-xs d-flex me-2" style={{marginLeft:'10px'}} id={"media-comment-img" + data.users.userId +key} >
                            <span className={ "avatar-title rounded-circle  text-white font-size-18" } style={{background:data.users.color, opacity:0.65 }} >
                                {data.users.fullName.charAt(0) + data.users.fullName.charAt(data.users.fullName.indexOf(' ') + 1) }
                            </span>
                            <UncontrolledTooltip placement="top" target={"media-comment-img" + data.users.userId+key} >
                                {data.users.fullName}
                            </UncontrolledTooltip>
                        </div>
                    </div>
                 </Media>
                  )
              }
        }
        else {
         return mediaHeaderImage(selectedSingleRow, true, data, key );
        }
    }

    const headerComponent = () => {
        if (!isEmpty(selectedSingleRow)) {
            return (
                <li key={`header-msg${selectedSingleRow.id}`} >
                  <div className="conversation-list w-100">
                     <div className="ctext-wrap">
                        {/* { //todo edit ticket
                                activeUser.email === selectedSingleRow.createdBy && (selectedSingleRow.status.id < 5) && (
                                        <UncontrolledDropdown direction="left">
                                            <DropdownToggle href="#" className="btn nav-btn" tag="i" >
                                            <i className="bx bx-dots-vertical-rounded" />
                                            </DropdownToggle>

                                            <DropdownMenu data-popper-placement="left-start">
                                                <DropdownItem onClick={ () => { dispatch(toggleModalCreate(true)) } }>Edit</DropdownItem>
                                                <DropdownItem onClick={ () => {  } }>Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown> 
                                )
                            } */}
                       <div className="mb-3">
                         <h5><b> {selectedSingleRow.subject} </b> </h5>
                       </div>
                      
                       {mediaHeaderImage(selectedSingleRow, null, null, 'key-header') }
                  
                     
                       <p id={`header_component_${selectedSingleRow.id}` } dangerouslySetInnerHTML={{__html: selectedSingleRow.comment}} />
                       {
                         selectedSingleRow.medias.length > 0 &&
                         <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                       }
                       <Row>
                           <EditorResponseAttach data={selectedSingleRow.medias} forheader={true} openImage={ (e) => setopenLightBox(e) }  setImage={(e)=>setcSrc(e)}  />
                       </Row>
   
                     </div>
                   </div>
               </li>
           )

        }
        else{
            return null
        }
      
    }

    const LastResponse = () => {
       if( Object.keys(selectedSingleRow).length > 0 && selectedSingleRow.ticketDetails.length > 0 ){
           let detail = selectedSingleRow.ticketDetails[selectedSingleRow.ticketDetails.length - 1];
          return(
                <EditorResponseLast  
                    detail={detail} 
                    mediaCommentImage={mediaCommentImage} 
                    onEditComment={onEditComment} 
                    onDeleteComment={onDeleteComment} 
                    toggleShowEditCommentModal={toggleShowEditCommentModal}
                    scrollDown={scrollDown}
                    openImage={ (e) => setopenLightBox(e) } 
                    setImage={(e)=>setcSrc(e)}
                />
            )
       }
       else{
            if( !isEmpty(selectedSingleRow) && selectedSingleRow.status.id < 5 ) { return(<EditorResponseReply detail={"center"} scrollDown={(e)=>{  scrollDown(e) } }/>) }
            else { return null }
       }
    }

    const onEditComment = (detail) => {
        setidEditValue(detail.id)
        setcommentEditValue(detail.comment)
        setshowModalEditComment(true)
    } 

    const toggleShowEditCommentModal = () => {
        setshowModalEditComment(!showModalEditComment);
    }

    const onDeleteComment = (detail) => {
        setdeletedComment(detail)
        setshowModalDeleteComment(true)
    }

    const scrollDown = useCallback( (e) => {
        if (messageBox) {
            let el = document.getElementById("last-comment-li");
            if(el) el.scrollIntoView();
          }
       },[]);

    const scrollDownOld = (e) => {
        if (messageBox) {
            let el = document.getElementById("last-comment-li");
            if(el) el.scrollIntoView();
          }
    }
    return (
        <React.Fragment>
            <Card>
              <CardBody className='card-body-convers'>
                <div className="chat-conversation">
                    <ul className="list-unstyled">
                        <PerfectScrollbar style={{ height: "85vh" }} id='scrollbar-container' containerRef={ref => setMessageBox(ref)} >
                       
                        { headerComponent() } 

                        { LastResponse()  }

                        { 
                        !isEmpty(selectedSingleRow) && !isEmpty(selectedSingleRow.ticketDetails)
                        &&
                         ( 
                            <>
                                <li> <div className="chat-day-title"> <span className="title">History Response</span> </div> </li>
                                {
                                    map(selectedSingleRow.ticketDetails, (detail, key) => (
                                        <li key={"messsage-detail" + detail.id} className={ detail.users !== null ? "right" : "" } >
                                            <div className="conversation-list">
                                            <div className="ctext-wrap">
                                                <Row>
                                                    {
                                                        detail.users !== null  && activeUser.id == detail.users.userId && (selectedSingleRow.status.id < 5) && (
                                                            <Col>
                                                                <UncontrolledDropdown direction="right">
                                                                    <DropdownToggle href="#" className="btn nav-btn" tag="i" >
                                                                    <i className="bx bx-dots-vertical-rounded" />
                                                                    </DropdownToggle>
                
                                                                    <DropdownMenu data-popper-placement="right-start" >
                                                                        <DropdownItem onClick={ () => {  onEditComment(detail)  } }>Edit</DropdownItem>
                                                                        <DropdownItem onClick={ () => {  onDeleteComment(detail)  } }>Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown> 
                                                            </Col>
                                                        )
                                                    }
                                                    <Col> { mediaCommentImage(detail, key) } </Col>
                                                    {
                                                        detail.users === null && activeUser.email === selectedSingleRow.createdBy && selectedSingleRow.status.id < 5  && (
                                                            <Col>
                                                                <UncontrolledDropdown direction="left">
                                                                    <DropdownToggle href="#" className="btn nav-btn" tag="i" >
                                                                    <i className="bx bx-dots-vertical-rounded" />
                                                                    </DropdownToggle>
                
                                                                    <DropdownMenu data-popper-placement="left-start">
                                                                        <DropdownItem onClick={ () => {  onEditComment(detail)  } }>Edit</DropdownItem>
                                                                        <DropdownItem onClick={ () => {  onDeleteComment(detail)  } }>Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown> 
                                                            </Col>
                                                        )
                                                    }
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p id={`comment_component_${detail.id}` } dangerouslySetInnerHTML={{__html: detail.comment}} />
                                                    </Col>
                                                </Row>
                                                {
                                                    !isEmpty(detail.medias) &&
                                                    <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                                                }
                                                <Row className={detail.users !== null ? "justify-content-end" : ""}>
                                                    <EditorResponseAttach data={detail.medias} forheader={false} openImage={ (e) => setopenLightBox(e) }  setImage={(e)=>setcSrc(e)} />
                                                </Row>
                                            </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </>
                         )
                        }
                        {
                            !isEmpty(selectedSingleRow) && (selectedSingleRow.status.id === 6) &&  !isEmpty(selectedSingleRow.rejectedReason) &&
                            <>
                                <li> <div className="chat-day-title"> <span className="title">Reject Reason</span> </div> </li>
                                  <li key={"messsage-reject-reason" + selectedSingleRow.id} className={"reject-reason-info"} >
                                      <div className="conversation-list">
                                            <div className="ctext-wrap">
                                                <Row>
                                                    <Col>
                                                        <p id={`rejected_reason${selectedSingleRow.id}` } dangerouslySetInnerHTML={{__html: selectedSingleRow.rejectedReason }} />
                                                    </Col>
                                                </Row>
                                            </div>
                                     </div>
                                </li>
                            </>
                        }
                        {
                            openLightBox  ? (
                            <Lightbox
                                    mainSrc={cSrc}
                                    enableZoom={true}
                                    onCloseRequest={() => { setopenLightBox(false) }}
                                    onMovePrevRequest={() => {
                                    }}
                                    onMoveNextRequest={() => {
                                    }}
                                    reactModalStyle={{'z-index':1000005}}
                                    // imageCaption={"Project " + parseFloat(photoIndex + 1)}
                                    />
                            ) : null
                        }

                        </PerfectScrollbar>
                    </ul>
                </div>
              </CardBody>
            </Card>
            {
              showModalEditComment ? (
                    <EditorResponseEdit id={idEditValue} comment={commentEditValue} show={showModalEditComment} toggle={toggleShowEditCommentModal}/>
              ) : null
            }
            { showModalDeleteComment ? (
                    <SweetAlert
                      title="Are you sure?"
                      warning
                      showCancel
                      confirmButtonText="Yes, delete it!"
                      confirmBtnBsStyle="success"
                      cancelBtnBsStyle="danger"
                      onConfirm={() => {
                        setshowModalDeleteComment(false)
                        let data = [];
                        data.push(deletedComment);
                       
                        dispatch(deleteTicketComment(data))
                        setshowSuccessAlert(true)
                        setdescSuccessAlert("Deleted")
                      }}
                      onCancel={() => setshowModalDeleteComment(false)}
                    >
                      You won't be able to revert this!
                    </SweetAlert>
                  ) : null
            }
        
            {
                showSuccessAlert ? (
                    <SweetAlert
                    success
                    title={descSuccessAlert}
                    timeout={1000}
                    showConfirm={false}
                    onConfirm={() => {
                        setshowSuccessAlert(false)
                    }}
                    />
                ) : null
            }

        </React.Fragment>
    )
}

export default React.memo(EditorResponse)

