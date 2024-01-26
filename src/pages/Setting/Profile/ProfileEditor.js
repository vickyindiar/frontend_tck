import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Row, Col, Card, CardBody, Label } from 'reactstrap'
import { useDispatch, useSelector } from "react-redux"
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import FileUploader from 'devextreme-react/file-uploader'
import FloatingBtnUploadProfile from './FloatingBtnUploadProfile'
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'
import { CheckBox } from 'devextreme-react/check-box';
import config from '../../../config';
import { size, map } from 'lodash'
import { Button } from 'devextreme-react/button'
import { getProfile, updateProfile, toggleProfileEdit } from 'store/actions'
import { confirm } from 'devextreme/ui/dialog';
import { useHistory } from 'react-router-dom'

const ProfileEditor = ({dsProfile}) => {
    const activeUser = useSelector(state => state.Login.user)
    // const dsProfile = useSelector(state => state.users.dsProfile)
    const editProfileState = useSelector(state => state.users.editProfileState)
    const dispatch = useDispatch()
    const history = useHistory()

    const [srcAvatar, setsrcAvatar] = useState( dsProfile.image ? `${config.apiURL}media/user/${dsProfile.id}` : null)
    const [bgColorAvatar, setbgColorAvatar] = useState(dsProfile.color ? dsProfile.color : null)
    const [fName, setfName] = useState(dsProfile.firstName)
    const [lName, setlName] = useState(dsProfile.lastName)
    const [email, setemail] = useState(dsProfile.email)  
    const [pass, setpass] = useState('')  
    const [roles, setroles] = useState([...dsProfile.userRoles])
    const [depts, setdepts] = useState([...dsProfile.userDepts])
    const [ckNPass, setckNPass] = useState(false)
    const [passMode, setPassMode] = useState('password')
   
    const refEmail = useRef(null)
    const refUploaderProfile = useRef(null)
    const refValidfName = useRef(null);
    const refValidlName = useRef(null);
    const refValidEmail = useRef(null);
    const refValidPass = useRef(null);

    useEffect(() => {
        if(size(Object.keys(activeUser ))> 0 ){
            dispatch(getProfile(activeUser.id))
        }
    }, [activeUser])
    useEffect(() => {
        if(  dsProfile && size(Object.keys(dsProfile)) > 0) {

            setfName(dsProfile.firstName)
            setlName(dsProfile.lastName)
            setemail(dsProfile.email)
            setroles([...dsProfile.userRoles])
            setdepts([...dsProfile.userDepts])
            if(dsProfile.image && dsProfile.image.includes('data:')){
                setsrcAvatar(dsProfile.image)
            }
            else if(dsProfile.image && dsProfile.image.includes('Users/')){
                setsrcAvatar(`${config.apiURL}media/user/${dsProfile.id}`)
            }
            if(dsProfile.color){
                setsrcAvatar(null)
                setbgColorAvatar(dsProfile.color)
            }
        }
    }, [dsProfile])
    

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
    
    const passwordButton = {
        icon:  passMode === 'password' ? 'bx bx-show' : 'bx bx-hide',
        type: 'default',
        onClick: () => {
            let mode = passMode === 'password' ? 'text' : 'password';
            setPassMode(mode);
        }
    }


    const showAvatar = () =>{
        if(srcAvatar){
            return( <img className="rounded avatar-lg " id="avatar-create-profile" alt="avatar" src={srcAvatar} />)
        }
        else{
          return (
            <div className="avatar-lg " id="avatar-create-profile">
              <span className={ "avatar-title rounded text-white font-size-35 " } style={{background:bgColorAvatar, opacity:0.65 }} >
                {fName.charAt(0) + lName.charAt(0) }
              </span> 
            </div>
          )
        }
      }

    
    const onBtnUploadAvatarClick = useCallback( () => {
        let el = null;
        if( refUploaderProfile ){
           el = refUploaderProfile.current.instance.element();//.find(".dx-fileuploader-button.dx-button");
          el = el.getElementsByClassName('dx-fileuploader-button');
          if(el.length > 0){ el[0].click(); }
        }
      },
      []
    );

    const onSubmitUpdateProfile = async(team) => {
        if(activeUser.email !== email || pass !== ''){
            let result = await confirm("Email and Password are authentication requirements, you need to re-login if you change it", "Re-login");
          
            if(result){
                confirmSubmit(true)
            }
        }
        else{
            confirmSubmit(false)
        }
    
    }

    const confirmSubmit = (relogin) => {
        let fNameValid = refValidfName.current.instance.validate().isValid;
        let lNameValid = refValidlName.current.instance.validate().isValid;
        let mailValid = refValidEmail.current.instance.validate().isValid;
        let passValid = ckNPass ? refValidPass.current.instance.validate().isValid : true;
        
        if(fNameValid && lNameValid && mailValid && passValid ){ }
        else{ return }

        let fileUpload = [];
            
        refUploaderProfile.current.instance._files.forEach(item => {
            if(item.isValidFileExtension && item.isValidMaxSize){
                fileUpload.push(item.value)
            }
        });
        let dataSubmit = {
            Id: activeUser.id,
            FirstName: fName,
            LastName: lName,
            Email: email,
            Color:bgColorAvatar,
            UserRoles: JSON.stringify(roles),
            UserDepts: JSON.stringify(depts),
            medias: fileUpload
        }
        if(ckNPass){ dataSubmit.Password = pass; }
        dispatch(updateProfile(dataSubmit, relogin, history))
    }
    return (
        <>
            <Card className="position-relative">
                <CardBody>
                    <Row className="mb-4">
                        <Col className="justify-content-center d-flex">
                            {
                             showAvatar()
                            }
                            
                            <FileUploader 
                                ref={refUploaderProfile}
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
                            { editProfileState && <FloatingBtnUploadProfile onClick={onBtnUploadAvatarClick} of="#avatar-create-profile" /> }
                                <Button
                                    width={20}
                                    // height={'auto'}
                                    hint="Save"
                                    icon= {'save'}
                                    type="default"
                                    stylingMode="outlined"
                                    className="position-absolute"
                                    visible={editProfileState}
                                    style={
                                        {
                                         borderRadius:'50%',
                                         marginRight:'3px',
                                         top:'-15%', 
                                         right:'10%', 
                                         border:'hidden'
                                        }
                                    }
                                    onClick={() => { onSubmitUpdateProfile() }}
                                />
                                 <Button
                                    width={20}
                                    // height={'auto'}
                                    hint="Edit"
                                    icon= {editProfileState ? 'close' : 'edit'}
                                    type="default"
                                    stylingMode="outlined"
                                    className="position-absolute"
                                    style={
                                        {
                                         borderRadius:'50%',
                                         marginRight:'3px',
                                         top:'-15%', 
                                         right:'0', 
                                         border:'hidden'
                                        }
                                    }
                                    onClick={() => { dispatch(toggleProfileEdit(!editProfileState)) }}
                                />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm="12">
                         <Label for="fNameProfile" className="mb-0 text-muted font-size-11">First Name</Label>
                            <TextBox
                                id="fNameProfile"
                                name="fNameProfile"
                                value={fName}
                                maxLength={40}
                                valueChangeEvent="keyup"
                                readOnly={!editProfileState}
                                stylingMode='underlined'
                                showClearButton={true}
                                placeholder="First Name"
                                onValueChanged={(e) => setfName(e.value)} 
                            >
                             <Validator ref={refValidfName} >
                                <RequiredRule message="First Name is required" />
                             </Validator> 
                            </TextBox>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                           <Label for="lNameProfile" className="mb-0 text-muted font-size-11">Last Name</Label>

                            <TextBox
                                id="lNameProfile"
                                name="lNameProfil"
                                value={lName}
                                maxLength={40}
                                valueChangeEvent="keyup"
                                readOnly={!editProfileState}
                                showClearButton={true}
                                stylingMode='underlined'
                                placeholder="Last Name"
                                onValueChanged={(e) => setlName(e.value)} 
                            >
                             <Validator ref={refValidlName} >
                                <RequiredRule message="Last Name is required" />
                            </Validator> 
                          </TextBox>
                        </Col>
                    </Row>
                    <Row className="mb-2" >
                        <Col className="align-self-center">
                           <Label for="mailProfile" className="mb-0 text-muted font-size-11">Email</Label>

                            <TextBox 
                                ref = {refEmail}
                                name="mailProfile"
                                value={email}
                                showClearButton={true}
                                stylingMode='underlined'
                                placeholder="Email"
                                mode="email"
                                valueChangeEvent="keyup"
                                readOnly={!editProfileState}
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
                     
                        <Col >
                           <CheckBox 
                                value={ckNPass} 
                                readOnly={!editProfileState}
                                visible={editProfileState}
                                text="Change Password"
                                onValueChanged={(e) => { setckNPass(e.value); }}
                                style={{marginRight:'15px'}} /> 
                       
                            <TextBox 
                                name="newPasswordProfile"
                                defaultValue={pass}
                                showClearButton={true}
                                stylingMode='underlined'
                                placeholder="New Password"
                                mode={passMode}
                                valueChangeEvent="keyup"
                                disabled={ckNPass === false}
                                visible={ckNPass}
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
                        <Col>
                         <Label for="roleBadge" className="mb-0 text-muted font-size-11">Roles</Label>
                         <br />
                         {
                           map(roles, (el, key) => ( <span className="badge badge-soft-danger badge-pill font-size-14" style={{marginRight:'2%'}} key={'_role-badge'+key}>{el.roles.name}</span> ))
                         }
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                         <Label for="deptsBadge" className="mb-0 text-muted font-size-11">Departments</Label>
                          <br />
                         {
                           map(depts, (el, key) => ( <span className="badge badge-soft-success rounder-pill font-size-14" style={{marginRight:'2%'}} key={'_dept-badge'+key}>{el.departments.name}</span> ))
                         }
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}

export default React.memo(ProfileEditor)
