import React, { useEffect, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import {  map } from "lodash"
import {  Card, Col, Row, Media, UncontrolledTooltip } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import moment from "moment"
import isEmpty from "helpers/isEmpty_helper"
import config from '../../../config'
import TicketResponseAttach from './TicketResponseAttach'
import TicketResponseLast from './TicketResponseLast'
import TicketResponseReply from './TicketResponseReply'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"


function TicketResponse() {
  const allTickets = useSelector(state => state.ticketsClient.allTickets)
  const activeTicket = useSelector(state => state.ticketsClient.activeTicket)
  const activeClient = useSelector(state => state.authClient.client)
  const [selectedSingleRow, setselectedSingleRow] = useState(null)
  const [cSrc, setcSrc] = useState('')
  const [openLightBox, setopenLightBox] = useState(false)
  const [messageBox, setMessageBox] = useState(null)

  useEffect(() => {
    if(!isEmpty(allTickets) && !isEmpty(activeTicket)){
      let sct = allTickets.find(f => f.id === activeTicket);
      setselectedSingleRow(sct)
    }
  }, [allTickets, activeTicket])

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

  const mediaHeaderImage = (data, isComment, detail, key) => {
      let id = data.ticketType === "E" ? data.senders.id  : data.users.id;
      let fullName = data.ticketType === "E" ? data.senders.firstName + ' ' + data.senders.lastName : data.users.firstName + ' ' + data.users.lastName;
      let src = data.ticketType === "E" ? `${config.apiURL}media/sender/${data.senders.id}` : `${config.apiURL}media/user/${data.users.id}`;
      let email = data.ticketType === "E" ? data.senders.email  : data.users.email;
      let image = data.ticketType === "E" ? data.senders.image  : data.users.image;
      let color = data.ticketType === "E" ? data.senders.color  : data.users.color;
      if(image){
          return (
          <Media className="mb-3">
              <div className="align-self-center me-3">
                <img  src={src} className="rounded-circle avatar-xs" alt={fullName} id={"headerTicket-client-page-" + key} />
              </div>
              <Media className="overflow-hidden" body>
              <h5 className="text-truncate font-size-12 mb-1"> {email} </h5>
              <p className="text-truncate mb-0"> 
                      <i className="bx bx-time-five align-self-center me-1" />
                      {
                          isComment ? ( detail.updatedAt ? moment(detail.updatedAt).format( "DD-MM-YY HH:mm" ) :  moment(detail.createdAt).format( "DD-MM-YY HH:mm" ) )
                          :
                          moment(data.createdAt).format( "DD-MM-YY HH:mm" )
                      }
              </p>
              </Media>
              <UncontrolledTooltip placement="top" target={"headerTicket-client-page-" + key} >
                          {fullName}
              </UncontrolledTooltip>
          </Media>
          )
        }
        else { //if sender has not image creeate avatar
            return(
              <Media className="mb-3" >
              <div className="align-self-center">
                  <div className="avatar-xs d-flex me-3" id={"headerTicket-client-page-" + key}>
                      <span className={ "avatar-title rounded-circle text-white font-size-25"  }  style={{background:color, opacity:0.65 }} >
                          {fullName.charAt(0) + fullName.charAt(fullName.indexOf(' ') + 1) }
                      </span>
                      <UncontrolledTooltip placement="top" target={"headerTicket-client-page-" + key} >
                          {fullName}
                      </UncontrolledTooltip>
                  </div>
              </div>

              <Media className="overflow-hidden" body>
              <h5 className="text-truncate font-size-12 mb-1"> {email} </h5>
              <p className="text-truncate mb-0"> 
                      <i className="bx bx-time-five align-self-center me-1" />
                      {
                          isComment ? ( detail.updatedAt ? moment(detail.updatedAt).format( "DD-MM-YY HH:mm" ) :  moment(detail.createdAt).format( "DD-MM-YY HH:mm" ) )
                          :
                          moment(data.createdAt).format( "DD-MM-YY HH:mm" )
                      }
                  </p>
              </Media>
          </Media>

            )
        }
  }

  const mediaCommentImage = (data, key) => {
      if(data.users !== null){
          if(data.users.image){
              return (
              <Media className="mb-3">
                  <Media className="overflow-hidden mr-3" body>
                  <h5 className="text-truncate font-size-12 mb-1"> {data.users.email} </h5>
                  <p className="text-truncate mb-0"> 
                          <i className="bx bx-time-five align-self-center me-1" />
                          { data.updatedAt ?  moment(data.updatedAt).format( "DD-MM-YY HH:mm" )  :  moment(data.createdAt).format( "DD-MM-YY HH:mm" )}
                      </p>
                  </Media>
                  <div className="align-self-center me-3">
                    <img  src={`${config.apiURL}media/user/${data.users.userId}`} className="rounded-circle avatar-xs" style={{marginLeft:'10px'}} alt={data.users.fullName}  id={"comment-ticket-client-" + data.users.userId + key}/>
                  </div>
                  <UncontrolledTooltip placement="top" target={"comment-ticket-client-" + data.users.userId + key} >
                              {data.users.fullName}
                    </UncontrolledTooltip>
              </Media>
              )
            }
            else { //if user has not image creeate avatar
                return(
                <Media className="mb-3">
                  <Media className="overflow-hidden" body>
                  <h5 className="text-truncate font-size-12 mb-1"> {data.users.email} </h5>
                  <p className="text-truncate mb-0"> 
                          <i className="bx bx-time-five align-self-center me-1" />
                          { data.updatedAt ?  moment(data.updatedAt).format( "DD-MM-YY HH:mm" )  :  moment(data.createdAt).format( "DD-MM-YY HH:mm" )}
                      </p>
                  </Media>
                  <div className="align-self-center me-3">
                      <div className="avatar-xs d-flex me-2" style={{marginLeft:'10px'}}  id={"comment-ticket-client-" + data.users.userId + key} >
                          <span className={ "avatar-title rounded-circle text-white font-size-18" } >
                              {data.users.fullName.charAt(0) + data.users.fullName.charAt(data.users.fullName.indexOf(' ') + 1) }
                          </span>
                          <UncontrolledTooltip placement="top" target={"comment-ticket-client-" + data.users.userId + key} >
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
      if(isEmpty(selectedSingleRow)){
        return null;
      }
      return (
          <li key={`header-msg${selectedSingleRow.id}`} >
            <div className="conversation-list w-100">
                <div className="ctext-wrap">
                  <div className="mb-3">
                    <h5><b> {selectedSingleRow.subject} </b> </h5>
                  </div>

                  {mediaHeaderImage(selectedSingleRow, null, null, 'key-header') }
                
                  <p id={`header_component_${selectedSingleRow.id}` }  dangerouslySetInnerHTML={{__html: selectedSingleRow.comment}} />
                  {
                    selectedSingleRow.medias.length > 0 &&
                    <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                  }
                  <Row>
                    <TicketResponseAttach data={selectedSingleRow.medias} forheader={true} openImage={ (e) => setopenLightBox(e) }  setImage={(e)=>setcSrc(e)} />
                  </Row>

                </div>
              </div>
          </li>
      )
  }

  const LastResponse = () => {
    if(isEmpty(selectedSingleRow)){ return }
    if(isEmpty( selectedSingleRow.ticketDetails)){
        if(selectedSingleRow.status.id < 5 && selectedSingleRow.createdBy === activeClient.email){
            return (<TicketResponseReply detail={"center"} selectedSingleRow={selectedSingleRow} scrollDown={(e)=>{  scrollDown(e) } }/>)
        }
        else{
            return null
        }
    }
  
  let detail = selectedSingleRow.ticketDetails[selectedSingleRow.ticketDetails.length - 1];
    return(
      <TicketResponseLast  
          detail={detail} 
          selectedSingleRow={selectedSingleRow}
          mediaCommentImage={mediaCommentImage} 
          onEditComment={onEditComment} 
          onDeleteComment={onDeleteComment} 
          toggleShowEditCommentModal={toggleShowEditCommentModal}
          scrollDown={scrollDown}
          openImage={ (e) => setopenLightBox(e) } 
          setImage={(e)=>setcSrc(e)}
          activeClient = {activeClient}
        />
    )
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
        <>
            <Card className="p-3">
                <div className="chat-conversation">
                    <ul className="list-unstyled p-0 m-0">
                        <PerfectScrollbar style={{ height: "82vh" }} containerRef={ref => setMessageBox(ref)} >
                       
                        { headerComponent() } 

                        { LastResponse()  }

                        { 
                          !isEmpty(selectedSingleRow)  && !isEmpty(selectedSingleRow.ticketDetails)
                          &&
                          ( 
                              <>
                                  <li> <div className="chat-day-title"> <span className="title">History Response</span> </div> </li>
                                  {
                                    map(selectedSingleRow.ticketDetails, detail => (
                                        <li key={"messsage-detail" + detail.id} className={ detail.users !== null ? "right" : "" } >
                                            <div className="conversation-list">
                                            <div className="ctext-wrap">
                                                <Row>
                                                    <Col> { mediaCommentImage(detail) } </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p id={`comment_component_${detail.id}` }  dangerouslySetInnerHTML={{__html: detail.comment}} />
                                                    </Col>
                                                </Row>
                                                {
                                                    detail.medias.length > 0 &&
                                                    <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                                                }
                                                <Row className={detail.users !== null ? "justify-content-end" : ""}>
                                                    <TicketResponseAttach data={detail.medias} forheader={false} />
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
                                    reactModalStyle={{'z-index':1000005}}
                                />
                            ) : null
                        }
                        </PerfectScrollbar>
                    </ul>
                </div>
            </Card>
            
        </>
    )
}

export default React.memo(TicketResponse)
