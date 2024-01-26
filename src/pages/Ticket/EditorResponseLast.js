import React from 'react'
import { Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import { useSelector } from 'react-redux'
import EditorResponseAttach from './EditorResponseAttach'
import EditorResponseReply from './EditorResponseReply'
import isEmpty from 'helpers/isEmpty_helper'

function EditorResponseLast({detail, mediaCommentImage, onEditComment, onDeleteComment, scrollDown, openImage, setImage}) {
    const activeUser = useSelector(state => state.Login.user)
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
    return (
        <>
          <li>
            <div className="chat-day-title" >  <span className="title">Last Response</span> </div>
          </li>
          <li key={"messsage-detail" + detail.id}  className={ detail.users !== null ? "right last-comment" : "last-comment" } >
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
                        <Col> { mediaCommentImage(detail,'last-response') } </Col>
                        {
                            detail.users === null && activeUser.email === selectedSingleRow.createdBy && (selectedSingleRow.status.id < 5) && (
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
                            <p id={`last_response_component_${detail.id}` } dangerouslySetInnerHTML={{__html: detail.comment}} />
                        </Col>
                    </Row>
                    {
                         detail.medias.length > 0 &&
                         <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                    }
                    <Row className={detail.users !== null ? "justify-content-end" : ""}>
                      <EditorResponseAttach data={detail.medias} forheader={false}  openImage={ (e) => openImage(e) } setImage={(e)=>setImage(e)} />
                    </Row>
                   
                    
                  </div>
              </div>
           </li>
           {
                !isEmpty(selectedSingleRow) &&
                 (selectedSingleRow.status.id < 5 ) && 
                <EditorResponseReply detail={"center"} scrollDown={(e)=>{  scrollDown(e) } }/>
           }
        </>
    )
}

export default EditorResponseLast
