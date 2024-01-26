import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Collapse,  Button } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor'
import FileUploader from 'devextreme-react/file-uploader'
import {postClientTicketDetail} from '../../../store/actions'
import isEmpty from 'helpers/isEmpty_helper'
import toastr from "toastr"
import "toastr/build/toastr.min.css"


function TicketResponseReply({detail, selectedSingleRow, scrollDown}) {
    const loadingPost = useSelector(state => state.ticketsClient.loadingPost)
    const error = useSelector(state => state.ticketsClient.error)
    const freeToken = useSelector(state => state.authClient.freeToken)

    const history = useHistory()
    const editorFileUploader = useRef(null); 
    const htmlEditorRef = useRef(null);
    const [replyValue, setReplyValue] = useState("")
    const [openReply, setopenReply] = useState(false)
    const [btnCap, setbtnCap] = useState("Add Response")
    const [btnReplyPos, setbtnReplyPos] = useState(null)
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
    
    useEffect(() => {
    if(!isEmpty(error)){
        if(error.hasOwnProperty("errorText")) showToastError(error.errorText)
    }
    }, [error])
    
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

    const onSubmitComment = () => {
        const search = history.location.search;
        const ticketToken = new URLSearchParams(search).get('tcid');
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
        
        editorFileUploader.current.instance._files.forEach(item => {
            if(item.isValidFileExtension && item.isValidMaxSize){
              fileUpload.push(item.value)
            }
        });
        let dataSubmit = {
            sender: JSON.stringify({ ...selectedSingleRow.senders}),
            ticketId: selectedSingleRow.id,
            comment: configImg(replyValue),
            medias: fileUpload,
            ticketAssign: JSON.stringify(selectedSingleRow.ticketAssigns)
        }
        dispatch(postClientTicketDetail(dataSubmit, freeToken, ticketToken))
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
                        <a onClick={() => { bntReplyClick() } } style={{ cursor: "pointer" }} className={ detail.users !== null ? "right" : "" }> 
                             <i className={ !openReply ? 'bx bx-message-alt-dots font-size-20 align-middle' : 'bx bx-x font-size-20 align-middle'}></i>
                         {"  " + btnCap} 
                        </a>
                    </Col>
                </Row>
                <Row className="no-marginlr">
                    <Col>
                        <Collapse isOpen={openReply} className="p-3">
                            {/* <Card > */}
                                {/* <CardBody className="border shadow-none text-muted mb-0"> */}
                                    <Row className="html-editor-section">
                                    <HtmlEditor height={170} 
                                        ref={htmlEditorRef} 
                                        value={replyValue} 
                                        valueType={"html"}
                                        onValueChanged={onHtmlEditorChanged} 
                                        elementAttr={{id:"htmlEditorResponse"}}
                                    >
                                        <Toolbar>
                                        { toolsHtmlEditor.map(e => { return ( <Item name={e.name} key={`htmleditor-${e.id}`} />) }) }
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
                                        <div className="d-flex flex-row-reverse">
                                            <div className="btn-group" aria-label="Basic" role="group" > 
                                            <Button  
                                                color="primary"
                                                onClick={() => { onSubmitComment() }}
                                                disabled = {loadingPost || isEmpty(replyValue)}
                                                > 
                                                <i className={ loadingPost ? `bx bx-hourglass bx-spin font-size-16 align-middle me-2` : `fab fa-telegram-plane font-size-16 align-middle me-2`}></i>{" "}
                                                { loadingPost ? 'Loading' : 'Submit'}
                                            </Button>
                      
                                            </div>
                                        </div>
                                </Row>
                         
                        </Collapse>
                    </Col>
                </Row>
           </li>
            
        </React.Fragment>
    )
}

export default React.memo(TicketResponseReply)
