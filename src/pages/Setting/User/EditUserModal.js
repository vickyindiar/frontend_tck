import React, {useState, useEffect, useRef, useCallback }from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Label } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import { LoadPanel } from 'devextreme-react/load-panel'
import { toggleModalEditUser } from '../../../store/actions'
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import randomColor from '../../../helpers/random_color_helper'
import DropDownBox from 'devextreme-react/drop-down-box'
import TreeView from 'devextreme-react/tree-view'
import FileUploader from 'devextreme-react/file-uploader'
import {getRoles, getDepartments, updateUser} from '../../../store/actions'
import FloatingBtnUpload from './FloatingBtnUpload'
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'; 
import { CheckBox } from 'devextreme-react/check-box';
import config from '../../../config';

const loadinCretePosition = { of: '.editUserModal' }

function EditUserModal({data}) {
    const dispatch = useDispatch();
    const loadPanel = useSelector(state => state.users.loadPanel)
    const showModalEdit = useSelector(state => state.users.modalEditUser)
    const dsRoles = useSelector(state => state.users.allRoles)
    const dsDepts = useSelector(state => state.users.allDepartments)
    const errorApi = useSelector(state => state.users.errorApi)
    const [fName, setfName] = useState(data.firstName)
    const [lName, setlName] = useState(data.lastName)
    const [email, setemail] = useState(data.email)  
    const [pass, setpass] = useState("")  
    const [ckNPass, setckNPass] = useState(false)
    const [passMode, setPassMode] = useState('password');

    const [bgColorAvatar, setbgColorAvatar] = useState(null)
    const [srcAvatar, setsrcAvatar] = useState(data.image ? `${config.apiURL}media/user/${data.id}` : null)

    const [roles, setroles] = useState([...data.userRoles.map(a => a.roleId)])
    const [depts, setdepts] = useState([...data.userDepts.map(a => a.departmentId)])
    const refEmail = useRef(null)
    const refTVRoles = useRef(null)
    const refTVDepts = useRef(null)
    const refUploaderUser = useRef(null)

    //ref for validation
    const refValidfName = useRef(null);
    const refValidlName = useRef(null);
    const refValidEmail = useRef(null);
    const refValidPass = useRef(null);
    const refValidRoles = useRef(null);
    const refValidDepst = useRef(null);

    useEffect(() => {
        if(!data.color) {
            let rc = randomColor();
            setbgColorAvatar(rc)
        }
      dispatch(getRoles())
      dispatch(getDepartments())
    }, [])

    useEffect(() => {
     if(errorApi !== ""){
       showToast(errorApi)
     }
    }, [errorApi])


    const onNewUserSubmit = () => {
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      let fNameValid = refValidfName.current.instance.validate().isValid;
      let lNameValid = refValidlName.current.instance.validate().isValid;
      let mailValid = refValidEmail.current.instance.validate().isValid;
      let passValid = ckNPass ? refValidPass.current.instance.validate().isValid : true;
      let rolesValid = refValidRoles.current.instance.validate().isValid;
      let deptsValid = refValidDepst.current.instance.validate().isValid;

      if(fNameValid && lNameValid && mailValid && passValid && rolesValid && deptsValid ){
      }
      else{
        return
      }

      let fileUpload = [];
        
      refUploaderUser.current.instance._files.forEach(item => {
          if(item.isValidFileExtension && item.isValidMaxSize){
            fileUpload.push(item.value)
          }
      });
      let UserRoles =[];
      roles.forEach(id => { UserRoles.push({RoleId: id}); });
      let UserDepts =[];
      depts.forEach(id => { UserDepts.push({DepartmentId: id}); });
      let dataSubmit = {
        Id: data.id,
        FirstName: capitalizeFirstLetter(fName),
        LastName: capitalizeFirstLetter(lName),
        Email: email,
        Color: bgColorAvatar,
        UserRoles: JSON.stringify(UserRoles),
        UserDepts: JSON.stringify(UserDepts),
        medias: fileUpload
      }
      if(ckNPass){ dataSubmit.Password = pass; }
      dispatch(updateUser(dataSubmit))

    }

    const passwordButton = {
      icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
      type: 'default',
      onClick: () => {
          let mode = passMode === 'password' ? 'text' : 'password';
          setPassMode(mode);
      }
    }

    const onBtnUploadAvatarClick = useCallback( () => {
        let el = null;
        if( refUploaderUser ){
           el = refUploaderUser.current.instance.element();//.find(".dx-fileuploader-button.dx-button");
          el = el.getElementsByClassName('dx-fileuploader-button');
          if(el.length > 0){ el[0].click(); }
        }
      },
      []
    );

    const  onUploadAvatar = async(e) => {
      try {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        let img = await toBase64(e.value[0])
        setsrcAvatar(img)
      } catch (error) {
        return null;
      }
  
    }
    const syncTVRolesSelection = (e) => {
      let treeView = (e.component.selectItem && e.component) || (refTVRoles && refTVRoles.current.instance);
      if (treeView) {
        if (e.value === null) {
          refTVRoles.current.instance.unselectAll();
        } else {
          let values = e.value || roles;
          values && values.forEach(function(value) {
            refTVRoles.current ?  refTVRoles.current.instance.selectItem(value) : e.component.selectItem(value)
          });
        }
      }
  
      if (e.value !== undefined) { setroles(e.value) }
    }

    const syncTVDeptsSelection = (e) => {
      let treeView = (e.component.selectItem && e.component) || (refTVDepts && refTVDepts.current.instance);
      if (treeView) {
        if (e.value === null) {
          refTVDepts.current.instance.unselectAll();
        } else {
          let values = e.value || depts;
          values && values.forEach(function(value) {
            refTVDepts.current ? refTVDepts.current.instance.selectItem(value) : e.component.selectItem(value)
          });
        }
      }
  
      if (e.value !== undefined) { setdepts(e.value) }
    }

    const showToast = (message) => {
  
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
        hideDuration: 250
      }
  
       toastr.error(message, "Edit User Failed !")
    }


    const tVRolesRender = () => {
      return (
        <TreeView 
          dataSource={dsRoles}
          ref={ refTVRoles }
          dataStructure="plain"
          keyExpr="id"
          // parentIdExpr="categoryId"
          selectionMode="multiple"
          showCheckBoxesMode="normal"
          selectNodesRecursive={false}
          displayExpr="name"
          selectByClick={true}
          onContentReady={syncTVRolesSelection}
          onItemSelectionChanged={(e) => {
             setroles(e.component.getSelectedNodeKeys())
          }}
        />
      );
    }

    const tVDeptsRender = () => {
      return (
        <TreeView 
          dataSource={dsDepts}
          ref={ refTVDepts }
          dataStructure="plain"
          keyExpr="id"
          // parentIdExpr="categoryId"
          selectionMode="multiple"
          showCheckBoxesMode="normal"
          selectNodesRecursive={false}
          displayExpr="name"
          selectByClick={true}
          onContentReady={syncTVDeptsSelection}
          onItemSelectionChanged={(e) => {
             setdepts(e.component.getSelectedNodeKeys())
          }}
        />
      );
    }

    const showAvatar = () =>{
      if(srcAvatar){
          return( <img className="rounded avatar-lg " id= "avatar-edit-user" alt="avatar" src={srcAvatar} />)
      }
      else{
        return (
          <div className="avatar-lg " id="avatar-edit-user">
            <span className={ "avatar-title rounded text-white font-size-35 " } style={{background: data.color ? data.color : bgColorAvatar, opacity:0.65 }} >
              {fName.charAt(0) + lName.charAt(0) }
            </span> 
          </div>
        )
      }
    }


    return (
        <>
        <Modal isOpen={showModalEdit} role="dialog" autoFocus={true} centered={true} size={'lg'} className="editUserModal" tabIndex="-1" toggle={() => { dispatch(toggleModalEditUser(!showModalEdit)) }} >
           <div className="modal-content">
             <ModalHeader toggle={() => { dispatch(toggleModalEditUser(!showModalEdit)) }} > Edit User </ModalHeader>
             <ModalBody>
               <form>
                 <Row className="mb-2">
                   <Col lg="3" className="d-flex justify-content-center" >
                      {
                       showAvatar()
                      }
                    
                      <FileUploader 
                         ref={refUploaderUser}
                         multiple={true} 
                          selectButtonText="uploadImg" 
                          labelText="" 
                          accept="image/jpeg, image/png" 
                          uploadMode="useForm" 
                          maxFileSize={1000000}
                          invalidMaxFileSizeMessage={"Maximum file size 1mb"}
                          onValueChanged = { onUploadAvatar }
                          showClearButton={true}
                          visible = {false}
                      />
                      <FloatingBtnUpload onClick={onBtnUploadAvatarClick} of="#avatar-edit-user"/>
                    
                    
                   </Col>
                   <Col lg="9">
                     <Row className="mb-2">
                       <Col>
                       <TextBox 
                              name="fName"
                               defaultValue={fName}
                              showClearButton={true}
                              // stylingMode='outlined'
                              // placeholder="First Name"
                              stylingMode="outlined" 
                              label={'First Name'}
                              labelMode='floating'
                              valueChangeEvent="keyup"
                            //   disabled={ticketType === null}
                              onValueChanged={(e) => setfName(e.value)} 
                        >
                             <Validator ref={refValidfName} >
                                <RequiredRule message="First Name is required" />
                            </Validator> 

                        </TextBox>
           
                       </Col>
                     </Row>
                     <Row>
                       <Col>
                       <TextBox 
                              name="lName"
                              defaultValue={lName}
                              showClearButton={true}
                              // placeholder="Last Name"
                              stylingMode="outlined" 
                              label={'Last Name'}
                              labelMode='floating'
                              valueChangeEvent="keyup"
                            //   disabled={ticketType === null}
                              onValueChanged={(e) => setlName(e.value)} 
                        >
                          <Validator ref={refValidlName} >
                                <RequiredRule message="Last Name is required" />
                            </Validator> 
                          </TextBox>
                       </Col>
                     </Row>
                   </Col>
                 </Row>
                 <Row className="mb-2">
                   <Col className="align-self-center">
                        <TextBox 
                              ref = {refEmail}
                              name="c-user-email"
                              defaultValue={email}
                              showClearButton={true}
                              stylingMode="outlined" 
                              label={'Email'}
                              labelMode='floating'
                              mode="email"
                              valueChangeEvent="keyup"
                              onValueChanged={(e) => setemail(e.value)} 
                        >
                            <Validator ref={refValidEmail} >
                                <RequiredRule message="Email is required" />
                                <EmailRule message="Email is invalid" />
                            </Validator> 
                        </TextBox>
                    </Col>
                 </Row>
                 <Row className="mb-2">
             
                    <Col lg="2" md="2" className="d-flex align-items-center mr-0">
                           <CheckBox 
                            value={ckNPass} 
                            onValueChanged={(e) => { setckNPass(e.value); }}
                            style={{marginRight:'15px'}}/> 
                           Change Password 
                    </Col>
                    <Col lg="10" md="10" className="ml-0">
                        <TextBox 
                              name="c-user-password"
                              defaultValue={pass}
                              showClearButton={true}
                              stylingMode="outlined" 
                              label={'New Password'}
                              labelMode='floating'
                              mode={passMode}
                              valueChangeEvent="keyup"
                              disabled={ckNPass === false}
                              onValueChanged={(e) => setpass(e.value)} 
                              
                        >
                             <TextBoxButton name="password-button" location="after" options={passwordButton} />
                             <Validator ref={refValidPass} >
                                <RequiredRule message="Password is required" />
                             </Validator> 
                        </TextBox>
                   </Col>
                 </Row>
                 <Row className="mb-2">
                   <Col lg="6">
                    <DropDownBox
                        value={roles}
                        valueExpr="id"
                        displayExpr="name"
                       // placeholder="Select Roles..."
                        stylingMode="outlined" 
                        label={'Roles'}
                        labelMode='floating'
                        showClearButton={true}
                        dataSource={dsRoles}
                        onValueChanged={syncTVRolesSelection}
                        contentRender={tVRolesRender}
                    >
                        <Validator ref={refValidRoles} >
                                <RequiredRule message="Roles is required" />
                        </Validator> 
                    </DropDownBox>
                   </Col>
                   <Col lg="6">
                    <DropDownBox
                        value={depts}
                        valueExpr="id"
                        displayExpr="name"
                        //placeholder="Select Department..."
                        stylingMode="outlined" 
                        label={'Departments'}
                        labelMode='floating'
                        showClearButton={true}
                        dataSource={dsDepts}
                        onValueChanged={syncTVDeptsSelection}
                        contentRender={tVDeptsRender}
                    >
                          <Validator ref={refValidDepst} >
                                <RequiredRule message="Department is required" />
                        </Validator> 
                    </DropDownBox>
                   </Col>
                 </Row>
               </form>
             </ModalBody>
             <ModalFooter>
               <Button type="button" color="secondary" onClick={() => { dispatch(toggleModalEditUser(!showModalEdit)) }} >
                 Close
               </Button>
               <Button type="button" color="primary" onClick={() => { onNewUserSubmit() }}>
                 Update <i className="fab fa-telegram-plane ms-1"></i>
               </Button>
             </ModalFooter>
           </div>
         </Modal>  
         <LoadPanel
             shadingColor="rgba(0,0,0,0.4)"
             position={loadinCretePosition}
             //onHiding={this.hideLoadPanel}
             visible={loadPanel}
             showIndicator={true}
             shading={true}
             showPane={true}
             closeOnOutsideClick={false}
         />
   </>
    )
}

const areEqual = (prevProps, nextProps) => { return true; };
export default React.memo(EditUserModal, areEqual)
