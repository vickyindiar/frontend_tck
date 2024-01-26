import React, {useState, useEffect, useRef}  from 'react'
import { Button,  Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Label } from "reactstrap"
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor'
import FileUploader from 'devextreme-react/file-uploader'
import { updateTicketComment } from '../../store/actions'
import { useDispatch } from 'react-redux'

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

function EditorResponseEdit({ id, comment, show, toggle }) {
    const ecFileUploader = useRef(null);  
    const [commentValue, setcommentValue] = useState('')
    const dispatch = useDispatch();


    useEffect(() => {
        setcommentValue(comment);
    }, [])


    const onHtmlEditorEditCommentChanged = (e) => {
        setcommentValue(e.value)
    }

    const onEditCommentSubmit = () => {
      let fileUpload = [];
        
      ecFileUploader.current.instance._files.forEach(item => {
          if(item.isValidFileExtension && item.isValidMaxSize){
            fileUpload.push(item.value)
          }
      });

      let dataSubmit = { Id: id, Comment: commentValue, medias: fileUpload }
      dispatch(updateTicketComment(dataSubmit))
      toggle();
    }


    return (
        <>
        <Modal isOpen={show} role="dialog"  autoFocus={true} centered={true} size={'lg'} className="editCommentModal" tabIndex="-1" zIndex="10001" toggle={() => { toggle() }} >
           <div className="modal-content">
             <ModalHeader toggle={() => { toggle() }} > Edit Comment </ModalHeader>
             <ModalBody>
               <form>
                 <Row className="mb-2">
                   <Col lg="12">
                
                           <HtmlEditor height={300} value={commentValue} valueType={"html"} onValueChanged={onHtmlEditorEditCommentChanged}  >
                               <Toolbar>
                               {toolsHtmlEditor.map(e => {
                                   return ( <Item name={e.name} key={`htmleditorEditComment-${e.id}`} />)
                               })
                               }
                               </Toolbar>
                           </HtmlEditor>
                   </Col>
                 </Row>
                 <Row className="mb-2">
                   <Col lg="12">
                     <FileUploader 
                           ref={ecFileUploader}
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
                            // disabled={ticketType === null}
                            />
                   </Col>
                 </Row>
               </form>
             </ModalBody>
             <ModalFooter>
               <Button type="button" color="secondary" onClick={() => { toggle() }} >
                 Close
               </Button>
               <Button type="button" color="primary" onClick={() => { onEditCommentSubmit() }}>
                 Submit <i className="fab fa-telegram-plane ms-1"></i>
               </Button>
             </ModalFooter>
           </div>
         </Modal>  
   </>

    )
}

export default React.memo(EditorResponseEdit)
