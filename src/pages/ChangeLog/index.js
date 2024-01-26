import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from 'react-meta-tags'
import { Container, Row, Col } from "reactstrap"
import CLogContent from './CLogContent'
import LegendColor from './LegendColor'
import isEmpty from 'helpers/isEmpty_helper'
import { Button } from 'devextreme-react/button'
import { toggleModalCreateCLog } from 'store/actions'


function index() {
  const activeUser = useSelector(state =>  state.Login.user)
  const [depts, setdepts] = useState([])
  const dispatch = useDispatch()
  
  useEffect(() => {
      if(!isEmpty(activeUser)){
          activeUser.dept.forEach(d => {
              setdepts([...depts, d.departmentId])
          });
      }
  }, [activeUser])

    return (
        <React.Fragment>
        <div className="page-content" id="page-content-clogs">
          <MetaTags>
            <title>ChangeLog | Ticketing</title>
          </MetaTags>
          <Container fluid>
            {/* <Row className="mb-2">
              <Col className="d-flex justify-content-center" >
                <LegendColor />
              </Col>
            </Row> */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-center">
                <strong style={{fontSize:"3.5rem"}}>Changelog</strong>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <Button
                    hint="Add"
                    text = "Add"
                    icon= {'plus'}
                    type="normal"
                    visible={ depts.includes(1) || depts.includes(3) }
                    style={ { marginLeft:'5px' } }
                    onClick={() => {  dispatch( toggleModalCreateCLog(true)) }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CLogContent />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
}

export default index
