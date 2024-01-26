import React, {useState, useEffect, useRef, useCallback, editRef } from 'react'
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap"
import FileUploader from 'devextreme-react/file-uploader'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, EmailRule } from 'devextreme-react/validator' 
import { Lookup, DropDownOptions } from 'devextreme-react/lookup'
import { useDispatch, useSelector } from "react-redux"
import { getApps } from '../../store/misc/actions'
import { updateFaq, toggleModalEditFaq } from '../../store/actions'
import SelectBox from 'devextreme-react/select-box'
import { LoadPanel } from 'devextreme-react/load-panel'
import isEmpty from '../../helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { map } from 'lodash'
import { Button as  DxButton } from 'devextreme-react/button'
import TextArea from 'devextreme-react/text-area';
import { RESET_FAQ_STATE } from 'store/faq/actionTypes'

const loadingEditPosition = { of: '.modal' };

function EditFaqModal({appId}) {
    const dsApps = useSelector(state => state.misc.allApps)
    const activeUser = useSelector(state => state.Login.user)
    const showModalEdit = useSelector(state => state.faq.modalEditFaq)
    const showEditLoadPanel = useSelector(state => state.faq.loadingEdit)
    const sFaqsByTabs = useSelector(state => state.faq.sFaqsByTabs)
    const mTabActive = useSelector(state => state.faq.mTabActive)
    const errText = useSelector(state => state.faq.errText)
    const errType = useSelector(state => state.faq.errType)
    const [app, setApp] = useState(appId)
    const [appPlaceholder, setappPlaceholder] = useState('Select Application')
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [module, setModule] = useState([]) 
    const [title, settitle] = useState([]) 
    const [desc, setdesc] = useState([]) 
    const [ModuleList, setModuleList] = useState(null)
    const [ModuleDisabled, setModuleDisabled] = useState(true)
    // const [rowsDetail, setrowsDetail] = useState([ { row: 0, id:0,  moduleId:'', title:'', titleHeight:45, desc:'', descHeight:45, } ])
    const [rowsDetail, setrowsDetail] = useState([ ])
    const [textAreaTitleHeight, settextAreaTitleHeight] = useState([])
    const [textAreaDescHeight, settextAreaDescHeight] = useState([])
    const refValidApp = useRef(null)
    const refValidModule = useRef(null)
    const refValidTitle = useRef(null)
    const dispatch = useDispatch()

    const toastOption = () => {
      toastr.options = {
          positionClass: "toast-top-right",
          timeOut: 2000,
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
          showDuration: 250,
          hideDuration: 250,
          onHidden: () => { 
                dispatch({type: RESET_FAQ_STATE, payload: { error:{}, errText:'', errType:'' } });  
          } 
        }
  }
  const showToastError = (message) => {
      toastOption();
      toastr.error(message, " ")
  }
  const showToastSuccess = (message) => {
      toastOption();
      toastr.success(message, " ")
  }

  useEffect(() => {
    if(errText !== "" ){
        showToastError(errText)
    }
    }, [errText])


    useEffect(() => {
      dispatch(getApps()) 
    }, [])

    useEffect(() => {
      if(!isEmpty(sFaqsByTabs) && !isEmpty(dsApps)){
        setApp(appId)
        const moduleL = dsApps.find(v => v.id === appId);
        if(moduleL && moduleL.hasOwnProperty('modules')){
          // if(ModuleDisabled) setModuleDisabled(false);
          setModuleList([...moduleL.modules]);
        }
        let cDetail = []
        let [listModule, listTitle, listDesc, listHeightTitle, listHeightDesc]  =  [[], [], [], [], [], [], []]
        sFaqsByTabs.forEach((d, i) => {
          let cObj = {
            row: i,
            id: d.id,
            moduleId: d.moduleId, 
            title: d.question, 
            titleHeight: 50, 
            desc: d.desc, 
            descHeight: 50, 
          }
          cDetail.push(cObj);
          listModule.push(d.moduleId)
          listTitle.push(d.question)
          listDesc.push(d.desc)
          listHeightDesc.push(50)
          listHeightTitle.push(50)
        })
        setModule([...listModule])
        settitle([...listTitle])
        setdesc([...listDesc])
        settextAreaDescHeight([...listHeightDesc])
        settextAreaTitleHeight([...listHeightTitle])
        setrowsDetail([...cDetail])
      }
      else if(!isEmpty(dsApps)){
        const moduleL = dsApps.find(v => v.id === appId);
        if(moduleL && moduleL.hasOwnProperty('modules')){
          // if(ModuleDisabled) setModuleDisabled(false);
          setModuleList([...moduleL.modules]);
        }
      }
    }, [dsApps])


    const updateRowsDetailEvent = (field, value,  key) => {
      let array = [...rowsDetail];
      let array2 = array.map(a => {return {...a}})
      array2.find(a => a.row === key)[field] = value;
      setrowsDetail([...array2])
    }

    const onModuleChanged = (e, key ) => {
      updateRowsDetailEvent('moduleId', e.value, key)
      let cmodule =[...module]
      cmodule[key] = e.value
       setModule([...cmodule]) 
    }
    
    const onTitleChange =(e, key) => {
      updateRowsDetailEvent('title', e.value, key)
      let ctitle =[...title]
      ctitle[key] = e.value
       settitle([...ctitle]) 
    }
    const onDescChange = (e, key)=> {
      updateRowsDetailEvent('desc', e.value, key)
      let cdesc =[...desc]
      cdesc[key] = e.value
      setdesc([...cdesc]) 
    }
    
    const onFocuseInTextArea = (e, field, key ) =>{
      if(field === 'titleHeight'){
        updateRowsDetailEvent(field, 90, key)
        let cHeight = [...textAreaTitleHeight]
        cHeight[key] = 90
         settextAreaTitleHeight([...cHeight]) 
      }
      else if(field === 'descHeight'){
        updateRowsDetailEvent(field, 90, key)
        let cHeight = [...textAreaDescHeight]
        cHeight[key] = 90
         settextAreaDescHeight([...cHeight]) 
      }
    }

    const onFocuseOutTextArea = (e, field, key ) =>{
      if(field === 'titleHeight'){
        updateRowsDetailEvent(field, 45, key)
        let cHeight = [...textAreaTitleHeight]
        cHeight[key] = 45
         settextAreaTitleHeight([...cHeight]) 
      }
      else if(field === 'descHeight'){
        updateRowsDetailEvent(field, 45, key)
        let cHeight = [...textAreaDescHeight]
        cHeight[key] = 45
         settextAreaDescHeight([...cHeight]) 
      }
    }

    const onAppChanged = (e) => {
      setApp(e.value);
      const moduleL = dsApps.find(v => v.id === e.value);
      if(moduleL && moduleL.hasOwnProperty('modules')){
        // if(ModuleDisabled) setModuleDisabled(false);
        setModuleList([...moduleL.modules]);
      }
    }
    const addRowsDetail = () => {
      let newRow = { 
        id: 0,
        row: isEmpty(rowsDetail) ? 0 :  (rowsDetail[rowsDetail.length - 1].row + 1), 
        moduleId:mTabActive,
        title:'', 
        titleHeight:50,
        desc:'', 
        descHeight:50, 
       }
      setrowsDetail([...rowsDetail, newRow]);
      settextAreaTitleHeight([...textAreaTitleHeight, 45])
      settextAreaDescHeight([...textAreaDescHeight, 45])
      setModule([...module, mTabActive])
    }

    const removeRowsDetail = (key) => {
      let array = [...rowsDetail];
      array.splice(key, 1);
      array.forEach((a, i) => { a.row = i })
      setrowsDetail([...array])

      let cmodule = [...module]
      cmodule.splice(key, 1);
      setModule([...cmodule]) 

      let ctitle = [...title]
      ctitle.splice(key, 1);
      settitle([...ctitle]) 

      let cdesc = [...desc]
      cdesc.splice(key, 1);
      setdesc([...cdesc])

      let titleHeight = [...textAreaTitleHeight]
      titleHeight.splice(key, 1);
      settextAreaTitleHeight([...titleHeight]) 

      let descHeight = [...textAreaDescHeight]
      descHeight.splice(key, 1);
      settextAreaDescHeight([...descHeight]) 
    }

    const onFaqSubmit = () => {
        let requestData = [];
        rowsDetail.forEach(el => {
            let d = {id: el.id, question: el.title, desc: el.desc }
            requestData.push(d);
        });
        let dataSubmit = {
            app: parseInt(app),
            user: parseInt(activeUser.id),
            module: parseInt(mTabActive),
            request: JSON.stringify(requestData),
        }
        dispatch(updateFaq(dataSubmit, app))
    }

    return (
        <>
             <Modal isOpen={showModalEdit} backdrop={'static'} role="dialog" autoFocus={true} centered={true} size={'xl'} className="editFaqModal" tabIndex="-1" toggle={() => { dispatch(toggleModalEditFaq(!showModalEdit)) }} >
                <div className="modal-content">
                  <ModalHeader toggle={() => { dispatch(toggleModalEditFaq(!showModalEdit)) }} > Edit FAQ </ModalHeader>
                  <ModalBody style={{paddingBottom:'0.25rem', marginBottom:'30px'}}>
                    <form>
                      <Row className="mb-4">
                        <Col lg="3" >
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
                              onValueChanged={onAppChanged} 
                               readOnly={true}
                             >
                              <DropDownOptions showTitle={false} />
                              <Validator ref={refValidApp}>
                                      <RequiredRule message="App is required" />
                              </Validator>
                            </SelectBox>
                          
                         }
                       </Col>
                      </Row>
                      {
                        map(rowsDetail, (row, key) => {
                          return(
                            <Row key={`_FAQ_ROW_DETAIL${key}`} className="mb-2" >
                              <Col lg="2" sm="2"  >
                                  <SelectBox dataSource={ModuleList}  
                                      placeholder={modulePlaceHolder} 
                                      showClearButton={true} 
                                      stylingMode="outlined" 
                                      value={ module[key]} 
                                      displayExpr={"name"} 
                                      valueExpr={"id"}  
                                      onValueChanged={(e) => onModuleChanged(e, key)}
                                      readOnly={true}
                                  >
                                    <DropDownOptions showTitle={false} />
                                    <Validator ref={refValidModule}>
                                            <RequiredRule message="Module is required" />
                                    </Validator>
                                  </SelectBox>
                              </Col>
                              <Col lg="4" sm="4" className="no-paddinglr">
                                  <TextArea
                                    placeholder="Title"
                                    height={textAreaTitleHeight[key]}
                                    value={title[key]}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    onValueChanged={(e)=>{ onTitleChange(e, key) }}
                                    onFocusIn={(e) => onFocuseInTextArea(e, 'titleHeight', key)}
                                    onFocusOut={(e) =>  onFocuseOutTextArea(e, 'titleHeight', key)}
                                  >
                                    <Validator ref={refValidTitle}>
                                            <RequiredRule message="Title is required" />
                                    </Validator>
                                  </TextArea>
                              </Col>
                              <Col lg="5" sm="5" style={{paddingRight:'0px'}} >
                                 <TextArea
                                    placeholder="Description"
                                    height={textAreaDescHeight[key]}
                                    value={desc[key]}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    onValueChanged={(e)=>{  onDescChange(e, key) }}
                                    onFocusIn={(e) =>  onFocuseInTextArea(e, 'descHeight', key)}
                                    onFocusOut={(e) =>  onFocuseOutTextArea(e, 'descHeight',key)}
                                  />
                              </Col>
                              <Col lg="1" sm="1" className="d-flex justify-content-center no-paddinglr">
                                  <DxButton
                                      hint="delete row"
                                      icon= {'trash'}
                                      type="danger"
                                      stylingMode="outlined" 
                                      className="align-self-center"
                                      onClick={() => {  removeRowsDetail(key) }}
                                      //visible={rowsDetail.length > 1}
                                      style={ { borderRadius:'50%', border:'hidden' } }
                                  />
                              </Col>
                            </Row>
                          )
                        })
                      }
                      <Row>
                        <Col className="d-flex justify-content-start"> 
                          <DxButton
                              hint="Add"
                              text = "Add"
                              icon= {'plus'}
                              type="danger"
                              style={ { marginLeft:'5px' } }
                              onClick={() => {  addRowsDetail() }}
                          />
                        </Col>
                      </Row>
                    </form>
                  </ModalBody>
                  <ModalFooter style={{paddingTop:'0.25rem', paddingBottom:'0.25rem'}}>
                    <Button type="button" color="secondary" onClick={() => { dispatch(toggleModalEditFaq(!showModalEdit)) }} >
                      Close
                    </Button>
                    <Button type="button" color="primary" onClick={() => { onFaqSubmit() } }  >
                      Submit <i className="fab fa-telegram-plane ms-1"></i>
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>  
              <LoadPanel
                  shadingColor="rgba(0,0,0,0.4)"
                  position={loadingEditPosition}
                  visible={showEditLoadPanel}
                  showIndicator={true}
                  shading={true}
                  showPane={true}
                  closeOnOutsideClick={false}
              />
        </>
    )
}

export default React.memo(EditFaqModal)
