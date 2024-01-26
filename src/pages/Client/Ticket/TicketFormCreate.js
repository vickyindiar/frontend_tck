import React, {useState, useEffect, useRef} from 'react'
import MetaTags from 'react-meta-tags'
import { Button,  Row, Col, Container, Card, CardHeader, CardBody, CardFooter } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor'
import FileUploader from 'devextreme-react/file-uploader'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import { Validator, RequiredRule, EmailRule, CustomRule } from 'devextreme-react/validator'
import { Autocomplete } from 'devextreme-react/autocomplete'
import { Lookup, DropDownOptions } from 'devextreme-react/lookup'
import SelectBox from 'devextreme-react/select-box'
import { getApps, createClientTickets, reqFreeToken, verifyMailClient, toggleModalCreate } from 'store/actions'
import { getGroupAgency, getPriority } from 'store/actions'
import isEmpty from 'helpers/isEmpty_helper'
import {useHistory} from 'react-router-dom'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import AuthCode from "react-auth-code-input"
import { CLIENT_API_ERROR, RESET_CLIENT_AUTH_STATE } from 'store/client/auth/actionTypes'
import { RESET_CLIENT_TICKET_STATE } from 'store/client/ticket/actionTypes'
import { toLower } from 'lodash'

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


function TicketFormCreate() {
    // const dsSenders = useSelector(state => state.users.allSenders)
    const dsApps = useSelector(state => state.misc.allApps)
    const loadingCreate = useSelector(state => state.ticketsClient.loadingCreate)
    const showVerifyCode = useSelector(state => state.authClient.showVerifyCode)
    const loadingVerify = useSelector(state => state.authClient.loadingVerify)
    const activeClient = useSelector(state => state.authClient.client)
    const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated)
    const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)
    const errorApi = useSelector(state => state.authClient.error)
    const errorApiType = useSelector(state => state.authClient.errorType)
    const successSubmit = useSelector(state => state.ticketsClient.success)
    const freeToken = useSelector(state => state.authClient.freeToken)
    const dsGroupAgencies = useSelector(state => state.agency.dsGroupAgencies)
    const dsAgencies = useSelector(state => state.agency.dsAgencies)
    const dsPriority = useSelector(state => state.tickets.dsPriority)
    const [priorityType, setpriorityType] = useState(null)
    const [verifiedVal, setverifiedVal] = useState('')
    const [dsSenders, setdsSenders] = useState([])
    const [valueContent, setValueContent] = useState('');
    const [ticketType, setticketType] = useState(null)
    const [email, setEmail] = useState('');
    const [firstName, setFirtsName] = useState('');
    const [lastName, setlastName] = useState('');
    const [subject, setSubject] = useState('');
    const [app, setApp] = useState('')
    const [appPlaceholder, setappPlaceholder] = useState('Select Application')
    const [module, setModule] = useState('')
    const [modulePlaceHolder, setmodulePlaceHolder] = useState('Select Module')
    const [ModuleDisabled, setModuleDisabled] = useState(true);
    const [ModuleList, setModuleList] = useState(null);
    const [fileUploaded, setfileUploaded] = useState([])

    const [groupAgency, setgroupAgency] = useState(null)
    const [dsFGroupAgency, setdsFGroupAgency] = useState([])
    const [agency, setagency] = useState(null)
    const [dsFAgency, setdsFAgency] = useState([])

    const thisFileUploader = useRef(null);  
    const refValidPriority = useRef(null);
    const refValidEmail = useRef(null);
    const refValidfName = useRef(null);
    const refValidlName = useRef(null);
    const refValidApp = useRef(null);
    const refValidModule = useRef(null);
    const refValidSubject = useRef(null);
    const refValidContent = useRef(null);
    const refValidAgency = useRef(null);
    const dispatch = useDispatch()
    const history = useHistory();

    useEffect(() => {
    if(errorApi !== "" && errorApiType.includes('create-ticket') ){
        showToastError(errorApi)
    }
    }, [errorApi])

    useEffect(() => {
        if(successSubmit){
            showToastSuccess( "Your ticket has been successfully submitted")
        }
    }, [successSubmit]) 

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
                 dispatch({type: RESET_CLIENT_TICKET_STATE, payload: {success: false, error:{}, loadingCreate: false} });  
                 dispatch({type: RESET_CLIENT_AUTH_STATE, payload:{loadingVerify: false}});
                 dispatch({type: CLIENT_API_ERROR, payload: {errText: '',  errType: ''} });
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
        if(isAuthenticatedUser){
            dispatch(toggleModalCreate(true))
            history.push("/admin/ticket")
        }
        if(!isAuthenticatedClient){
            dispatch(reqFreeToken())
        }
    }, [])

    
    useEffect(() => {
        if(isAuthenticatedClient || !isEmpty(freeToken) ){
            dispatch(getApps(freeToken)) 
            dispatch(getGroupAgency(freeToken))
            dispatch(getPriority(freeToken))
        }
    }, [freeToken])

    useEffect(() => {
          if(!isEmpty(activeClient)){
            setEmail(activeClient.email)
            setFirtsName(activeClient.firstName)
            setlastName(activeClient.lastName)
          }
    }, [activeClient])

    useEffect(() => {
        if(!isEmpty(dsGroupAgencies)){ setdsFGroupAgency(dsGroupAgencies)}
        if(!isEmpty(dsAgencies)){ setdsFAgency(dsAgencies)}
        if(!isEmpty(activeClient) && !isEmpty(email)){
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
    }, [dsGroupAgencies, dsAgencies])

    const onHtmlEditorChanged = (e) => { setValueContent(e.value) }

    const onTypeChange = (e) => {
    }
    
    const onPriorityChange = (e) => {
      setpriorityType(e.value)
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
    const renderEmailAutoComplate = (data) => {
      return <span>{data.firstName +' '+data.lastName } ({data.email})</span>;
    }


    const onTicketSubmit = () => {
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      const postData = () => {
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
        
        thisFileUploader.current.instance._files.forEach(item => {
            if(item.isValidFileExtension && item.isValidMaxSize){
              fileUpload.push(item.value)
            }
        });
  
        let dataSubmit = {
          TicketType: "E",
          CreatedBy: email,
          AppId: app,
          ModuleId:module,
          Subject:subject,
          Comment:configImg(valueContent),
          medias: fileUpload,
          AgencyId: agency,
          GroupAgencyId: groupAgency,
          PriorityId: priorityType,
          Sender: JSON.stringify({ firstName: capitalizeFirstLetter(firstName), lastName: capitalizeFirstLetter(lastName), email})
        }
        dispatch(createClientTickets(dataSubmit, history, freeToken))
      }
      if(isAuthenticatedClient){
        let fNameValid = refValidfName.current.instance.validate().isValid;
        let lNameValid = refValidlName.current.instance.validate().isValid;
        let mailValid = refValidEmail.current.instance.validate().isValid;
        let appValid = refValidApp.current.instance.validate().isValid;
        let moduleValid = refValidModule.current.instance.validate().isValid;
        let subjectValid = refValidSubject.current.instance.validate().isValid;
        let contenttValid = refValidContent.current.instance.validate().isValid;
        let priorityValid = refValidPriority.current.instance.validate().isValid;
        if(fNameValid && lNameValid && mailValid && appValid && moduleValid && subjectValid && contenttValid  && priorityValid){
            postData()
        }
      }
      else{
        if(!showVerifyCode){
            let fNameValid = refValidfName.current.instance.validate().isValid;
            let lNameValid = refValidlName.current.instance.validate().isValid;
            let mailValid = refValidEmail.current.instance.validate().isValid;
            let appValid = refValidApp.current.instance.validate().isValid;
            let moduleValid = refValidModule.current.instance.validate().isValid;
            let subjectValid = refValidSubject.current.instance.validate().isValid;
            let contenttValid = refValidContent.current.instance.validate().isValid;
            let priorityValid = refValidPriority.current.instance.validate().isValid;
            if(fNameValid && lNameValid && mailValid && appValid && moduleValid && subjectValid && contenttValid && priorityValid ){
              dispatch(verifyMailClient(email, 'create-ticket',  freeToken))
            }
          }
          else{
            if(verifiedVal.length === 4){
                postData()
            }
            else{
              alert('error verification code')
            }
          }
      }
    }


    const onCancelClick = () => {
        setEmail('');
        setFirtsName('');
        setlastName('');
        setApp(null);
        setModule(null);
        history.push('/mytickets')
    }

    const showAgencies = () => {
        return (
          <Row className="mb-3">
            <Col lg="6">
          
              <SelectBox 
                dataSource={dsGroupAgencies} 
                showClearButton={true} 
                // placeholder={'Group Agency'}
                // stylingMode="outlined" 
                stylingMode="outlined" 
                label={'Group Agency'}
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
                // placeholder={'Agency'} 
                // stylingMode="outlined" 
                stylingMode="outlined" 
                label={'Agency'}
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
                       if(isEmpty(email)){ return false}
                       if(!email.includes('@')){return false}
                       let mailAr = email.split('@');
                       let domain =  toLower(mailAr[1]);
                       let ag = dsAgencies.find(f => f.id === e.value);
                       return ag.domain.includes(domain) || domain.includes(ag.domain);
                    }} message="This Agency does not match with the email" />
                </Validator>
              </SelectBox>
            </Col>
          </Row>
        )
      }

    return (
        <React.Fragment>
        <MetaTags>
          <title> Ticket | Ticketing </title>
        </MetaTags>
            <Container fluid className="container-client-ticket">
                <Row>
                    <Col style={{padding:'1.5rem 20rem 0rem 20rem'}}>
                      <Card>
                            <CardHeader style={{backgroundColor:'#72BFC3', opacity:'0.75', color:'white' }}>
                                New Ticket
                            </CardHeader>
                            <CardBody>
                                <form>
                                <Row className="mb-3">
                                    <Lookup
                                        items={typeTicketList} 
                                        showClearButton={true} 
                                        // placeholder="Select Type" 
                                        // stylingMode="outlined" 
                                        stylingMode="outlined" 
                                        label={'Type'}
                                        labelMode='floating'
                                        value={ticketType} 
                                        displayExpr={"text"} 
                                        valueExpr={"value"}
                                        disabled={false}
                                        visible={false}
                                        onValueChanged={onTypeChange} 
                                        >
                                        <DropDownOptions showTitle={false} />
                                    </Lookup>
                                    <Col lg="3" className="align-self-center">
                                        {  dsPriority.length > 0 &&  <SelectBox
                                            items={dsPriority} 
                                            showClearButton={true} 
                                            // placeholder="Priority" 
                                            // stylingMode="outlined" 
                                            stylingMode="outlined" 
                                            label={'Priority'}
                                            labelMode='floating'
                                            value={priorityType} 
                                            displayExpr={"name"} 
                                            valueExpr={"id"}
                                            visible={true}
                                            onValueChanged={onPriorityChange} 
                                          >
                                          <DropDownOptions showTitle={false} />
                                          <Validator ref={refValidPriority}>
                                                  <RequiredRule message="Priority is required" />
                                          </Validator>
                                        </SelectBox>}
                                    </Col>
                                    <Col lg="9">
                                      
                                        <Autocomplete
                                            dataSource={dsSenders}
                                            value={email}
                                            valueExpr="email"
                                            onValueChanged={onEmailChanged}
                                            // stylingMode="outlined"
                                            // placeholder="Email.."
                                            stylingMode="outlined" 
                                            label={'Email'}
                                            labelMode='floating'
                                            itemRender={renderEmailAutoComplate}
                                            disabled={isAuthenticatedClient}
                                            onFocusOut = { (e) => {
                                                if(refValidEmail.current.instance.validate().isValid){
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
                                                let mailAr = e.value.split('@');
                                                let domain =  toLower(mailAr[1]);
                                                let agencyFiltered = dsAgencies.filter(f => domain.includes(f.domain));
                                                return agencyFiltered.length > 0;
                                            }} message={'This email domain not registered in system'} />
                                        </Validator>
                                        </Autocomplete>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col lg="6">
                                        <Autocomplete
                                            dataSource={dsSenders}
                                            value={firstName}
                                            valueExpr="firstName"
                                            onValueChanged={onFirstNameChanged}
                                            // stylingMode="outlined"
                                            // placeholder="Firts Name"
                                            stylingMode="outlined" 
                                            label={'First Name'}
                                            labelMode='floating'
                                            disabled={isAuthenticatedClient}
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
                                            // stylingMode='outlined'
                                            // placeholder="Last Name"
                                            stylingMode="outlined" 
                                            label={'Last Name'}
                                            labelMode='floating'
                                            valueChangeEvent="keyup"
                                            disabled={isAuthenticatedClient}
                                            onValueChanged={(e) => setlastName(e.value)} >
                                        <Validator ref={refValidlName}>
                                            <RequiredRule message="Last name is required" />
                                        </Validator>
                                        </TextBox>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col lg="6">
                                    {
                                    dsApps.length > 0 && <SelectBox 
                                    //  onContentReady={ onInitApps }
                                        dataSource={dsApps} 
                                        // placeholder={appPlaceholder}
                                        // stylingMode="outlined"
                                        stylingMode="outlined" 
                                        label={appPlaceholder}
                                        labelMode='floating' 
                                        showClearButton={true} 
                                        value={app} displayExpr={"name"} 
                                        valueExpr={"id"} 
                                        onValueChanged={onAppChanged} 
                                        disabled= {false} >
                                        <DropDownOptions showTitle={false} />
                                        <Validator ref={refValidApp}>
                                            <RequiredRule message="App is required" />
                                        </Validator>
                                    </SelectBox>
                                    
                                    }
                                    </Col>
                                    <Col lg="6">
                                    <SelectBox dataSource={ModuleList} 
                                      //  placeholder={modulePlaceHolder} 
                                      //  stylingMode="outlined" 
                                       stylingMode="outlined" 
                                       label={modulePlaceHolder}
                                       labelMode='floating'
                                       showClearButton={true} 
                                       value={module} 
                                       displayExpr={"name"} 
                                       valueExpr={"id"} 
                                       onValueChanged={onModuleChanged} 
                                       disabled={ModuleDisabled } 
                                      >
                                        <DropDownOptions showTitle={false} />
                                        <Validator ref={refValidModule}>
                                            <RequiredRule message="Module is required" />
                                        </Validator>
                                    </SelectBox>
                                    </Col>
                                </Row>
                                { 
                                    showAgencies()
                                }

                                <Row className="mb-3">
                                    <Col lg="12">
                                    <TextBox 
                                        name="subject"
                                        defaultValue={subject}
                                        showClearButton={true}
                                        // stylingMode='outlined'
                                        // placeholder="Subject"
                                        stylingMode="outlined" 
                                        label={'Subject'}
                                        labelMode='floating'
                                        valueChangeEvent="keyup"
                                        disabled={false}
                                        onValueChanged={(e) => setSubject(e.value)} >
                                        <Validator ref={refValidSubject}>
                                            <RequiredRule message="Subject is required" />
                                        </Validator>
                                    </TextBox>
                                        
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col lg="12">
                                
                                            <HtmlEditor height={200} value={valueContent} valueType={"html"} onValueChanged={onHtmlEditorChanged} disabled={false} >
                                                <Toolbar>
                                                {toolsHtmlEditor.map(e => {
                                                    return ( <Item name={e.name} key={`htmleditor-${e.id}`} />)
                                                })
                                                }
                                                </Toolbar>
                                                <Validator ref={refValidContent}>
                                                      <RequiredRule message="Content is required" />
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
                                            showClearButton={true}
                                            disabled={false}
                                        />
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>
                        <CardFooter style={{backgroundColor:'#72BFC3', opacity:'0.75', color:'white' }} >
                        {
                              showVerifyCode && 
                              <>
                                <div className="mb-1">
                                  <h5>Verify your email</h5>
                                  <p>
                                      Please enter the 4 digit code sent to{" "}
                                      <span className="font-weight-semibold">
                                      {email}
                                      </span>
                                  </p>
                                </div>
                                <div className="mb-3">
                                  <AuthCode
                                      value={'xxxx'}
                                      characters={4}
                                      className="form-control form-control-lg text-center"
                                      allowedCharacters="^[A-Z, a-z, 0-9]"
                                      onChange={(e) => {setverifiedVal(e);}}
                                      inputStyle={{
                                        width: "50px",
                                        height: "40px",
                                        padding: "5px",
                                        borderRadius: "8px",
                                        fontSize: "15px",
                                        textAlign: "center",
                                        marginRight: "15px",
                                        border: "1px solid #ced4da",
                                        textTransform: "none",
                                      }}
                                    />
                                </div>
                              </>
                              
                          }
                            <Row>
                                <Col className="d-flex justify-content-end">
                                <Button type="button" color="secondary" style={{marginRight:'10px'}} onClick={() => { onCancelClick() }} >
                                  Close
                                </Button>
                                <Button type="button" color="primary" onClick={() => { onTicketSubmit() }} disabled = {loadingCreate || isEmpty(valueContent)}>
                                    {/* Submit <i className="fab fa-telegram-plane ms-1"></i> */}
                                    <i className={ loadingCreate || loadingVerify ? `bx bx-hourglass bx-spin font-size-16 align-middle me-2` : `fab fa-telegram-plane font-size-16 align-middle me-2`}></i>{" "}
                                    { loadingCreate || loadingVerify ? 'Loading' : 'Submit'}
                                </Button>
                                </Col>
                            </Row>
                  
                        </CardFooter>
                    </Card>
                </Col>
                </Row>
            </Container>

        </React.Fragment>
    )
}
const areEqual = (prevProps, nextProps) => { 
    return true; };
export default React.memo(TicketFormCreate, areEqual)
