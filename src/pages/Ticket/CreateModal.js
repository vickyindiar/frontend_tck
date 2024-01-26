import React, {useState, useEffect, useRef} from 'react'
import { Button,  Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap"
import HtmlEditor, { Toolbar, Item, MediaResizing } from 'devextreme-react/html-editor'
import FileUploader from 'devextreme-react/file-uploader'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, EmailRule, CustomRule } from 'devextreme-react/validator' 
import { Autocomplete } from 'devextreme-react/autocomplete'
import { Lookup, DropDownOptions } from 'devextreme-react/lookup'
import { useDispatch, useSelector } from "react-redux"
import { createTickets, toggleModalCreate, getSenders, getApps, getPriority, getGroupAgency } from '../../store/actions'
import SelectBox from 'devextreme-react/select-box'
import { LoadPanel } from 'devextreme-react/load-panel'
import isEmpty from '../../helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { RESET_TICKET_STATE, TICKET_ERROR_TYPE } from 'store/tickets/actionTypes'
import { toLower } from 'lodash'
import { confirm } from 'devextreme/ui/dialog'
import {  Link } from 'react-router-dom'
import Compressor from "compressorjs";




const toolsHtmlEditor = [
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
  {id:15, name:'background' }
]

const typeTicketList = [
  {value:"I", text:"Internal"},
  {value:"E", text:"External"}
]

const loadinCretePosition = { of: '.modal' };

