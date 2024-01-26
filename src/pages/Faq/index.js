import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from 'react-meta-tags'
import { Container, Row, Col } from "reactstrap"
import isEmpty from 'helpers/isEmpty_helper'
import { Button } from 'devextreme-react/button'
import SelectBox, {DropDownOptions} from 'devextreme-react/select-box'
import { Validator, RequiredRule } from 'devextreme-react/validator' 
import { toggleModalCreateFaq, toggleModalEditFaq, getApps, reqFreeToken } from 'store/actions'
import FaqTab from './FaqTab'
import { Link, useHistory } from "react-router-dom"

function index() {
  const activeUser = useSelector(state =>  state.Login.user)
  const dsApps = useSelector(state => state.misc.allApps)
  const [app, setApp] = useState(1)
  const [appPlaceholder, setappPlaceholder] = useState('Select Application')
  const [dsModules, setdsModules] = useState([])
  const refValidApp = useRef(null);
  const [depts, setdepts] = useState([])
  const freeToken = useSelector(state => state.authClient.freeToken)
  const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)
  const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)
  const dispatch = useDispatch()
  const history = useHistory()



  useEffect(() => {
    if(!isAuthenticatedUser && !isAuthenticatedClient){
      dispatch(reqFreeToken()) 
    }
    else{
      dispatch(getApps()) 
    }
  }, [])

  useEffect(() => {
    if(isAuthenticatedClient || !isEmpty(freeToken) ){
      if(isEmpty(dsApps)){
        dispatch(getApps(freeToken)) 
      }
    }
}, [freeToken])

  useEffect(() => {
    if(!isEmpty(activeUser)){
          activeUser.dept.forEach(d => {
              setdepts([...depts, d.departmentId])
          });
      }
  }, [activeUser])

useEffect(() => {
  if(!isEmpty(dsApps)){
    const search = history.location.search;
    const tab = new URLSearchParams(search).get('app'); //url from home search
    if(!isEmpty(tab)){
        setApp(app);
    }
    else{
      setApp(dsApps[0].id)
    }
    const moduleL = dsApps.find(v => v.id === app);
    if(moduleL && moduleL.hasOwnProperty('modules')){
      setdsModules([...moduleL.modules]);
    }
  }
}, [dsApps])


  const onAppChanged = (e) => {
    setApp(e)
    const moduleL = dsApps.find(v => v.id === e);
    if(moduleL && moduleL.hasOwnProperty('modules')){
      setdsModules([...moduleL.modules]);
    }
  }


    return (
        <React.Fragment>
        <div className={ isAuthenticatedUser ?  "page-content" : ""}>
          <MetaTags>
            <title>FAQ | Ticketing</title>
          </MetaTags>
          <Container fluid>
            <Row className="mb-3">
              <Col className="d-flex justify-content-center">
                <strong style={{fontSize:"3.5rem"}}>FAQ</strong>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col lg="12 d-flex float-left">
                  <Button
                      hint="Add"
                      text = "Add"
                      icon= {'plus'}
                      type="normal"
                      visible={ !isEmpty(depts) || depts.includes(1) || depts.includes(3) }
                      style={ { marginRight:'5px' } }
                      onClick={() => {  dispatch(toggleModalCreateFaq(true)) }}
                  />
                  <Button
                      hint="Edit"
                      text = "Edit"
                      icon= {'edit'}
                      type="normal"
                      visible={ !isEmpty(depts) || depts.includes(1) || depts.includes(3) }
                      style={ { marginRight:'5px' } }
                      onClick={() => {  dispatch(toggleModalEditFaq(true)) }}
                
                  />
                  {
                    dsApps.length > 0 &&
                    <SelectBox 
                      dataSource={dsApps} 
                      placeholder={appPlaceholder}
                      showClearButton={true} 
                      stylingMode="underlined" 
                      value={app}
                      displayExpr={"name"} 
                      valueExpr={"id"} 
                      style={{marginLeft:'10px'}}
                      onValueChanged={(e)=> { onAppChanged(e.value) }} 
                     />
                  }
              </Col>
            </Row>
            <Row>
              <Col>
                 <FaqTab dsModules={dsModules} app={app} setApp={(e) => onAppChanged(e)}/>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
}

export default index
