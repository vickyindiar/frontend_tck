import React, {useState, useEffect, useRef, useCallback, createRef } from 'react'
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap"
import FileUploader from 'devextreme-react/file-uploader'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, EmailRule } from 'devextreme-react/validator' 
import { Lookup, DropDownOptions } from 'devextreme-react/lookup'
import { useDispatch, useSelector } from "react-redux"
import { getApps } from '../../store/misc/actions'
import { postCLogs, toggleModalCreateCLog, getlatestVerApp } from '../../store/actions'
import SelectBox from 'devextreme-react/select-box'
import { LoadPanel } from 'devextreme-react/load-panel'
import isEmpty from '../../helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { map } from 'lodash'
import { Button as  DxButton } from 'devextreme-react/button'
import TextArea from 'devextreme-react/text-area';
import { RESET_CLOG_STATE } from 'store/clog/actionTypes'


const loadingCreatePosition = { of: '.modal' };

function CreateCLogModal() {
    const dsApps = useSelector(state => state.misc.allApps)
    const dscLogType = useSelector(state => state.clog.cLogType) 
    const lastVersion = useSelector(state => state.clog.lastVersionApp) 
    const activeUser = useSelector(state => state.Login.user)
    const showModal = useSelector(state => state.clog.modalCreateCLog)
    const showCreateLoadPanel = useSelector(state => state.clog.loadingCreate)
    const errText = useSelector(state => state.clog.errText)
    const errType = useSelector(state => state.clog.errType)
    const [version, setversion] = useState('')
    const [app, setApp] = useState('')
    const [appPlaceholder, setappPlaceholder] = useState('Select Application')
    const [cLogType, setcLogType] = useState([''])
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [module, setModule] = useState(['']) 
    const [title, settitle] = useState(['']) 
    const [desc, setdesc] = useState(['']) 
    const [ModuleList, setModuleList] = useState(null)
    const [imgDetail, setimgDetail] = useState([[]])
    const [ModuleDisabled, setModuleDisabled] = useState(true)
    const [rowsDetail, setrowsDetail] = useState([ 
        { row: 0, cLogTypeId:'',  moduleId:'', title:'', titleHeight:45, desc:'', descHeight:45, imageName:[] } 
    ])
    const [textAreaTitleHeight, settextAreaTitleHeight] = useState([50])
    const [textAreaDescHeight, settextAreaDescHeight] = useState([50])
    const refUploaderCLog = useRef([])
    const refValidApp = useRef(null)
    const refValidVersion = useRef(null)
    const refValidModule = useRef(null)
    const refValidTitle = useRef(null)
    const refValidType = useRef(null)
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
                dispatch({type: RESET_CLOG_STATE, payload: { error:{}, errText:'', errType:'' } });  
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


    const updateRowsDetailEvent = (field, value,  key) => {
      let array = [...rowsDetail];
      let array2 = array.map(a => {return {...a}})
      array2.find(a => a.row === key)[field] = value;
      setrowsDetail([...array2])
    }

    const onCLogTypeChanged = (e, key ) => {
      updateRowsDetailEvent('cLogTypeId', e.value, key)
      let clogtype =[...cLogType]
      clogtype[key] = e.value
       setcLogType([...clogtype]) 
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
    
    const onUploadValueChanged = (e, key) => {
      let val = []
      e.value.forEach(v => { val.push(v.name) })
      updateRowsDetailEvent('imageName', val, key)
      let cimg = [...imgDetail]
      cimg[key] = [...e.value]
      setimgDetail([...cimg])
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
        if(ModuleDisabled) setModuleDisabled(false);
        setModuleList([...moduleL.modules]);
      }
      dispatch(getlatestVerApp(e.value))
    }
    const addRowsDetail = () => {
      let newRow = { 
        row: (rowsDetail[rowsDetail.length - 1].row + 1), 
        cLogTypeId: '',
        moduleId:'',
        title:'', 
        titleHeight:50,
        desc:'', 
        descHeight:50, 
        imageName:[]
       }
      setrowsDetail([...rowsDetail, newRow]);
      settextAreaTitleHeight([...textAreaTitleHeight, 45])
      settextAreaDescHeight([...textAreaDescHeight, 45])
    }

    const removeRowsDetail = (key) => {
      let array = [...rowsDetail];
      array.splice(key, 1);
      array.forEach((a, i) => { a.row = i })
      setrowsDetail([...array])

      let ctype = [...cLogType]
      ctype.splice(key, 1);
      setcLogType([...ctype]) 

      let cmodule = [...module]
      cmodule.splice(key, 1);
      setModule([...cmodule]) 

      let ctitle = [...title]
      ctitle.splice(key, 1);
      settitle([...ctitle]) 

      let cdesc = [...desc]
      cdesc.splice(key, 1);
      setdesc([...cdesc])

      let cimg = [...imgDetail]
      cimg.splice(key, 1);
      setimgDetail([...cimg])

      let titleHeight = [...textAreaTitleHeight]
      titleHeight.splice(key, 1);
      settextAreaTitleHeight([...titleHeight]) 

      let descHeight = [...textAreaDescHeight]
      descHeight.splice(key, 1);
      settextAreaDescHeight([...descHeight]) 
    }

  
    const onBtnUploadImage = useCallback( (key) => {
      let el = null;
        if( refUploaderCLog.current[key] ){
          el = refUploaderCLog.current[key].instance.element();
          el = el.getElementsByClassName('dx-fileuploader-button');
          if(el.length > 0){ el[0].click(); }
        }
    }, [] );

    const onCLogSubmit = () => {
        let isError = false
        let errorText = ''
        let errorRowIndex = -1
        const validateInput = () => {
          if(isEmpty(app)){ isError = true;  errorText = `Field APP  is empty`; }
          else if(isEmpty(version)){ isError = true;  errorText = `Field VERSION  is empty`; } 
          rowsDetail.forEach((f, i) =>{
              if(isEmpty(f.cLogTypeId)){  isError = true; errorRowIndex= f.row + 1; errorText = `Field TYPE in Row ${(f.row+1)} is empty`;   } 
              else if(isEmpty(f.moduleId)){  isError = true; errorRowIndex= f.row + 1; errorText = `Field MODULE in Row ${(f.row+1)} is empty`; } 
              else if(isEmpty(title)){ {  isError = true; errorRowIndex= f.row + 1; errorText = `Field TITLE in Row ${(f.row+1)} is empty`;  } }
              if(isError) return isError;  
          })
          return isError;
        }
        if(!validateInput()){
          let fileUpload = [];
          imgDetail.forEach(refN => {
            refN.forEach(item => { fileUpload.push(item) });
          });
          let dataSubmit = {
              AppId: app,
              UserId: activeUser.id,
              Version: version,
              CLogDetails: JSON.stringify(rowsDetail),
              medias:fileUpload
          }
          dispatch(postCLogs(dataSubmit))
        }
        else{
          toastr.error(errorText, " ")
        }
    }

    return (
        <>
             <Modal isOpen={showModal} backdrop={'static'} role="dialog" autoFocus={true} centered={true} size={'xl'} className="createCLogModal" tabIndex="-1" toggle={() => { dispatch(toggleModalCreateCLog(!showModal)) }} >
                <div className="modal-content">
                  <ModalHeader toggle={() => { dispatch(toggleModalCreateCLog(!showModal)) }} > New Changelog </ModalHeader>
                  <ModalBody style={{paddingBottom:'0.25rem', marginBottom:'30px'}}>
                    <form>
                      <Row className="mb-4">
                        <Col lg="3" >
                          {
                            dsApps.length > 0 && 
                            <SelectBox 
                              dataSource={dsApps} 
                             // placeholder={appPlaceholder}
                              label={appPlaceholder}
                              labelMode={'floating'}
                              showClearButton={true} 
                              stylingMode="outlined" 
                              value={app} 
                              displayExpr={"name"} 
                              valueExpr={"id"} 
                              onValueChanged={onAppChanged} 
                             >
                              <DropDownOptions showTitle={false} />
                              <Validator ref={refValidApp}>
                                      <RequiredRule message="App is required" />
                              </Validator>
                            </SelectBox>
                          
                         }
                       </Col>
                        <Col lg="5" className="d-flex justify-content-start no-paddinglr">
                           <TextBox 
                              name="version"
                              value={version}
                              showClearButton={true}
                              stylingMode='outlined'
                             // placeholder="Version"
                              label={'Version'}
                              labelMode={'floating'}
                              valueChangeEvent="keyup"
                              width='50%'
                              onValueChanged={(e) => setversion(e.value)} >
                                  <Validator ref={refValidVersion}>
                                    <RequiredRule message="Version is required" />
                                </Validator>
                            </TextBox>
                            <DxButton
                                hint= {lastVersion ? `Last Version ${lastVersion}` : ''}
                                text = {lastVersion ? `Last Version ${lastVersion}` : ''}
                                icon= {'fas fa-info-circle'}
                                type="normal"
                                stylingMode="outlined"
                                className="align-self-center"
                                style={ { marginLeft:'5px', fontSize:'10px', padding:'0px',  border:'hidden'} }
                            />
                        </Col>
                     
                      </Row>
                      {
                        map(rowsDetail, (row, key) => {
                          return(
                            
                            <Row key={`_CLOG_ROW_DETAIL${key}`} className="mb-2" >
                              <Col lg="2" sm="2" className="no-marginlr" style={{paddingRight:'0px'}}>
                                <SelectBox 
                                    dataSource={dscLogType}  
                                   // placeholder={"Select Type"} 
                                    showClearButton={false} 
                                    stylingMode="outlined" 
                                    label={'Select Type'}
                                    labelMode={'floating'}
                                    value={ cLogType[key]} 
                                    displayExpr={"name"} 
                                    valueExpr={"id"}  
                                    onValueChanged={(e) => onCLogTypeChanged(e, key)}
                                     >
                                    <DropDownOptions showTitle={false} />
                                    <Validator ref={refValidType}>
                                            <RequiredRule message="Type is required" />
                                    </Validator>
                                  </SelectBox>
                              </Col>
                              <Col lg="2" sm="2"  >
                                <SelectBox dataSource={ModuleList}  
                                  //  placeholder={modulePlaceHolder} 
                                    showClearButton={true} 
                                    stylingMode="outlined" 
                                    label={modulePlaceHolder}
                                    labelMode={'floating'}
                                    value={ module[key]} 
                                    displayExpr={"name"} 
                                    valueExpr={"id"}  
                                    onValueChanged={(e) => onModuleChanged(e, key)}
                                    disabled={ModuleDisabled} >
                                    <DropDownOptions showTitle={false} />
                                    <Validator ref={refValidModule}>
                                            <RequiredRule message="Module is required" />
                                    </Validator>
                                  </SelectBox>
                              </Col>
                              <Col lg="3" sm="3" className="no-paddinglr">
                                  <TextArea
                                   // placeholder="Title"
                                    height={textAreaTitleHeight[key]}
                                    value={title[key]}
                                    valueChangeEvent={'keyup'}
                                    label={'Title'}
                                    labelMode={'floating'}
                                    stylingMode="outlined"
                                    onValueChanged={(e)=>{ onTitleChange(e, key) }}
                                    onFocusIn={(e) => onFocuseInTextArea(e, 'titleHeight', key)}
                                    onFocusOut={(e) => onFocuseOutTextArea(e, 'titleHeight', key)}
                                  >
                                    <Validator ref={refValidTitle}>
                                            <RequiredRule message="Title is required" />
                                    </Validator>
                                  </TextArea>
                              </Col>
                              <Col lg="3" sm="3" style={{paddingRight:'0px'}} >
                                 <TextArea
                                   // placeholder="Description"
                                    height={textAreaDescHeight[key]}
                                    value={desc[key]}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    label={'Description'}
                                    labelMode={'floating'}
                                    onValueChanged={(e)=>{  onDescChange(e, key) }}
                                    onFocusIn={(e) =>  onFocuseInTextArea(e, 'descHeight', key)}
                                    onFocusOut={(e) =>  onFocuseOutTextArea(e, 'descHeight',key)}
                                  />
                              </Col>
                              <Col lg="2" sm="2" className="d-flex justify-content-center no-paddinglr">
                                <FileUploader 
                                  ref={el => (refUploaderCLog.current[key] = el)}
                                  multiple={true} 
                                  selectButtonText="uploadImg" 
                                  labelText="" 
                                  accept="image/jpeg, image/png" 
                                  uploadMode="useForm" 
                                  maxFileSize={1000000}
                                  invalidMaxFileSizeMessage={"Maximum file size 1mb"}
                                  onValueChanged = { (e) => { onUploadValueChanged(e, key)} }
                                  showClearButton={true}
                                  visible = {false}
                                />
                                  <DxButton 
                                    hint="Upload Image" 
                                    text = { imgDetail[key] && imgDetail[key].length > 0 ? `Image (${imgDetail[key].length })` : 'Image'} 
                                    icon= {'image'} 
                                    height='50'
                                    type="normal" 
                                    onClick={() => {  onBtnUploadImage(key) }} />
                                  <DxButton
                                      hint="delete row"
                                      icon= {'trash'}
                                      type="danger"
                                      stylingMode="outlined" 
                                      className="align-self-center"
                                      onClick={() => {  removeRowsDetail(key) }}
                                      visible={rowsDetail.length > 1}
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
                    <Button type="button" color="secondary" onClick={() => { dispatch(toggleModalCreateCLog(!showModal)) }} >
                      Close
                    </Button>
                    <Button type="button" color="primary" onClick={() => { onCLogSubmit() } }  >
                      Submit <i className="fab fa-telegram-plane ms-1"></i>
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>  
              <LoadPanel
                  shadingColor="rgba(0,0,0,0.4)"
                  position={loadingCreatePosition}
                  visible={showCreateLoadPanel}
                  showIndicator={true}
                  shading={true}
                  showPane={true}
                  closeOnOutsideClick={false}
              />
        </>
    )
}

export default React.memo(CreateCLogModal)
