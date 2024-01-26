import React, {useState, useEffect, useRef, useCallback, useMemo }from 'react'
import { Badge, Card, CardBody, Col, Row, Media, UncontrolledTooltip, } from "reactstrap"
import { Link } from "react-router-dom"
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import randomColor from '../../../helpers/random_color_helper'
import DropDownBox from 'devextreme-react/drop-down-box'
import TreeView from 'devextreme-react/tree-view'
import { Validator, RequiredRule, CustomRule, EmailRule } from 'devextreme-react/validator'
import { Button } from 'devextreme-react/button';
import { Popover } from 'devextreme-react/popover';
import moment from "moment"
import { useDispatch, useSelector } from 'react-redux'
import { size } from 'lodash'
import { getTeamMember, getTeamManger, getUsers, postTeams } from 'store/actions'
import config from '../../../config'

const animationConfig = {
  show: { type: 'pop', from: { scale: 0 }, to: { scale: 1 } },
  hide: { type: 'fade', from: 1, to: 0 }
};

function NewTeamCardInput({onBtnCreateTeamClick}) {
    const dispatch = useDispatch()
    const allUsers = useSelector(state => state.users.allUsers)
    const dsTeamManagers = useSelector(state => state.users.dsTeamManagers)
    const dsTeamMembers= useSelector(state => state.users.dsTeamMembers)
    const [tName, settName] = useState("")
    const [tDesc, settDesc] = useState("")
    const refTMembersList = useRef(null);
    const refTManagerList = useRef(null);
    const [showPOverMember, setshowPOverMember] = useState(false)
    const [showPOverManager, setshowPOverManager] = useState(false)
    const [sManager, setsManager] = useState(null)
    const [sMembers, setsMembers] = useState(null)

    useEffect(() => {
      dispatch(getUsers())


    }, [])
    useEffect(() => {
      if(allUsers && size(allUsers) > 0){
        dispatch(getTeamManger(allUsers))
        dispatch(getTeamMember(allUsers))
      }
    }, [allUsers])


    const submitNewTeam = () => {
      let dataSubmit = {
        Name: tName,
        Desc: tDesc,
        ManagerId: sManager[0],
      }
      let membersObj = [];
      sMembers.forEach(f => {
        membersObj.push({UserId: f})
      })
      dataSubmit.Members = JSON.stringify(membersObj);
      dataSubmit.TeamMembers = membersObj;
      dispatch(postTeams(dataSubmit))
    }
   
    const ListMemberRender = () => {
        return (
          <div>
          <TreeView 
            dataSource={dsTeamMembers}
            ref={ refTMembersList }
            dataStructure="plain"
            keyExpr="id"
            // parentIdExpr="categoryId"
            searchEnabled={true}
            searchExpr={ (e) => { return e.firstName + ' ' + e.lastName} }
            selectionMode="multiple"
            showCheckBoxesMode="normal"
            selectNodesRecursive={false}
            displayExpr="name"
            selectByClick={true}
            onContentReady={syncTVMembersSelection}
            itemRender = { (e) => { return e.firstName + ' ' + e.lastName} }
            onItemSelectionChanged={(e) => {
                setsMembers(e.component.getSelectedNodeKeys())
            }}
          />
          </div>
        );
      }

    const ListManagerRender = () => {
        return (
        <div>
          <TreeView 
            dataSource={dsTeamManagers}
            ref={ refTManagerList }
            dataStructure="plain"
            keyExpr="id"
            // parentIdExpr="categoryId"
            searchEnabled={true}
            searchMode="contains"
            searchExpr={ (e) => { return e.firstName + ' ' + e.lastName} }
            selectionMode="single"
            showCheckBoxesMode="normal"
            selectNodesRecursive={false}
            displayExpr="name"
            itemRender = { (e) => { return e.firstName + ' ' + e.lastName} }
            selectByClick={true}
            onContentReady={syncTVManagerSelection}
            onItemSelectionChanged={(e) => {
                // setsManager(e.component.getSelectedNodeKeys())
            }}
          />
          </div>
        )
      } 

      const onCLosePopUpManager = () => {
        if(refTManagerList && refTManagerList.current){
          setsManager(refTManagerList.current.instance.getSelectedNodeKeys())
          setshowPOverManager(false)
        }
      }
 
      const syncTVManagerSelection = useCallback(
        (e) => {
          let treeView = (e.component.selectItem && e.component) || (refTManagerList && refTManagerList.current.instance);
          if (treeView) {
            if (e.value === null) {
              refTManagerList.current.instance.unselectAll();
            } else {
              let values = e.value || sManager;
              values && values.forEach(function(value) {
                if(refTManagerList.current){ refTManagerList.current.instance.selectItem(value) }
                else{ e.component.selectItem(value) }
              });
            }
          }
          if (e.value !== undefined) { setsManager(e.value) }
        },
        [], ) 
    
       
  
      const syncTVMembersSelection = (e) => {
        let treeView = (e.component.selectItem && e.component) || (refTMembersList && refTMembersList.current.instance);
        if (treeView) {
          if (e.value === null) {
            refTMembersList.current.instance.unselectAll();
          } else {
            let values = e.value || sMembers;
            values && values.forEach(function(value) {
                refTMembersList.current.instance.selectItem(value);
            });
          }
        }
    
        if (e.value !== undefined) { setsMembers(e.value) }
      }


      const managerButtonItem = () => {
          if(size(sManager) > 0 && dsTeamManagers && size(dsTeamManagers)> 0){
            let sManagerObj = dsTeamManagers.find(f => f.id === sManager[0])
            if( sManagerObj && size(Object.keys(sManagerObj)) > 0 && sManagerObj.image !== null ){

              return(
                <Link to="#" id="btnAddManager" onClick={() => {setshowPOverManager(true) }}>
                  <img  alt={sManagerObj.firstName} src={`${config.apiURL}media/user/${sManagerObj.id}`}  className="avatar-md me-4 rounded-circle" />
                  <UncontrolledTooltip placement="top" target={"#btnAddManager"} >
                    { 'Chose Manager Team..' }
                  </UncontrolledTooltip>
                        <Popover
                            target="#btnAddManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            onHiding={() => { onCLosePopUpManager() } }
                           // onHiding={() => {setshowPOverManager(false)  } }
                            contentRender={ListManagerRender }
                        />
                </Link>
                )
            }
            else{
                return(
                  <Link to="#" id="btnAddManager" onClick={() => {setshowPOverManager(true) }}>
                  <div className="avatar-md me-4">
                    <span className={ "avatar-title rounded-circle text-white  font-size-30" } style={{background:sManagerObj.color, opacity:0.65 }} >
                        {sManagerObj.firstName.charAt(0) + ' ' + sManagerObj.lastName.charAt(0) }
                    </span>
                    <UncontrolledTooltip placement="top" target={"#btnAddManager"} >
                    { 'Chose Manager Team..' }
                    </UncontrolledTooltip>
                        <Popover
                            target="#btnAddManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            onHiding={() => {onCLosePopUpManager() } }
                            contentRender={ListManagerRender }
                        />
                  </div>
                  </Link>
                )
            }
          }
          else{
           return ( <Link to="#" className="avatar-md me-4" id="btnAddManager">
                      <span className="avatar-title rounded-circle bg-light text-danger font-size-30">
                        <Button
                              width={50}
                              height={50}
                              icon="fas fa-user-plus fa-5x"
                              type="success"
                              stylingMode="outlined"
                              className="avatar-sm"
                              style={{borderRadius:'50%', border:'none'}}
                              onClick={() => { setshowPOverManager(true) }}
                        />
                      </span>
                      <UncontrolledTooltip placement="top" target={"#btnAddManager"} >
                          { 'Chose Manager Team..' }
                      </UncontrolledTooltip>
                        <Popover
                            target="#btnAddManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            onHiding={() => {onCLosePopUpManager() } }
                            contentRender={ListManagerRender }
                        />
                    </Link>
           )

          }
      }

    return (
        <>
            <Col xl="4" sm="6" key={"_key_create_1"}>
                <Card id="card-input-create-team">
                    <CardBody  >
                        <Media>
                        {
                            managerButtonItem()
                        }
                        <Media className="overflow-hidden" body>
                            <input
                                className="form-control font-size-15"
                                style={{border:'0', boxShadow: 'none', paddingTop:'0', paddingLeft:'0'}}
                                type="text"
                                value={tName }
                                onChange={ (e) => { settName(e.target.value) } }
                                placeholder="Team Name ..."
                            />
                            <p className="text-muted mb-4">
                                <input
                                    className="form-control form-control-small"
                                    style={{border:'0', boxShadow: 'none', padding:'0'}}
                                    type="text"
                                    value={tDesc }
                                    onChange={ (e) => {
                                       settDesc(e.target.value)
                                     } }
                                    placeholder="Team Description ..."
                                />
                            </p>

                            <div className="avatar-group">
                              {
                                  sMembers && size(sMembers) > 0  && 
                                  sMembers.map((id, key) => {
                                  let member = dsTeamMembers.find(f => f.id === id)
                                  return(
                                    member.image !== null ? 
                                      <React.Fragment key={key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member" + member.id} >
                                            <img  alt={member.firstnAME} src={`${config.apiURL}media/user/${member.id}`}className="rounded-circle avatar-sm" alt="" />
                                            <UncontrolledTooltip placement="top" target={"member" + member.id} >
                                                { member.firstName + ' ' + member.lastName }
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                      </React.Fragment>
                                    : 
                                       <React.Fragment key={key}>
                                        <div className="avatar-group-item">
                                            <Link to="#" className="d-inline-block" id={"member" + member.id} >
                                                <div className="avatar-sm">
                                                <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:member.color, opacity:0.65 }} >
                                                    {member.firstName.charAt(0) + member.lastName.charAt(0)}
                                                </span>
                                                <UncontrolledTooltip placement="top" target={"member" + member.id} >
                                                { member.firstName + ' ' + member.lastName }
                                                </UncontrolledTooltip>
                                                </div>
                                            </Link>
                                        </div>
                                        </React.Fragment>
                                    )
                                })
                              }



                                <div className="avatar-group-item" id="btnAddMembers">
                                    <Link to="#" className="d-inline-block" id={"linkAddMember"} >
                                        {/* <div className="avatar-xs">
                                        <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-1" } style={{background:'red', opacity:0.6 }} >
                                             <span className="fa-stack" >
                                                <i className="fas fa-users fa-stack-2x"></i>
                                                <i className="fas fa-plus fa-stack-1x ml-2" style={{top:'30%', left:'60%'}}></i>
                                            </span> 
                                        </span>
                                        </div> */}
                                        <Button
                                            width={50}
                                            height={50}
                                            icon="fas fa-users"
                                            type="success"
                                            stylingMode="outlined"
                                            className="avatar-sm"
                                            style={{borderRadius:'50%'}}
                                            onClick={() => { setshowPOverMember(true) }}
                                        />
                                           <UncontrolledTooltip placement="top" target={"linkAddMember"} >
                                              { 'Add more members..' }
                                          </UncontrolledTooltip>
                                    </Link>
                                </div>
                                <Popover
                                    target="#btnAddMembers"
                                    position="top"
                                    width={300}
                                    visible={showPOverMember}
                                    animation={animationConfig}
                                    onHiding={() => {setshowPOverMember(false) } }
                                    deferRendering={true}
                                    contentRender={ListMemberRender }
                                />
                             
                            </div>
                        </Media>
                           <Button
                              id={'btnSaveCreateTeam'}
                              width={30}
                              icon="check"
                              type="success"
                              stylingMode="outlined"
                              // style={{borderRadius:'50%', marginRight:'3px'}}
                              style={{ border:'none', marginRight:'-5px'}}
                              disabled={ !(tName !== '' && (sManager && sManager.length > 0) && ( sMembers && sMembers.length > 0)) }
                              onClick={() => { submitNewTeam() }}
                            />
                            <UncontrolledTooltip placement="top" target={"btnSaveCreateTeam"} >
                            { 'Save' }
                            </UncontrolledTooltip>
                            <Button
                                id={'btnCancelCreateTeam'}
                                width={30}
                                icon="close"
                                type="danger"
                                stylingMode="outlined"
                                // style={{borderRadius:'50%'}}
                                style={{  border:'none'}}
                                onClick={() => { onBtnCreateTeamClick(false) }}
                            />
                            <UncontrolledTooltip placement="top" target={"btnCancelCreateTeam"} >
                            { 'Cancel' }
                            </UncontrolledTooltip>
                        </Media>
                    </CardBody>
                    <div className="px-4 py-3 border-top">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item me-3" id="dueDate">
                            <i className="bx bx-calendar me-1" /> {moment().format("DD-MM-YY")}
                            <UncontrolledTooltip placement="top" target="dueDate">
                                Created Date
                            </UncontrolledTooltip>
                          </li>
                        </ul>
                    </div>
                    </Card>
                </Col>
              
                {/* <FloatingBtnCreate onClick={onBtnCreateTeamClick} of="#card-empty-create-team"/> */}
            
            </>
    )
}

export default React.memo(NewTeamCardInput)
