import React, {useState, useEffect, useRef, useCallback, createRef } from 'react'
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap"
import FileUploader from 'devextreme-react/file-uploader'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, EmailRule } from 'devextreme-react/validator' 
import { Lookup, DropDownOptions } from 'devextreme-react/lookup'
import { useDispatch, useSelector } from "react-redux"
import { toggleModalEditKbase, updateKbase} from 'store/actions'
import SelectBox from 'devextreme-react/select-box'
import { LoadPanel } from 'devextreme-react/load-panel'
import isEmpty from '../../helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { last, map } from 'lodash'
import { Button as  DxButton } from 'devextreme-react/button'
import TextArea from 'devextreme-react/text-area'
import { useLocation } from 'react-router'
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor'
import moment from "moment"


const loadingEditPosition = { of: '.modal' };
const EditKBaseModal = () => {
    const dsApps = useSelector(state => state.misc.allApps)
    const appActive = useSelector(state => state.kbase.appActive)
    const moduleActive = useSelector(state => state.kbase.moduleActive)
    const activeUser = useSelector(state => state.Login.user)
    const showModal = useSelector(state => state.kbase.modalEditKbase)
    const showEditLoadPanel = useSelector(state => state.kbase.loadingEdit)
    const selectedRow = useSelector(state => state.kbase.sKbases)
    const errText = useSelector(state => state.kbase.errText)
    const errType = useSelector(state => state.kbase.errType)
    const [version, setversion] = useState('')
    const [appList, setappList] = useState([])
    const [app, setapp] = useState('')
    const [appPlaceholder, setappPlaceholder] = useState('Select Application')
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [moduleDisabled, setmoduleDisabled] = useState(false)
    const [module, setmodule] = useState(['']) 
    const [moduleList, setmoduleList] = useState('')
    const [title, settitle] = useState('') 
    const [body, setbody] = useState('') 
    const [imgDetail, setimgDetail] = useState([[]])
    const isMobile = document.getElementById('root').clientWidth <= 575 ;
    const htmlEditorRef = useRef(null);
    const fileUpRef = useRef(null);  

    const [toolsHtmlEditor] = useState([
      {id:1, name:'undo' },
      {id:2, name:'redo' },
      {id:3, name:'separator' },
      {id:4, name:'bold' },
      {id:5, name:'italic' },
      {id:6, name:'strike' },
      {id:7, name:'underline' },
      {id:8, name:'separator' },
      {id:9, name:'alignLeft' },
      {id:10, name:'alignCenter' },
      {id:11, name:'alignRight' },
      {id:12, name:'alignJustify' },
      {id:13, name:'separator' },
      {id:14, name:'color' },
      {id:15, name:'background' },
      {id:16, name:'separator' },
      {id:17, name:'orderedList'},
      {id:18, name:'bulletList'}
    ])
    const refValidTitle = useRef(null);
    const dispatch = useDispatch()


    const onAppChanged = (e) => {       
        setmodule('');
        setapp(e.value);
        const moduleL = dsApps.find(v => v.id === e.value);
        let nModule = [{ appId: '', desc: "", id: '', name: "All" }]
        if(moduleL && moduleL.hasOwnProperty('modules')){
          if(moduleDisabled) setmoduleDisabled(false);
          setmoduleList([...moduleL.modules, ...nModule]);
        }
        else{
            setmoduleList([...nModule]);
        }
    }

    const onKBaseSubmit = () =>{
          function configImg (strComment){
              var el = document.createElement('DIV');
              el.innerHTML = strComment
              var imgs = el.getElementsByTagName('img')
              for (let i = 0; i < imgs.length; i++) {
              //  imgs[i].src = resizeImage(imgs[i].src)
                imgs[i].alt = (Math.random() + 1).toString(36).substring(7);
                imgs[i].classList.add('img-thumbnail')
                imgs[i].classList.add('img-fluid')
                imgs[i].classList.add('img-cursor-pointer')
              }
             let outer =  el.outerHTML;
             return outer
          }
          let fileUpload = [];
     
          if( refValidTitle ){
            fileUpRef.current.instance._files.forEach(item => {
                  if(item.isValidFileExtension && item.isValidMaxSize){
                    fileUpload.push(item.value)
                  }
              });
         
              let dataSubmit = {
                Id: selectedRow.id,
                AppId: app,
                ModuleId:module,
                Title:title,
                UserId: activeUser.id,
                Body: configImg(body),
                medias: fileUpload
              }
              dispatch(updateKbase(dataSubmit, appActive, moduleActive))
          }
    }
    
    useEffect(() => {
        if(!isEmpty(dsApps)){
         let nApp = [{ desc: "", id: '', name: "All" }]
         setappList([...dsApps, ...nApp ])

         let nModule = [{ appId: '', desc: '', id: '', name: "All" }]
         setmoduleList([...nModule])
        }
     }, [dsApps])

     useEffect(()=>{
      if(!isEmpty(selectedRow)){
          setapp(selectedRow.apps.id)
          if(selectedRow.apps.id !== ''){
            const moduleL = dsApps.find(v => v.id === selectedRow.apps.id);
            if(moduleL && moduleL.hasOwnProperty('modules')){
              setmoduleList([...moduleL.modules]);
            }
          }
          setmodule(selectedRow.modules.id)
          settitle(selectedRow.title)
          setbody(selectedRow.body)
      }
     }, [selectedRow])


    return (
        <>
               <Modal isOpen={showModal} backdrop={'static'} role="dialog" autoFocus={true} centered={true} size={'xl'} className="createKBaseModal" tabIndex="-1" toggle={() => { dispatch(toggleModalEditKbase(!showModal)) }} >
                <div className="modal-content">
                  <ModalHeader toggle={() => { dispatch(toggleModalEditKbase(!showModal)) }} > New Knowledge Base </ModalHeader>
                  <ModalBody style={{paddingBottom:'0.25rem', marginBottom:'30px'}}>
                    <form>
                      <Row className="mb-4">
                        <Col lg="3" >
                          {
                            dsApps.length > 0 && 
                            <SelectBox 
                              dataSource={appList} 
                              showClearButton={false} 
                              stylingMode="underlined" 
                              label={appPlaceholder}
                              labelMode={'floating'}
                              value={app} 
                              displayExpr={"name"} 
                              valueExpr={"id"} 
                              disabled ={ false }
                              onValueChanged={onAppChanged} 
                             >
                              <DropDownOptions showTitle={false} />
                            </SelectBox>
                         }
                       </Col>
                       <Col lg="3">
                          <SelectBox 
                            dataSource={moduleList}  
                            showClearButton={true} 
                            stylingMode='underlined' 
                            label={modulePlaceHolder}
                            labelMode='floating'
                            value={module} 
                            displayExpr={"name"} 
                            valueExpr={"id"}  
                            onValueChanged={ (e) => { setmodule(e.value) }}
                            //   disabled={moduleDisabled } 
                          >
                            <DropDownOptions showTitle={false} />
                          </SelectBox>
                        </Col>
                      </Row>
                      <Row className="mb-2" >
                            <Col lg="12" sm="12">
                                <TextArea
                                    stylingMode="outlined" 
                                    labelMode={'floating'}
                                    label='Title'
                                    value={title}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    onValueChanged={(e)=>{ settitle(e.value) }}
                                    onFocusIn={(e) => {}}
                                    onFocusOut={(e) =>{} }
                                >
                                <Validator ref={refValidTitle}>
                                        <RequiredRule message="Title is required" />
                                </Validator>
                                </TextArea>
                            </Col>
                
                        </Row>
                        <Row>
                            <Col lg="12" sm="12" >
                                <HtmlEditor height={450} 
                                        ref={htmlEditorRef} 
                                        value={body} 
                                        valueType={"html"}
                                        onValueChanged={(e)=>{ setbody(e.value) }} 
                                        elementAttr={{id:"htmlChangeLog"}}
                                    >
                                    <Toolbar>
                                    {
                                        isMobile ? null :  toolsHtmlEditor.map(e => { return ( <Item name={e.name} key={`htmleditor-${e.id}`} />) })
                                    }
                                    </Toolbar>
                                </HtmlEditor>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FileUploader 
                                    ref={fileUpRef}
                                    multiple={true} 
                                    selectButtonText="Attachment" 
                                //  value={fileUploaded}
                                    labelText="" 
                                    accept="image/jpeg,
                                            image/png,
                                            application/pdf,
                                            application/msword,
                                            application/vnd.ms-excel,
                                            application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                                    uploadMode="useForm" 
                                    maxFileSize={5000000}
                                    invalidMaxFileSizeMessage={"Maximum file size 5mb"}
                                    // onValueChanged = { onUploadValueChanged }
                                    showClearButton={true}
                                />
                            </Col>
                        </Row>
                    </form>
                  </ModalBody>
                  <ModalFooter style={{paddingTop:'0.25rem', paddingBottom:'0.25rem'}}>
                    <Button type="button" color="secondary" onClick={() => { dispatch(toggleModalEditKbase(!showModal)) }} >
                      Close
                    </Button>
                    <Button type="button" color="primary" onClick={() => { onKBaseSubmit() } }  >
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

export default React.memo(EditKBaseModal)