function CreateModal() {
    const dsSenders = useSelector(state => state.users.allSenders)
    const dsApps = useSelector(state => state.misc.allApps)
    const dsPriority = useSelector(state => state.tickets.dsPriority)
    const dsGroupAgencies = useSelector(state => state.agency.dsGroupAgencies)
    const dsAgencies = useSelector(state => state.agency.dsAgencies)
  
    const activeUser = useSelector(state => state.Login.user)
    const showModal = useSelector(state => state.tickets.showModalCreateTicket)
    const showCreateLoadPanel = useSelector(state => state.tickets.loadingCreate)
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
    const dbList = useSelector(state => state.tickets.dbList)

    const errText = useSelector(state => state.tickets.errText)
    const errType = useSelector(state => state.tickets.errType)
    const [valueContent, setValueContent] = useState('')
    const [ticketType, setticketType] = useState(null)
    const [priorityType, setpriorityType] = useState(null)
    const [visiblePriority, setvisiblePriority] = useState(true)
    const [enhanceType, setenhanceType] = useState(null)
    const [email, setEmail] = useState('')
    const [firstName, setFirtsName] = useState('')
    const [lastName, setlastName] = useState('')
    const [subject, setSubject] = useState('')
    const [app, setApp] = useState('')
    const [appPlaceholder, setappPlaceholder] = useState('Select Application')
    const [module, setModule] = useState('')
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [ModuleDisabled, setModuleDisabled] = useState(true);
    const [ModuleList, setModuleList] = useState(null)

    const [groupAgency, setgroupAgency] = useState(null)
    const [dsFGroupAgency, setdsFGroupAgency] = useState([])
    const [agency, setagency] = useState(null)
    const [dsFAgency, setdsFAgency] = useState([])
    
    const [fileUploaded, setfileUploaded] = useState([])

    const [hasDraf, setHasDraf] = useState(false)
    const [fromDraf, setFromDraf] = useState(false)
    const [showHeaderForm, setShowHeaderForm] = useState(true)
    const [btnExpandHtmlEditor, setBtnExpandHtmlEditor] = useState('Collapse')

    const thisFileUploader = useRef(null);  
    const refValidEmail = useRef(null);
    const refValidPriority = useRef(null);
    const refValidfName = useRef(null);
    const refValidlName = useRef(null);
    const refValidApp = useRef(null);
    const refValidModule = useRef(null);
    const refValidSubject = useRef(null);
    const refValidContent = useRef(null);
    const refValidAgency = useRef(null);
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
                dispatch({type: RESET_TICKET_STATE, payload: { error:{}, errText:'', errType:'' } });  
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

    useEffect(() =>{
      let drafValue = localStorage.getItem('draf_ticket')
      if(!isEmpty(drafValue)){
        setHasDraf(true)
      }
    })

    useEffect(() => {
      if(errText !== "" && errType === TICKET_ERROR_TYPE.CREATE_TICKET ){
          showToastError(errText)
      }
    }, [errText])

    useEffect(() => {
      dispatch(getApps()) 
      dispatch(getPriority())
    }, [])

    useEffect(() => {
      if(!isEmpty(dsGroupAgencies)){ setdsFGroupAgency(dsGroupAgencies)}
      if(!isEmpty(dsAgencies)){ setdsFAgency(dsAgencies)}
    }, [dsGroupAgencies, dsAgencies])

    const onHtmlEditorChanged = (e) => { 
      setValueContent(e.value)
    }

    const onTypeChange = (e) => {
      setticketType(e.value);
      if(e.value === "I"){
        setEmail(activeUser.email);
        dispatch(getApps()) 
        setFirtsName(activeUser.firstName);
        setlastName(activeUser.lastName);
      }
      else if(e.value === "E"){
        dispatch(getSenders())
        dispatch(getGroupAgency())
        setEmail("");
        setFirtsName("");
        setlastName("");
      }
      else if(e.value === null){
        setEmail("");
        setFirtsName("");
        setlastName("");
      }
    }

    const onEmailChanged = (e) => {
      setEmail(e.value)
      let f = dsSenders.find(v => v.email === e.value);
      if(f){
       if(firstName !== f.firstName) setFirtsName(f.firstName)
       if(lastName !== f.lastName)  setlastName(f.lastName)
      }
    }
    
    const onFirstNameChanged = (e) => {
      setFirtsName(e.value)
      let f = dsSenders.find(v => v.firstName === e.value);
      if(f){
       if(email !== f.email) setEmail(f.email)
       if(lastName !== f.lastName) setlastName(f.lastName)
      }
    }

    const onAppChanged = (e) => {
      setModule(null);
      setApp(e.value);
      const moduleL = dsApps.find(v => v.id === e.value);
      if(moduleL && moduleL.hasOwnProperty('modules')){
        if(ModuleDisabled) setModuleDisabled(false);
        setModuleList([...moduleL.modules]);
      }
    }

    const onModuleChanged = (e) => {
       setModule(e.value) 
    }

    const onPriorityChange = (e) => {
      setpriorityType(e.value)
    }
  
    const renderEmailAutoComplate = (data) => {
      return  <span>{data.firstName +' '+data.lastName } ({data.email})</span>;
    }

    const onUploadValueChanged = (e) => {
      // let verifiedSize = [];
      // if(e.previousValue.length > 1) { verifiedSize = [...verifiedSize]}
      // else if(e.previousValue.length === 1)  { verifiedSize.push(e.previousValue[0]) }

      // if(e.value.length > 1){
      //   e.value.forEach(f => {
      //     if(f.size < 2000000) verifiedSize.push(f);
      //   })
      // }
      // else{
      //   if(e.value[0].size < 2000000) verifiedSize.push(e.value[0]);
      // }
      // setfileUploaded(verifiedSize);
      // var values = e.component.option("values");  
      // $.each(values, function (index, value) {  
      //     e.element.find(".dx-fileuploader-upload-button").hide();  
      // });  
      // e.element.find(".dx-fileuploader-upload-button").hide();  
    }

    const onTicketSubmit = async () => {

      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

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

      async function compressImg(strComment){
        const doCompressImage = async (img) => {
          try 
          {
            const compressedBlob = (img) => { return new Promise((resolve, reject) => {
              new Compressor(img, {
                  strict: true,
                  checkOrientation: true,
                  quality: 0.7, // Adjust the desired image quality (0.0 - 1.0)
                  //maxWidth: 800, // Adjust the maximum width of the compressed image
                  //maxHeight: 800, // Adjust the maximum height of the compressed image
                  mimeType: "image/jpeg", // Specify the output image format
                  convertTypes: 'image/png,image/webp', // file dengan type ini akan di convert ke jpeg
                  convertSize: '1200000', //jika file nya melebihi 1.2 mb akan di convert 
                  success(result) {
                    resolve(result);
                  },
                  error(error) {
                    reject(error);
                  },
                });
              });
            }
            let compressedimg = await compressedBlob(img)
            return compressedimg
          } catch (error) {
            console.error(error);
          }
        }
        
        function dataURLtoFile(dataurl, filename) { //BASE64 TO FILE
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)[1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], filename, { type: mime })
        }

        function getBase64(file) { //FILE TO BASE64
          return new Promise((resolve, reject) => { 
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        }

        var el = document.createElement('DIV');
        el.innerHTML = strComment
        var imgs = el.getElementsByTagName('img')
        
        for (const img of imgs) {
          let f = dataURLtoFile(img.src, img.alt) //base64 to image
          f = await doCompressImage(f) //image commpress
          f = await getBase64(f) //image to bas64
          img.src = f
        }
        let outer =  el.outerHTML;
        return outer
      }

      let fileUpload = [];
      let fNameValid = refValidfName.current.instance.validate().isValid;
      let priorityValid = refValidPriority.current.instance.validate().isValid;
      let lNameValid = refValidlName.current.instance.validate().isValid;
      let mailValid = refValidEmail.current.instance.validate().isValid;
      let appValid = refValidApp.current.instance.validate().isValid;
      let moduleValid = refValidModule.current.instance.validate().isValid;
      let subjectValid = refValidSubject.current.instance.validate().isValid;
      let contenttValid = refValidContent.current.instance.validate().isValid;

      if( priorityValid && fNameValid && lNameValid && mailValid && appValid && moduleValid && subjectValid && contenttValid  ){
          thisFileUploader.current.instance._files.forEach(item => {
              if(item.isValidFileExtension && item.isValidMaxSize){
                fileUpload.push(item.value)
              }
          });

          let dataSubmit = {
            TicketType: ticketType,
            CreatedBy: activeUser.email,
            AppId: app,
            ModuleId:module,
            PriorityId: priorityType,
            Subject:subject,
            Comment: configImg(valueContent),
            medias: fileUpload
          }

          dataSubmit.Comment = await compressImg(dataSubmit.Comment)
          if(ticketType === "I") dataSubmit.UserId = activeUser.id
          else if(ticketType === "E") {
            dataSubmit.AgencyId = agency;
            dataSubmit.GroupAgencyId = groupAgency;
            dataSubmit.Sender = JSON.stringify({  firstName: capitalizeFirstLetter(firstName), lastName: capitalizeFirstLetter(lastName), email});
          } 

          if(!isEmpty(dbList)){
            let activeYear = dbList.find(f => f.active)
            sessionStorage.setItem("_db", activeYear.value)
            sessionStorage.setItem("_dbact", activeYear.active)
          }

          localStorage.setItem('draf_ticket', JSON.stringify(dataSubmit))
          dispatch(createTickets(dataSubmit))
      }
    }

    const onClose = async() => {
        const capitalizeFirstLetter = (string) => {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
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

        let fileUpload = []
        thisFileUploader.current.instance._files.forEach(item => {
          if(item.isValidFileExtension && item.isValidMaxSize){
            fileUpload.push(item.value)
          }
        });
        let dataSubmit = {
          TicketType: ticketType,
          CreatedBy: activeUser.email,
          AppId: app,
          ModuleId:module,
          PriorityId: priorityType,
          Subject:subject,
          Comment: configImg(valueContent),
          medias: fileUpload
        }
        if(ticketType === "I") dataSubmit.UserId = activeUser.id
        else if(ticketType === "E") {
          dataSubmit.AgencyId = agency;
          dataSubmit.GroupAgencyId = groupAgency;
          dataSubmit.Sender = JSON.stringify({  firstName: capitalizeFirstLetter(firstName), lastName: capitalizeFirstLetter(lastName), email});
        } 
        if(!isEmpty(valueContent)){
          let result = await confirm("Are you sure you want to close ?", "Confirm Close");
          if(result){
            localStorage.setItem('draf_ticket', JSON.stringify(dataSubmit))
            showToastSuccess('Content has been saved in browser storage')
            dispatch(toggleModalCreate(!showModal))
          }
        }
        else{
          dispatch(toggleModalCreate(!showModal))
        }
    }

    const fethFromDaf = () =>{
        let drafValue = JSON.parse(localStorage.getItem('draf_ticket'))
        setFromDraf(true)
        setticketType(drafValue.TicketType)
        setpriorityType(drafValue.PriorityId)
        setApp(drafValue.AppId)
        setModule(drafValue.ModuleId)
        setSubject(drafValue.Subject)
        setValueContent(drafValue.Comment)
    }

    const showAgencies = () => {
      if(ticketType !== 'E' ) { return null }
      else
      return (
        <Row className="mb-3">
          <Col lg="6">
        
            <SelectBox 
              dataSource={dsGroupAgencies} 
              showClearButton={true} 
              stylingMode="outlined" 
              label='Group Agency'
              labelMode='floating'
              value={groupAgency} 
              displayExpr={"name"} 
              valueExpr={"id"} 
              onValueChanged={(e) => { 
                setgroupAgency(e.value) 
                let f = dsAgencies.filter(f => f.groupAgencyId === e.value)
                if(!isEmpty(f))
                  setdsFAgency(f);
              }} 
              disabled= {ticketType === null} >
              <DropDownOptions showTitle={false} />
            </SelectBox>
          </Col>
          <Col lg="6">
            <SelectBox 
              dataSource={dsFAgency}  
              showClearButton={true} 
              stylingMode="outlined" 
              label='Agency'
              labelMode='floating'
              value={agency} 
              displayExpr={"name"} 
              valueExpr={"id"}  
              onValueChanged={(e)=> {
                setagency(e.value) 
              }}
              disabled={(groupAgency === null) && (ticketType === 'E')} >
              <DropDownOptions showTitle={false} />
              <Validator ref={refValidAgency}>
                  <CustomRule validationCallback={(e) => {
                      if(ticketType === "E"){
                        if(isEmpty(email)){ return false}
                        if(!email.includes('@')){return false}
                        let mailAr = email.split('@');
                        let domain =  toLower(mailAr[1]);
                        let ag = dsAgencies.find(f => f.id === e.value);
                        return ag.domain.includes(domain) || domain.includes(ag.domain);
                      }
                      else{
                        return false;
                      }
             
                  }} message="This Agency does not match with the email" />
              </Validator>
            </SelectBox>
          </Col>
        </Row>
      )
    }

    const closeXBtn = (
      <button className="closeXbutton" onClick={() => { onClose() }} type="button">
        &times;
      </button>
    )
    return (
        <>
             <Modal isOpen={showModal} role="dialog" keyboard={false} autoFocus={true} centered={true} size={'lg'} className="createTikcketModal" tabIndex="-1" backdrop={'static'} toggle={() => { dispatch(toggleModalCreate(!showModal)) }} >
                <div className="modal-content">
                  <ModalHeader toggle={() => { dispatch(toggleModalCreate(!showModal)) }} close={closeXBtn} >
                     New Ticket 
                  </ModalHeader>
                  <ModalBody style={{paddingBottom:'0.25rem'}}>
                    <form>
                      <Row className="mb-3" hidden={!showHeaderForm}>
                        <Col lg="3" className="align-self-center">
                            <SelectBox
                            items={typeTicketList} 
                            // placeholder="Select Type" 
                            showClearButton={true} 
                            stylingMode="outlined" 
                            label={'Select Type'}
                            labelMode='floating'
                            value={ticketType} 
                            displayExpr={"text"} 
                            valueExpr={"value"}
                            disabled={false}
                            visible= {showHeaderForm}
                            onValueChanged={onTypeChange} >
                            <DropDownOptions showTitle={false} />
                          </SelectBox>
                        </Col>
                        <Col lg="3" className="align-self-center">
                          {  dsPriority.length > 0 &&  <SelectBox
                              items={dsPriority} 
                              placeholder='Priority' 
                              stylingMode='outlined' 
                              label='Priority'
                              labelMode='floating'
                              showClearButton={true} 
                              value={priorityType} 
                              displayExpr={"name"} 
                              valueExpr={"id"}
                              disabled={ticketType === null}
                              visible={visiblePriority && showHeaderForm }
                              onValueChanged={onPriorityChange} 
                            >
                            <DropDownOptions showTitle={false} />
                            <Validator ref={refValidPriority}>
                                    <RequiredRule message="Priority is required" />
                            </Validator>
                          </SelectBox>}
                        </Col>

                        <Col lg="6">
                          <Autocomplete
                            dataSource={dsSenders}
                            value={email}
                            valueExpr="email"
                            stylingMode='outlined' 
                            label='Email'
                            labelMode='floating'
                            onValueChanged={onEmailChanged}
                            //placeholder="Email.."
                            itemRender={renderEmailAutoComplate}
                            disabled={ticketType !== "E"}
                            visible= {showHeaderForm}
                            onFocusOut = { (e) => {
                              if(ticketType === 'E' && refValidEmail.current.instance.validate().isValid ){
                                  let mailAr = email.split('@');
                                  let domain =  toLower(mailAr[1]);
                                  let agencyFiltered = dsAgencies.find(f => domain.includes(f.domain))

                                  if(!isEmpty(agencyFiltered)){
                                    setgroupAgency(agencyFiltered.groupAgencyId);
                                    let agcByGroup = dsAgencies.filter(f => f.groupAgencyId === agencyFiltered.groupAgencyId);
                                    setdsFAgency(agcByGroup);
                                    setagency(agencyFiltered.id);
                                  }
                                
                              }
                            }}
                          >
                              <Validator ref={refValidEmail}>
                                  <RequiredRule message="Email is required" />
                                  <EmailRule  message="Email is invalid" />
                                  <CustomRule  validationCallback={(e) => {
                                    if(!e.value.includes('@')){return false}
                                    if(ticketType !== 'E') {return false}
                                    let mailAr = e.value.split('@');
                                    let domain =  toLower(mailAr[1]);
                                    let agencyFiltered = dsAgencies.filter(f => domain.includes(f.domain));
                                    return agencyFiltered.length > 0;
                                  }} message={'This email domain not registered in system'} />
                              </Validator>
                            </Autocomplete>
                        </Col>
                    
                      </Row>
                      <Row className="mb-3" hidden={!showHeaderForm}>
                        <Col lg="6">
                          <Autocomplete
                            dataSource={dsSenders}
                            value={firstName}
                            valueExpr="firstName"
                            stylingMode='outlined' 
                            label='First Name'
                            labelMode='floating'
                            onValueChanged={onFirstNameChanged}
                            //placeholder="Firts Name"
                            visible= {showHeaderForm}
                            disabled={ticketType !== "E"}
                          >
                                <Validator ref={refValidfName}>
                                    <RequiredRule message="First name is required" />
                                </Validator>
                            </Autocomplete>
                        </Col>
                        <Col lg="6">
                          <TextBox 
                              name="lastname"
                              value={lastName}
                              showClearButton={true}
                              stylingMode='outlined' 
                              label='Last Name'
                              labelMode='floating'
                              valueChangeEvent="keyup"
                              disabled={ticketType !== 'E'}
                              visible= {showHeaderForm}
                              onValueChanged={(e) => setlastName(e.value)} >
                                  <Validator ref={refValidlName}>
                                    <RequiredRule message="Last name is required" />
                                </Validator>
                            </TextBox>
                        </Col>
                      </Row>

                      <Row className="mb-3" hidden={!showHeaderForm}>
                        <Col lg="6">
                        {
                          dsApps.length > 0 && <SelectBox 
                          //  onContentReady={ onInitApps }
                            dataSource={dsApps} 
                            //placeholder={appPlaceholder}
                            showClearButton={true} 
                            stylingMode='outlined' 
                            label={appPlaceholder}
                            labelMode='floating'
                            value={app} displayExpr={"name"} 
                            valueExpr={"id"} 
                            onValueChanged={onAppChanged} 
                            visible= {showHeaderForm}
                            disabled= {ticketType === null} >
                            <DropDownOptions showTitle={false} />
                            <Validator ref={refValidApp}>
                                    <RequiredRule message="App is required" />
                            </Validator>
                          </SelectBox>
                        
                        }
                        </Col>
                        <Col lg="6">
                          <SelectBox dataSource={ModuleList}  
                          //placeholder={modulePlaceHolder} 
                          showClearButton={true} 
                          stylingMode='outlined' 
                          label={modulePlaceHolder}
                          labelMode='floating'
                          value={module} 
                          displayExpr={"name"} 
                          valueExpr={"id"}  
                          onValueChanged={onModuleChanged}
                          visible= {showHeaderForm}
                          disabled={ModuleDisabled && (ticketType === null)} >
                            <DropDownOptions showTitle={false} />
                            <Validator ref={refValidModule}>
                                    <RequiredRule message="Module is required" />
                            </Validator>
                          </SelectBox>
                        </Col>
                      </Row>
                      
                      { showAgencies() }

                      <Row className="mb-3" >
                        <Col lg="10">
                          <TextBox 
                              name="subject"
                              value={subject}
                              showClearButton={true}
                              stylingMode='outlined' 
                              label={'Subject'}
                              labelMode='floating'
                              valueChangeEvent="keyup"
                              disabled={ticketType === null}
                              onValueChanged={(e) => setSubject(e.value)} >
                              <Validator ref={refValidSubject}>
                                    <RequiredRule message="Subject is required" />
                              </Validator>
                            </TextBox>
                              
                        </Col>
                        <Col lg="2" className="d-flex align-items-center">
                          <Link to="#" onClick={() => { setShowHeaderForm(!showHeaderForm); setBtnExpandHtmlEditor(btnExpandHtmlEditor === 'Collapse' ? 'Expand' : 'Collapse') } } style={{ cursor: "pointer" }} > 
                          <i className={'bx bx-expand font-size-20 align-middle'}></i>
                            {(btnExpandHtmlEditor ===  'Expand' ? `  Collapse` : `   Expand`)} 
                            </Link>
                        </Col>
                      </Row>
                   
                      <Row className="mb-3">
                        <Col lg="12">
                                <HtmlEditor height={showHeaderForm ? '45vh' : '70vh'}  value={valueContent} valueType={"html"} 
                                      onValueChanged={onHtmlEditorChanged} 
                                      disabled={ticketType === null} 
                                    >
                                    <MediaResizing enabled={true} />
                                    <Toolbar>
                                        {
                                          toolsHtmlEditor.map(e => {
                                              return ( <Item name={e.name} key={`htmleditor-${e.id}`} />)
                                          })
                                        }
                              
                                    </Toolbar>
                                    <Validator ref={refValidContent}>
                                      <RequiredRule message="Description is required" />
                                  </Validator>
                                </HtmlEditor>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col lg="12">
                          <FileUploader 
                                ref={thisFileUploader}
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
                                 maxFileSize={1000000}
                                 invalidMaxFileSizeMessage={"Maximum file size 1mb"}
                                // onValueChanged = { onUploadValueChanged }
                                 showClearButton={true}
                                 disabled={ticketType === null}
                            />
                        </Col>
                      </Row>
                    </form>
                  </ModalBody>
                  <ModalFooter style={{paddingTop:'0.25rem', paddingBottom:'0.25rem'}}>
                    {/* <Button type="button" color="secondary" onClick={() => { dispatch(toggleModalCreate(!showModal)) }} > */}
                    
                    {
                      hasDraf ? 
                      (<Button type="button" color="secondary" onClick={() => { fethFromDaf() }} >
                      <i className="fas fa-upload ms-1"></i>
                      </Button>)
                      :
                      null
                    }
                    
                    <Button type="button" color="secondary" onClick={() => { onClose() }} >
                      Close
                    </Button>
                    <Button type="button" color="primary" onClick={() => { onTicketSubmit() } }  disabled={ isEmpty(valueContent)} >
                      Submit <i className="fab fa-telegram-plane ms-1"></i>
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>  
              <LoadPanel
                  shadingColor="rgba(0,0,0,0.4)"
                  position={loadinCretePosition}
                  //onHiding={this.hideLoadPanel}
                  visible={showCreateLoadPanel}
                  showIndicator={true}
                  shading={true}
                  showPane={true}
                  closeOnOutsideClick={false}
              />

        </>
    )
}

export default CreateModal
