import React, { useEffect, useState, useRef } from "react"
import MetaTags from 'react-meta-tags';
import { useSelector, useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { isEmpty, map } from "lodash"
import moment from "moment"
import { Button, Col, Container, Input, Row} from "reactstrap"
import TicketList from "./TicketList"
import TicketResponse from "./TicketResponse"
import VerificationModal from "./VerificationModal"
import TicketColorLegend from "./TicketColorLegend";
import { toggleVerifyOpenTicket } from "store/actions"

function index() {
  const history = useHistory();
  const showModal = useSelector(state => state.ticketsClient.showVerifyOpen)
  const isDBActive = useSelector(state => state.tickets.isDBActive)
  const dispatch = useDispatch()
  const [collapseGrid, setcollapseGrid] = useState(true)
  const [leftSide, setleftSide] = useState("4")
  const [rightSide, setrightSide] = useState("8")
  const thisGrid = useRef(null);  

  useEffect(() => {
    const search = history.location.search;
    const ticketNumber = new URLSearchParams(search).get('tn');
    const ticketToken = new URLSearchParams(search).get('tcid');
    if(ticketNumber){
      setsearchValue(ticketNumber);
    }
    else if(ticketToken){
      dispatch(toggleVerifyOpenTicket(true))
    }
  }, [])

  useEffect(() => {
    if(collapseGrid){
      setleftSide('4')
      setrightSide('8')
      if(!isEmpty(thisGrid)){
        thisGrid.current.instance.refresh();
      }
    }
    else{
      setleftSide('8')
      setrightSide('4')
      if(!isEmpty(thisGrid)){
        thisGrid.current.instance.refresh();
      }
    }
    
  }, [collapseGrid])

  const [searchValue, setsearchValue] = useState('')

    return (
        <React.Fragment>
          <MetaTags>
            <title>My Ticket | Ticketing</title>
          </MetaTags>
          <Container fluid>
           {
              showModal ?    
              <VerificationModal />
              :
              <Row>
              <Col lg={leftSide}>
                <Row  className="mb-4">
                  <Col>
                     <Link to="/create-ticket" className="btn btn-danger" disabled={!isDBActive}  style={ collapseGrid ?  { width:'30%'} : {width:'20%'}}>
                             Create Ticket
                      </Link>
                  </Col>
                </Row>
                <Row  className="mb-4">
                  <Col style={{position:'relative'}}>
                    <div style={{width:'100%', float:'left'}}>
                      <TicketList searchValue={searchValue} thisGrid={thisGrid}/>
                    </div>
                    <div className="align-item-center" >
                      <i className="mdi mdi-arrow-split-vertical" 
                            onClick={() => {
                              setcollapseGrid(!collapseGrid);
                     
                            }}
                            style={{
                              fontSize:'30px',
                              zIndex:1,
                              cursor:'pointer',
                              position:'absolute',
                              top:'50%',
                              right:'-1%'  
                            }} 
                      />
                    </div>
                  </Col>
                </Row>
                {/* <Row  className="mb-4">
                  <Col>
                    <TicketColorLegend />
                  </Col>
                </Row> */}
              </Col>
              <Col lg={rightSide}>
                <TicketResponse />  
              </Col>
            </Row>
            }
          </Container>

      </React.Fragment>
    )
}

export default React.memo(index)
