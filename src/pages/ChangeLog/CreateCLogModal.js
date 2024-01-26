//this page has many code useless and didnt used anymore
//like change log type, change log module etc.
//suggestion from mr. farlo to make it more simple. 
//so damn lazy to refactoring code..
//soo...good luck !! :)


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
import { last, map } from 'lodash'
import { Button as  DxButton } from 'devextreme-react/button'
import TextArea from 'devextreme-react/text-area'
import { RESET_CLOG_STATE } from 'store/clog/actionTypes'
import { useLocation } from 'react-router'
import HtmlEditor, { Toolbar, Item, MediaResizing } from 'devextreme-react/html-editor'
import { CheckBox } from 'devextreme-react/check-box';
import moment from "moment"


const loadingCreatePosition = { of: '.modal' };

function CreateCLogModal() {
    const dsApps = useSelector(state => state.misc.allApps)
    const dscLogType = useSelector(state => state.clog.cLogType) 
    const lastVersion = useSelector(state => state.clog.lastVersionApp) 
    const appActive = useSelector(state => state.clog.appActive)
    const activeUser = useSelector(state => state.Login.user)
    const showModal = useSelector(state => state.clog.modalCreateCLog)
    const showCreateLoadPanel = useSelector(state => state.clog.loadingCreate)
    const ruleVersion = useSelector(state => state.clog.ruleVersion)
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
       // set cLogTypeId to 1 just for ignore not null requirement, cLogType not used actually. mr. farlo suggestion
        { row: 0, cLogTypeId:1,  moduleId:'', title:'', titleHeight:45, desc:'', descHeight:45, imageName:[] } 
    ])
    const [textAreaTitleHeight, settextAreaTitleHeight] = useState([50])
    const [textAreaDescHeight, settextAreaDescHeight] = useState([50])

    const isMobile = document.getElementById('root').clientWidth <= 575 ;
    const [replyValue, setReplyValue] = useState("")
    const htmlEditorRef = useRef(null);
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

  const [generalValue, setgeneralValue] = useState(false)

    const refUploaderCLog = useRef([])
    const refValidApp = useRef(null)
    const refValidVersion = useRef(null)
    const refValidModule = useRef(null)
    const refValidTitle = useRef(null)
    const refValidType = useRef(null)
    const location = useLocation()
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

    useEffect(() => {
     if(!isEmpty(dsApps)){
       let sApp = dsApps.find(f => location.pathname.includes(f.name.toLowerCase()));
       if(!isEmpty(sApp)){
          setApp(sApp.id)
          dispatch(getlatestVerApp(sApp.id))
       }
     }
   
    }, [dsApps])


    const getNextVersion = () => {
        const isBeforeNow = (lastVersion, mRule,  now) => {
          var lMonth = lastVersion.substring(ruleVersion['md'].start - mRule, ruleVersion['md'].end - mRule).substring(0, 2)
          var lYear =  lastVersion.substring(ruleVersion['year'].start - mRule, ruleVersion['year'].end - mRule)
          var d1 = moment(`${lMonth}/01/${lYear}`)
          var d2 = now
          let before = d1.isBefore(d2, 'month') 
          return before;
        }

        //get current date
        let now = moment();
        let month = now.format('M').padStart(2, '0');
        let day   = now.format('D').padStart(2, '0');
        let year = new Date().getFullYear().toString().substr(-2);
        //

        let mRule = lastVersion.length < 13 ? 1 : 0
        let mayor = lastVersion.substring(ruleVersion['mayor'].start, ruleVersion['mayor'].end - mRule);
        let minor = lastVersion.substring(ruleVersion['minor'].start - mRule, ruleVersion['minor'].end - mRule);
        let md = month + day;

        //compare month between lastversion and current, true => reset increment to 1, false => inc the last version 
        let lastVInc = isBeforeNow(lastVersion, mRule, now) ?  1 :  Number(lastVersion.substring(ruleVersion['build'].start - mRule, ruleVersion['build'].end - mRule)) + 1;
        let build = lastVInc.toString().padStart(3, '0');
        let newV = mayor + minor + year + md + build;
        return newV;
    }
    const getNewVersion = () => {
      var now = moment();
      var month = now.format('M').padStart(2, '0');
      var day   = now.format('D').padStart(2, '0');
      
      let mayor = appActive.id == 2 ?  ' ' : '  ' ;
      let minor = '  ';
      let year = new Date().getFullYear().toString().substr(-2);
      let md = month + day;
      let lastVInc = 1;
      let build = lastVInc.toString().padStart(3, '0');
      let newV = mayor + minor + year + md + build;
      return newV;
  }

    useEffect(() => {
        if(isEmpty(lastVersion)){
           setversion(getNewVersion())
         }
        else{
            setversion(getNextVersion())
        }
    }, [lastVersion])


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

    const onHtmlEditorChanged = (e) => {
      setReplyValue(e.value)
    }

    
    const onAppChanged = (e) => {
      setApp(e.value);
      const moduleL = dsApps.find(v => v.id === e.value);
      if(moduleL && moduleL.hasOwnProperty('modules')){
        if(ModuleDisabled) setModuleDisabled(false);
        setModuleList([...moduleL.modules]);
      }
      if(e.value !== null){
        dispatch(getlatestVerApp(e.value))
      }
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

        const validateInput = () => {
          rowsDetail.forEach((f, i) =>{
               if(isEmpty(title)){ {  isError = true; errorRowIndex= f.row + 1; errorText = `Field TITLE in Row ${(f.row+1)} is empty`;  } }
              if(isError) return isError;  
          })
          return isError;
        }
        if(!validateInput()){
          let fileUpload = [];
          imgDetail.forEach(refN => {
            refN.forEach(item => { fileUpload.push(item) });
          });

          rowsDetail[0].desc = configImg(rowsDetail[0].desc)
          let dataSubmit = {
              UserId: activeUser.id,
              CLogDetails: JSON.stringify(rowsDetail),
              medias:fileUpload
          }
          if(!generalValue){
              dataSubmit.AppId = app;
              dataSubmit.Version= version;
          }
          dispatch(postCLogs(dataSubmit))
        }
        else{
          toastr.error(errorText, " ")
        }
    }

    const onGeneralClick = (e) => {
      if(e.value){
        setApp(null)
        setversion(null)
      }
      else{
        setApp(appActive.id)
        if(isEmpty(lastVersion)){
          setversion(getNewVersion())
        }
       else{
           setversion(getNextVersion())
       }
      }
      setgeneralValue(e.value)
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
                              //placeholder={appPlaceholder}
                              showClearButton={false} 
                              stylingMode="underlined" 
                              label={appPlaceholder}
                              labelMode={'floating'}
                              value={app} 
                              displayExpr={"name"} 
                              valueExpr={"id"} 
                              disabled ={ true }
                              onValueChanged={onAppChanged} 
                             >
                              <DropDownOptions showTitle={false} />
                            </SelectBox>
                          
                         }
                       </Col>
                        <Col lg="5" className="d-flex justify-content-start no-paddinglr">
                          {
                              appActive.id === 2 ? 
                              (
                                <TextBox 
                                  name="version"
                                  value={ version }
                                  showClearButton={true}
                                  stylingMode='underlined'
                                  //placeholder="Version"
                                  labelMode={'floating'}
                                  label={'Version'}
                                  valueChangeEvent="keyup"
                                  width='50%'
                                  mask= {"X.00.00.0000.000" }
                                  maskRules={{ X: /[0-9]/ }} 
                                  disabled ={ generalValue }
                                  onValueChanged={(e) => { setversion(e.value) } } 
                                />
                              )
                              :
                              (
                                <TextBox 
                                    name="version"
                                    value={ version }
                                    showClearButton={true}
                                    stylingMode='underlined'
                                    //placeholder="Version"
                                    labelMode={'floating'}
                                    label={'Version'}
                                    valueChangeEvent="keyup"
                                    width='50%'
                                    mask= {"X0.00.00.0000.000" }
                                    maskRules={{ X: /[0-9]/ }} 
                                    disabled ={ generalValue }
                                    onValueChanged={(e) => { setversion(e.value) } } 
                                /> 
                              )
                          }
                            <CheckBox value={generalValue} onValueChanged={onGeneralClick} style={{marginLeft:'10px'}} text='General' />
                    
                        </Col>
                        <Col lg="3" className="no-paddinglr d-flex justify-content-start">
                        
                        </Col>
                      </Row>
                      {
                        map(rowsDetail, (row, key) => {
                          return(
                            <div key={`_CLOG_ROW_DETAIL${key}`}>
                            <Row className="mb-2" >
                              {/* <Col lg="2" sm="2">
                                <SelectBox 
                                    dataSource={dscLogType}  
                                   // placeholder={"Select Type"} 
                                    stylingMode="outlined" 
                                    labelMode={'floating'}
                                    label={'Select Type'}
                                    showClearButton={false} 
                                    stylingMode="outlined" 
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
                              </Col> */}
                              <Col lg="12" sm="12">
                                  <TextArea
                                   // placeholder="Title"
                                    stylingMode="outlined" 
                                    labelMode={'floating'}
                                    label='Title'
                                    height={textAreaTitleHeight[key]}
                                    value={title[key]}
                                    valueChangeEvent={'keyup'}
                                    onValueChanged={(e)=>{ onTitleChange(e, key) }}
                                    onFocusIn={(e) => onFocuseInTextArea(e, 'titleHeight', key)}
                                    onFocusOut={(e) =>  onFocuseOutTextArea(e, 'titleHeight', key)}
                                  >
                                    <Validator ref={refValidTitle}>
                                            <RequiredRule message="Title is required" />
                                    </Validator>
                                  </TextArea>
                              </Col>
                    
                            </Row>
                            <Row>
                              <Col lg="12" sm="12" >
                                 {/* <TextArea
                                    placeholder="Description"
                                    height={textAreaDescHeight[key]}
                                    value={desc[key]}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    onValueChanged={(e)=>{  onDescChange(e, key) }}
                                    onFocusIn={(e) =>  onFocuseInTextArea(e, 'descHeight', key)}
                                    onFocusOut={(e) =>  onFocuseOutTextArea(e, 'descHeight',key)}
                                  /> */}
                                    <HtmlEditor height={450} 
                                          ref={htmlEditorRef} 
                                          value={desc[key]} 
                                          valueType={"html"}
                                          onValueChanged={(e)=>{  onDescChange(e, key)}} 
                                          elementAttr={{id:"htmlChangeLog"}}
                                          // style={  {'border': `${msgPrivate ? '1px solid red' : '' }`} }
                                      >
                                        <MediaResizing enabled={true} />
                                      <Toolbar>
                                      {
                                          isMobile ? null :  toolsHtmlEditor.map(e => { return ( <Item name={e.name} key={`htmleditor-${e.id}`} />) })
                                      }
                                      </Toolbar>
                                    </HtmlEditor>
                              </Col>
                            </Row>
                            </div>
                          )
                        })
                      }
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
