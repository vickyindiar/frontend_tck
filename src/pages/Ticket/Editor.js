import React, { memo, useEffect } from 'react'
import MetaTags from 'react-meta-tags'
import { Button, Card, Col, Container, Row, Nav, NavItem, NavLink } from "reactstrap"
import classnames from "classnames"
import EditorTimeLine from './EditorTimeLine'
import EditorControl from './EditorControl'
import EditorResponse from './EditorResponse'
import EditorAssigns from './EditorAssigns'
import SimpleBar from "simplebar-react"
import { Link } from "react-router-dom"
import EditorBadge from './EditorBadge'
import { useSelector, useDispatch } from 'react-redux'
import isEmpty from 'helpers/isEmpty_helper'



function Editor({onClose}) {
  const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
  useEffect(() => {
 
  }, [])

    return (
        <React.Fragment>
          {/* <Container fluid> */}
          <SimpleBar style={{ height: "900px" }} id="ticket-editor-drawer">
            <div data-simplebar className="h-100">
              <div className="rightbar-title px-3 py-3">
                <Link to="#" onClick={e => { onClose() }} className="right-bar-toggle float-end" >
                  <i className="mdi mdi-close noti-icon" />
                </Link>
              </div>

              <Row className="no-marginlr">
                <Col lg="3">
                  { 
                    !isEmpty(selectedSingleRow) && 
                    (
                      <>
                      <EditorAssigns />
                      <EditorBadge />
                      <EditorControl />
                      <EditorTimeLine />
                      </>
                    )
                  }
                   
                </Col>
                <Col lg="9">
                  {
                     !isEmpty(selectedSingleRow) && 
                    ( <EditorResponse/> )       
                  }
                </Col>
              </Row>
          </div>
          </SimpleBar>
          {/* </Container> */}
        
      </React.Fragment>
    )
}
const areEqual = (prevProps, nextProps) => { return true; };
export default memo( Editor, areEqual)
