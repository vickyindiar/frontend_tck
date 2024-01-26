import React from 'react'
import { useState, useRef, useEffect } from 'react'
import {  Link } from 'react-router-dom'
import { Row, Col, Collapse,  Button} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import HtmlEditor, { Toolbar, Item, MediaResizing } from 'devextreme-react/html-editor'
import Switch from "react-switch";
import FileUploader from 'devextreme-react/file-uploader'
import {postTicketDetail} from '../../store/actions'
import isEmpty from 'helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import Compressor from "compressorjs";


function EditorResponseReply({detail, scrollDown}) {
    const activeUser = useSelector(state => state.Login.user)
    const activeRole = useSelector(state => state.Login.activeRole)
    const isMobile = document.getElementById('root').clientWidth <= 575 ;
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)

    const [replyValue, setReplyValue] = useState("")
    const [msgPrivate, setmsgPrivate] = useState(true)
    const [fileUploaded, setfileUploaded] = useState([])
    const loadingPost = useSelector(state => state.tickets.loadingPost)
    const [openReply, setopenReply] = useState(false)
    const [btnCap, setbtnCap] = useState("Add Response")
    const [btnReplyPos, setbtnReplyPos] = useState(null)
    const editorFileUploader = useRef(null); 
    const htmlEditorRef = useRef(null);
    const dispatch = useDispatch();
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
        {id:15, name:'background' }
    ])

    const toastOption = () => {
        toastr.options = {
            positionClass: "toast-top-right",
            timeOut: 3000,
            extendedTimeOut: 500,
            closeButton: false,
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
                    // dispatch({type: RESET_CLIENT_TICKET_STATE, payload: {success: false, error:{}, loadingCreate: false} });  
            } 
            }
    }
    const showToastWarning = () => {
        toastOption();
        let msg = ""
        let title =""
        if(msgPrivate){
            msg='This response will not appear in client side'
            title='Private Response'
        }
        else{
            msg='This response will be sent to the client'
            title='Public Response'   
        }
        toastr.warning(msg, title)
    }

    useEffect(() => {
        if(detail === 'center'){
            setbtnReplyPos("d-flex justify-content-center")
        }
        else if(detail.hasOwnProperty('user') && detail.user !== null){
            setbtnReplyPos("d-flex flex-row-reverse")
        } 
        else if(detail.hasOwnProperty('user') && detail.user === null ){
            setbtnReplyPos("")
        }
    
    }, [detail])

    const onHtmlEditorChanged = (e) => {
        setReplyValue(e.value)
    }

 

    const onSubmitComment = async () => {
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
                      convertTypes: 'image/png,image/webp',
                      convertSize: '1200000',
                      success(result) {
                        debugger
                        resolve(result);
                      },
                      error(error) {
                        reject(error);
                      },
                    });
                  });
                }
                let compressedimg = await compressedBlob(img)
                debugger
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
                debugger
                let f = dataURLtoFile(img.src, img.alt) //base64 to image
                let fc = await doCompressImage(f) //image commpress
                let fb = await getBase64(fc) //image to bas64
                img.src = fb
            }
                
            let outer =  el.outerHTML;
            return outer
        }

        let fileUpload = [];
        
        editorFileUploader.current.instance._files.forEach(item => {
            if(item.isValidFileExtension && item.isValidMaxSize){
              fileUpload.push(item.value)
            }
        });

        let dataSubmit = {
            userId: activeUser.id,
            user:  JSON.stringify({ ...activeUser}),
            sender: JSON.stringify({ ...selectedSingleRow.senders}),
            ticketId: selectedSingleRow.id,
            comment:configImg(replyValue),
            private: !msgPrivate,
            medias: fileUpload,
            ticketAssign: JSON.stringify(selectedSingleRow.ticketAssigns)
        }
        dataSubmit.comment = await compressImg(dataSubmit.comment)
        dispatch(postTicketDetail(dataSubmit))
        setReplyValue("");
        editorFileUploader.current.instance.reset();
    }

    const onCancelComment = () => {
        setReplyValue("");
        editorFileUploader.current.instance.reset();
        setopenReply(false)
    }

    const onClickbtnResponse = () => {
        if(openReply){
            onCancelComment();
        }
        setopenReply(!openReply); 
        setbtnCap(openReply ? "Add Response":"Cancel" )
        
    }

    const bntReplyClick = () => {
         onClickbtnResponse() 
        setTimeout(() => {
         htmlEditorRef.current.instance.focus();
         if(!openReply) scrollDown(100);
        }, 150);
    }
    return (
        <React.Fragment>
           <li >
                <Row className="mb-4 no-marginlr"> 
                    <Col className={btnReplyPos}>
                       <Link to="#" onClick={() => { bntReplyClick() } } style={{ cursor: "pointer" }} className={ detail.users !== null ? "right" : "" }> 
                       <i className={ !openReply ? 'bx bx-message-alt-dots font-size-20 align-middle' : 'bx bx-x font-size-20 align-middle'}></i>
                         {"  " + btnCap} 
                        </Link>
                    </Col>
                </Row>
                <Row className="no-marginlr">
                    <Col>
                        <Collapse isOpen={openReply} className="p-3">
                            {/* <Card > */}
                                {/* <CardBody className="border shadow-none text-muted mb-0"> */}
                                    <Row className="html-editor-section">
                                        <HtmlEditor height={400} 
                                            ref={htmlEditorRef} 
                                            value={replyValue} 
                                            valueType={"html"}
                                            onValueChanged={onHtmlEditorChanged} 
                                            elementAttr={{id:"htmlEditorResponse"}}
                                            // style={  {'border': `${msgPrivate ? '1px solid red' : '' }`} }
                                        >
                                            <MediaResizing enabled={true} />
                                            <Toolbar>
                                            {
                                                isMobile ? null :  toolsHtmlEditor.map(e => { return ( <Item name={e.name} key={`htmleditor-${e.id}`} />) })
                                            }
                                            </Toolbar>
                                        </HtmlEditor>
                                    </Row>

                                    <Row>
                                    <FileUploader
                                        ref={editorFileUploader}
                                        multiple={true} 
                                        selectButtonText="Attachment" 
                                    //   value={fileUploaded}
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
                                        //   onValueChanged = { onUploadValueChanged }
                                        showClearButton={true}
                                        
                                    />
                                   </Row>
                                   <Row>
                                       <Col className="no-marginlr">
                                       <div className="d-flex flex-row-reverse">
                                        <div className="btn-group" aria-label="Basic" role="group" > 
                               
                                            {/* <Button type="button" outline color={msgPrivate ? 'success' : 'danger' } className= {'btn-lebel' }   onClick={() => {setmsgPrivate(!msgPrivate)}} >
                                                <i className= {msgPrivate ? "mdi mdi-lock-open-alert-outline mdi-18px label-icon" : "mdi mdi-lock-check-outline mdi-18px label-icon" }></i>  
                                                { msgPrivate ? 'Public' : 'Private' }
                                            </Button> */}
                                            {/* <Switch
                                                value={msgPrivate}
                                                switchedOnText={"Public"}
                                                switchedOffText={"Private"}
                                                stylingMode="filled"
                                                onValueChanged={() => { setmsgPrivate(!msgPrivate)}}
                                            /> */}
                                        { selectedSingleRow.ticketType === "E" &&
                                             <Switch
                                                    checked={msgPrivate}
                                                    onChange={() => { showToastWarning(); setmsgPrivate(!msgPrivate)}}
                                                    handleDiameter={20}
                                                    height={35}
                                                    width={100}
                                                    borderRadius={6}
                                                    activeBoxShadow="0px 0px 1px 2px"
                                                    offColor="#e6ab95"
                                                    onColor="#8adea0"
                                                    disabled={loadingPost}
                                                    // style={{marginRight:'5px'}}
                                                    uncheckedIcon={
                                                        <div className="text-white" style={{  display: "flex", justifyContent: "center", alignItems: "center", height: "100%",  paddingRight: 20 }} >
                                                            Private
                                                        </div>
                                                    }
                                                    checkedIcon={
                                                     <div className="text-white" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", paddingLeft: 20 }} >
                                                        Public
                                                    </div>
                                                    }
                                                    uncheckedHandleIcon={
                                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}} >
                                                          <i className= { "mdi mdi-lock-check-outline mdi-18px" }></i>  
                                                        </div>
                                                    }
                                                    checkedHandleIcon={
                                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}} >
                                                           <i className= { "mdi mdi-lock-open-alert-outline mdi-18px"}></i> 
                                                        </div>
                                                    }
                                                    className="react-switch"
                                                    id="small-radius-switch"
                                                />
                                            }
                                            <Button  
                                                color="primary"
                                                onClick={() => { onSubmitComment() }}
                                                disabled = {loadingPost || isEmpty(replyValue)}
                                                > 
                                                   { loadingPost ? 'Loading' : 'Submit'}
                                                <i className={ loadingPost ? `bx bx-hourglass bx-spin font-size-16 align-middle ms-2` : `fab fa-telegram-plane font-size-16 align-middle ms-2`}></i>{" "}
                                             
                                            </Button>
                                            </div>
                                        </div>
                                       </Col>
                                
                           
                                </Row>
                                {/* </CardBody> */}
                            {/* </Card> */}
                        </Collapse>
                    </Col>
                </Row>
           </li>
            
        </React.Fragment>
    )
}

export default React.memo(EditorResponseReply)
