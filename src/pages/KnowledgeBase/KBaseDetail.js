import React, {useState, useEffect}  from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, Label, Row, Col, Card, CardHeader, CardBody, Container } from "reactstrap"
import { getApps } from 'store/actions'
import Toolbar, { Item } from 'devextreme-react/toolbar'
import isEmpty from 'helpers/isEmpty_helper'
import SelectBox from 'devextreme-react/select-box'
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getKbasesById, toggleModalEditKbase, deleteKbase, reqFreeToken } from 'store/actions'
import KBaseAttachment from './KBaseAttachment'
import moment from "moment"
import { Button as  DxButton } from 'devextreme-react/button'
import EditKBaseModal from './EditKBaseModal'
import { confirm } from 'devextreme/ui/dialog'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import styled from 'styled-components'

const KBaseDetail = () => {
  const [depts, setdepts] = useState([])
  const selectedRow = useSelector(state => state.kbase.sKbases)
  const appActive = useSelector(state => state.kbase.appActive)
  const moduleActive = useSelector(state => state.kbase.moduleActive)
  const activeUser = useSelector(state =>  state.Login.user)
  const modalEditKbase = useSelector(state => state.kbase.modalEditKbase)
  const [appName, setappName] = useState('All')
  const [moduleName, setmoduleName] = useState('All')
  const freeToken = useSelector(state => state.authClient.freeToken)
  const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)
  const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)
  const dispatch = useDispatch()
  const history = useHistory()

  const [openLightBox, setopenLightBox] = useState(false)
  const [cSrc, setcSrc] = useState('')
  

  useEffect(() => {
    if(!isEmpty(activeUser)){
        activeUser.dept.forEach(d => {
            setdepts([...depts, d.departmentId])
        });
    }
  }, [activeUser])

  useEffect(() => {
    if(isAuthenticatedClient || !isEmpty(freeToken) ){
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let tid = params.get('id');
      dispatch(getKbasesById(parseInt(tid), freeToken))
    }
}, [freeToken])


  useEffect(() => {
    if(!isAuthenticatedUser && !isAuthenticatedClient && !freeToken){
      dispatch(reqFreeToken()) 
    }
    else{
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let tid = params.get('id');
      dispatch(getKbasesById(parseInt(tid)))
    }
}, [])

  useEffect(() => {
    if(!isEmpty(selectedRow)){
      if(!isEmpty(selectedRow.apps)){ setappName(selectedRow.apps.name) }
      if(!isEmpty(selectedRow.modules)){ setmoduleName(selectedRow.modules.name)}

      if(selectedRow.body.includes('<img') || selectedRow.medias.length > 0){
        let p = document.getElementById(`body_kbase_component_${selectedRow.id}`);
        let imglist = p.getElementsByTagName('img');
        for (let i = 0; i < imglist.length; i++) {
            imglist[i].addEventListener("click", () => {
                setopenLightBox(true);
                setcSrc(imglist[i].src)
            });
        }
      }

    }
  }, [selectedRow])



  const onDeleteKBase = async(id) => {
    const confirmDelete = () => {
     dispatch(deleteKbase(id, appActive, moduleActive, history))
    }
    let result = await confirm("Are you sure you want to delete ?", "Confirm Delete");
    if(result){
        confirmDelete()
    }
  }

  const onEditKBase = (e, id) => {
      dispatch(getKbasesById(id))
      dispatch(toggleModalEditKbase(true))
  }

  const showAttachment = () => {
    if(!isAuthenticatedUser && !isAuthenticatedClient ){
        if(freeToken){
          return(
          <Row>
            <KBaseAttachment data={selectedRow.medias} folder={'KBases'}  openImage={ (e) => setopenLightBox(e) }  setImage={(e)=>setcSrc(e)} freeToken={freeToken}  />
          </Row>
          )
        }
        else{
          return null;
        }
    }
    else{
      return(
        <Row>
          <KBaseAttachment data={selectedRow.medias} folder={'KBases'}  openImage={ (e) => setopenLightBox(e) }  setImage={(e)=>setcSrc(e)} freeToken={freeToken}  />
        </Row>
        )
    }
  }



    return (
      <Container fluid>
        <Breadcrumbs title="KnowledgeBase" breadcrumbItem="Article" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="pt-5">
                  <div className="row justify-content-center">
                    <div className="col-xl-8">
                        <div className="text-center">
                           <div className="mb-2">
                            {/* <Link to="#" className="badge bg-light font-size-12" >
                                <i className="bx bx-purchase-tag-alt align-middle text-muted me-1"></i>{" "}
                                Project
                            </Link> */}
                          </div> 
                          <h4>{selectedRow.title}</h4>
                        </div>

                        <hr />
                        <div className="text-center">
                          <Row>
                            <Col sm={isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) ? 3 : 4}>
                              <div>
                                <p className="text-muted mb-2">Application</p>
                                <h5 className="font-size-15">{ !isEmpty(selectedRow) ? `${appName} - ${moduleName}` : ''}  </h5>
                              </div>
                            </Col>
                            <Col sm={isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) ? 3 : 4}>
                              <div className="mt-4 mt-sm-0">
                                <p className="text-muted mb-2">Date</p>
                                <h5 className="font-size-15">{!isEmpty(selectedRow) ? moment(selectedRow.createdAt).format("MMM Do YYYY") : ''}</h5>
                              </div>
                            </Col>
                            <Col sm={isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) ? 3 : 4}>
                              <div className="mt-4 mt-sm-0">
                                <p className="text-muted mb-2">Post by</p>
                                <h5 className="font-size-15">{  !isEmpty(selectedRow) ? `${selectedRow.users.firstName} ${selectedRow.users.lastName}` : ''}</h5>
                              </div>
                            </Col>
                            {
                                isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) &&
                                (
                                  <Col sm={3}>
                                  <div className="mt-4 mt-sm-0">
                                    <p className="text-muted mb-2">Action</p>
                                    {
                                        !isEmpty(selectedRow) &&
                                        (
                                            <div className="d-flex justify-content-center">
                                                <DxButton
                                                    width={20}
                                                    hint="Edit"
                                                    icon= {'edit'}
                                                    type="default"
                                                    stylingMode="outlined"
                                                    // className='d-flex justify-content-center'
                                                    visible={ depts.includes(1) || depts.includes(2) }
                                                    style={ { opacity:'0.75', borderRadius:'50%', marginRight:'3px', marginLeft:'10px', border:'hidden', float:'right' } }
                                                    onClick={(e) => { onEditKBase(e, selectedRow.id) }}
                                                />
                                                <DxButton
                                                    width={20}
                                                    hint="Delete"
                                                    icon= {'trash'}
                                                    type="danger"
                                                    stylingMode="outlined"
                                                    visible={ depts.includes(1) || depts.includes(3) }
                                                    style={ { opacity:'0.75', borderRadius:'50%', marginRight:'3px', border:'hidden', float:'right' } }
                                                    onClick={() => { 
                                                        onDeleteKBase(selectedRow.id) 
                                                    }}
                                                />
                                            </div>
                                        )  
                                    }
                                  </div>
                                </Col>
                                )
                            }
                           
                          </Row>
                        </div>
                        <hr />

                        <div className="mt-4">
                          <div className="text-muted font-size-14">
                                {!isEmpty(selectedRow) ? 
                                 (<p id={`body_kbase_component_${selectedRow.id}` } dangerouslySetInnerHTML={{__html: selectedRow.body}} />)
                                 :
                                 ''
                                }
                          </div>
                          {
                            !isEmpty(selectedRow)  && selectedRow.medias.length > 0 &&
                            <Row> <Col> <hr style={{padding:'0px', marginBottom:'5px'}}/> </Col> </Row>
                          }
                          <div className="mt-5">
                            {
                              showAttachment()
                            }
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {
         modalEditKbase ?  < EditKBaseModal /> : null
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
                      //reactModalStyle={{'z-index':1000005}}
                      // imageCaption={"Project " + parseFloat(photoIndex + 1)}
                      />
              ) : null
        }
      </Container>
    )
}

export default React.memo(KBaseDetail)
