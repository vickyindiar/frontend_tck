import React, {useState, useEffect}  from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Card, CardHeader, CardBody, Container } from "reactstrap"
import { getApps, getKbases, toggleModalCreateKbase, getKbasesByApp, 
    changeAppActive, changeModuleActive, toggleModalEditKbase, deleteKbase, getKbasesById, reqFreeToken} from 'store/actions'
import { Link } from 'react-router-dom'
import Toolbar, { Item } from 'devextreme-react/toolbar'
import isEmpty from 'helpers/isEmpty_helper'
import SelectBox from 'devextreme-react/select-box'
import { Button as  DxButton } from 'devextreme-react/button'
import CreateKBaseModal from './CreateKBaseModal'
import EditKBaseModal from './EditKBaseModal'
import { confirm } from 'devextreme/ui/dialog'


const KBaseList = () => {
    const [depts, setdepts] = useState([])
    const [app, setapp] = useState('')
    const [appList, setappList] = useState([])
    const appActive = useSelector(state => state.kbase.appActive)
    const moduleActive = useSelector(state => state.kbase.moduleActive)
    const [module, setmodule] = useState('')
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [moduleDisabled, setmoduleDisabled] = useState(true);
    const [moduleList, setmoduleList] = useState([ { desc: "", id: '', name: "All" }])
    const dsApps = useSelector(state => state.misc.allApps)
    const activeUser = useSelector(state =>  state.Login.user)
    const modalCreateKbase = useSelector(state => state.kbase.modalCreateKbase)
    const modalEditKbase = useSelector(state => state.kbase.modalEditKbase)
    const filteredKbases = useSelector(state => state.kbase.filteredKbases)

    const freeToken = useSelector(state => state.authClient.freeToken)
    const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)
    const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)

    
    const dispatch = useDispatch()

    const onAppChanged = (e) => {
        setmodule('');
        setapp(e.value);
        const moduleL = dsApps.find(v => v.id === e.value);
        let nModule = [{ appId: '', desc: "", id: '', name: "All" }]
        if(!isEmpty(moduleL) && moduleL.hasOwnProperty('modules')){
          if(moduleDisabled) setmoduleDisabled(false);
          setmoduleList([...moduleL.modules, ...nModule]);
        }
        else{
            setmoduleList([...nModule]);
        }

        dispatch(changeAppActive(e.value))
        dispatch(getKbasesByApp(e.value, module, freeToken))
    }

    const onModuleChanged = (e) => {
        setmodule(e.value);
        dispatch(changeModuleActive(e.value));
        dispatch(getKbasesByApp(app, e.value, freeToken))
    }
  
    const backButtonOptions = {
        type: 'back',
        onClick: () => {
          notify('Back button has been clicked!');
        },
      };

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
       if(!isEmpty(dsApps)){
        let nApp = [{ desc: '', id: '', name: 'All' }]
        setappList([...dsApps, ...nApp ])
        let cModule = appActive === '' ? {modules:[]} : dsApps.find(v => v.id === appActive);
        let nModule = [{ appId: '', desc: '', id: '', name: 'All' }]
        setmoduleList([...cModule.modules, ...nModule])
        if(appActive === '' && moduleActive === ''){
            dispatch(getKbases(freeToken))
        }
        else {
            dispatch(getKbasesByApp(appActive, moduleActive, freeToken))
        }
       }
    }, [dsApps])

    useEffect(() => {
        if(!isEmpty(activeUser)){
            activeUser.dept.forEach(d => {
                setdepts([...depts, d.departmentId])
            });
        }
    }, [activeUser])

    const onDeleteKBase = async(id) => {
        const confirmDelete = () => {
            dispatch(deleteKbase(id, appActive, moduleActive))
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

    return (
        <>
        <div>
            <Row className="justify-content-center">
                <Col xl={12}>
                <Card>
                 <CardHeader>
                     <Row>
                         <Col sm='2'>
                             {
                                dsApps.length > 0 && 
                                <SelectBox 
                                    dataSource={appList} 
                                    //placeholder={appPlaceholder}
                                    showClearButton={false} 
                                    stylingMode="underlined" 
                                    label={'Application'}
                                    labelMode={'floating'}
                                    value={appActive} 
                                    displayExpr={"name"} 
                                    valueExpr={"id"} 
                                    disabled ={ false }
                                    onValueChanged={(e) => { onAppChanged(e) }} 
                                    >
                                </SelectBox>
                            }
                         </Col>
                         <Col sm= '2'>
                            <SelectBox 
                                dataSource={moduleList}  
                                showClearButton={true} 
                                stylingMode='underlined' 
                                label={modulePlaceHolder}
                                labelMode='floating'
                                value={moduleActive} 
                                displayExpr={"name"} 
                                valueExpr={"id"}  
                                onValueChanged={(e) => { onModuleChanged(e)}}
                                // disabled={moduleDisabled} 
                            />
                         </Col>
                         <Col sm="6"></Col>
                         <Col sm="2" className='d-flex justify-content-end'>
                            <DxButton
                                hint="Add"
                                text = "Add"
                                icon= {'plus'}
                                type="normal"
                                style={ { marginLeft:'5px' } }
                                visible={ isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) }
                                onClick={() => {  dispatch(toggleModalCreateKbase(true)) }}
                            />
                         </Col>
                     </Row>
                 </CardHeader>
                
                 <CardBody>
                    <div className="mt-2">
                        {/* <div className="d-flex flex-wrap">
                        <div className="me-2">
                            <h4>2020</h4>
                        </div>
                        <div className="ms-auto">
                            <span className="badge badge-soft-success rounded-pill float-end ms-1 font-size-12">
                            03
                            </span>
                        </div>
                        </div>
                        <hr className="mt-2" /> */}

                        <div className="list-group list-group-flush">
                            {
                              filteredKbases.map((v, id) => {
                                  return (
                                      <div className="list-group-item text-muted"  key={`ARTICLES_KBASE_${v.id}`} >
                                        <Link  className='text-muted' to={!isEmpty(freeToken) ? `/knowledgebase/detail?id=${v.id}` : `/admin/knowledgebase/detail?id=${v.id}`} >
                                            <i className="mdi mdi-circle-medium me-1"></i>{" "}
                                            {
                                                v.title
                                            }
                                        </Link>
                                         <DxButton
                                            width={20}
                                            hint="Edit"
                                            icon= {'edit'}
                                            type="default"
                                            stylingMode="outlined"
                                            className='d-flex justify-content-end'
                                            visible={ isAuthenticatedUser && (depts.includes(1) || depts.includes(2)) }
                                            style={
                                                {
                                                    opacity:'0.75',
                                                    borderRadius:'50%',
                                                    marginRight:'3px',
                                                    marginLeft:'10px',
                                                    border:'hidden',
                                                    float:'right'
                                                }
                                            }
                                            onClick={(e) => { onEditKBase(e, v.id) }}
                                        />
                                        <DxButton
                                            width={20}
                                            hint="Delete"
                                            icon= {'trash'}
                                            type="danger"
                                            stylingMode="outlined"
                                            visible={ isAuthenticatedUser && (depts.includes(1) || depts.includes(3)) }
                                            style={
                                                {
                                                    opacity:'0.75',
                                                    borderRadius:'50%',
                                                    marginRight:'3px',
                                                    border:'hidden',
                                                    float:'right'
                                                }
                                            }
                                            onClick={() => { 
                                                onDeleteKBase(v.id) 
                                            }}
                                        />
                                     </div>
                                  )
                              })  
                            }
                        </div>
                    </div>
                   </CardBody>
                  </Card>
                </Col>
            </Row>
        </div>
        {
         modalCreateKbase ?  < CreateKBaseModal /> : null
        }
        {
         modalEditKbase ?  < EditKBaseModal /> : null
        }
        </>
    )
}

export default React.memo(KBaseList)
