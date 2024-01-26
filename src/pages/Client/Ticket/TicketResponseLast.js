import isEmpty from 'helpers/isEmpty_helper'
import React from 'react'
import { Row, Col } from 'reactstrap'
import TicketResponseAttach from './TicketResponseAttach'
import TicketResponseReply from './TicketResponseReply'

function TicketResponseLast({detail, selectedSingleRow, mediaCommentImage, onEditComment, onDeleteComment, scrollDown, openImage, setImage, activeClient}) {
    return (
        <>
          <li>
            <div className="chat-day-title" >  <span className="title">Last Response</span> </div>
          </li>
          <li key={"messsage-detail" + detail.id}  className={ detail.users !== null ? "right last-comment" : "last-comment" } >
             <div className="conversation-list">
                <div className="ctext-wrap">
                    <Row>
                        <Col> { mediaCommentImage(detail, 'last-response') } </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p  id={`last_response_component_${detail.id}` } dangerouslySetInnerHTML={{__html: detail.comment}} />
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
           {
             !isEmpty(selectedSingleRow) && selectedSingleRow.status.id < 5 && selectedSingleRow.createdBy === activeClient.email &&
             <TicketResponseReply detail={"center"} selectedSingleRow={selectedSingleRow} scrollDown={(e) => { scrollDown(e)}} openImage={ (e) => openImage(e) } setImage={(e)=>setImage(e)}/>
           }
        </>
    )
}

export default TicketResponseLast
