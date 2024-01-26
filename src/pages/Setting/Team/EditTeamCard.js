import React, {useState, useEffect, useRef, useCallback }from 'react'
import { Badge, Card, CardBody, Col, Row, Media, UncontrolledTooltip, } from "reactstrap"
import { Link } from "react-router-dom"
import TreeView from 'devextreme-react/tree-view'
import { Button } from 'devextreme-react/button';
import { Popover } from 'devextreme-react/popover';
import moment from "moment"
import { useDispatch, useSelector } from 'react-redux'
import { size } from 'lodash'
import config from '../../../config'
import { toggleCardEditTeam, updateTeam, getTeamMember, getTeamManger, getUsers } from '../../../store/actions';


const animationConfig = {
    show: { type: 'pop', from: { scale: 0 }, to: { scale: 1 } },
    hide: { type: 'fade', from: 1, to: 0 }
  };

function EditTeamCard({team}) {
    const dispatch = useDispatch()
    const allUsers = useSelector(state => state.users.allUsers)
    const dsTeamManagers = useSelector(state => state.users.dsTeamManagers)
    const dsTeamMembers= useSelector(state => state.users.dsTeamMembers)
    const [tName, settName] = useState(team.name)
    const [tDesc, settDesc] = useState(team.desc)
    const refTMembersList = useRef(null);
    const refTManagerList = useRef(null);
    const [showPOverMember, setshowPOverMember] = useState(false)
    const [showPOverManager, setshowPOverManager] = useState(false)
    const [sManager, setsManager] = useState([team.managerId])
    const [sMembers, setsMembers] = useState([...team.teamMembers.map(a => a.userId)])

    useEffect(() => {
      dispatch(getUsers())
    }, [])

    useEffect(() => {
      if(allUsers && size(allUsers) > 0){
        dispatch(getTeamManger(allUsers))
        dispatch(getTeamMember(allUsers))
      }
    }, [allUsers])


    const submitEditTeam = (id) => {
      let dataSubmit = {
        Id: id,
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
      dispatch(updateTeam(dataSubmit))

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
        );
      }
      const onCLosePopUpManager = () => {
        if(refTManagerList && refTManagerList.current){
          setsManager(refTManagerList.current.instance.getSelectedNodeKeys())
          setshowPOverManager(false)
        }
      }

 
      const syncTVManagerSelection = (e) => {
        let treeView = (e.component.selectItem && e.component) || (refTManagerList && refTManagerList.current.instance);
        if (treeView) {
          if (e.value === null) {
            refTManagerList.current.instance.unselectAll();
          } else {
            let values = e.value || sManager;
            values && values.forEach(function(value) {
                if(refTManagerList.current){
                    refTManagerList.current.instance.selectItem(value)
                }
                else{
                    e.component.selectItem(value)
                }
            });
          }
        }
    
        if (e.value !== undefined) { setsManager(e.value) }
      }
  
      const syncTVMembersSelection = (e) => {
        let treeView = (e.component.selectItem && e.component) || (refTMembersList && refTMembersList.current.instance);
        if (treeView) {
          if (e.value === null) {
            refTMembersList.current.instance.unselectAll();
          } else {
            let values = e.value || sMembers;
            values && values.forEach(function(value) {
                if(refTMembersList.current) { refTMembersList.current.instance.selectItem(value) }
                else{ e.component.selectItem(value) }
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
                <Link to="#" id="btnChangeManager" onClick={() => {setshowPOverManager(true) }}>
                  <img  alt={sManagerObj.firstName} src={`${config.apiURL}media/user/${sManagerObj.id}`}  className="avatar-md me-4 rounded-circle" />
                  <UncontrolledTooltip placement="top" target={"#btnChangeManager"} >
                    { 'Chose Manager Team..' }
                  </UncontrolledTooltip>
                        <Popover
                            target="#btnChangeManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            // onHiding={() => {setshowPOverManager(false) } }
                            onHiding={() => { onCLosePopUpManager() } }
                            contentRender={ListManagerRender }
                        />
                </Link>
                )
            }
            else{
                return(
                  <Link to="#" id="btnChangeManager" onClick={() => {setshowPOverManager(true) }}>
                  <div className="avatar-md me-4">
                    <span className={ "avatar-title rounded-circle text-white  font-size-30" } style={{background:sManagerObj.color, opacity:0.65 }} >
                        {sManagerObj.firstName.charAt(0) + ' ' + sManagerObj.lastName.charAt(0) }
                    </span>
                    <UncontrolledTooltip placement="top" target={"#btnChangeManager"} >
                    { 'Chose Manager Team..' }
                    </UncontrolledTooltip>
                        <Popover
                            target="#btnChangeManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            // onHiding={() => {setshowPOverManager(false) } }
                            onHiding={() => { onCLosePopUpManager() } }
                            contentRender={ListManagerRender }
                        />
                  </div>
                  </Link>
                )
            }
          }
          else{
           return ( <Link to="#" className="avatar-md me-4" id="btnChangeManager">
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
                      <UncontrolledTooltip placement="top" target={"#btnChangeManager"} >
                          { 'Chose Manager Team..' }
                      </UncontrolledTooltip>
                        <Popover
                            target="#btnChangeManager"
                            position="top"
                            width={300}
                            visible={showPOverManager}
                            animation={animationConfig}
                            deferRendering={true}
                            // onHiding={() => {setshowPOverManager(false) } }
                            onHiding={() => { onCLosePopUpManager() } }
                            contentRender={ListManagerRender }
                        />
                    </Link>
           )

          }
      }


    return (
        <>
            <Col xl="4" sm="6" key={"_key_edit_1"}>
                <Card id="card-input-edit-team">
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
                                  dsTeamMembers && size(dsTeamMembers) > 0 &&
                                  sMembers.map((id, key) => {
                                 let member = dsTeamMembers.find(f => f.id === id)
                                 return(
                                    member.image !== null ? 
                                      <React.Fragment key={key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member_change" + member.id} >
                                            <img  alt={member.firstnAME} src={`${config.apiURL}media/user/${member.id}`}className="rounded-circle avatar-sm" alt="" />
                                            <UncontrolledTooltip placement="top" target={"member_change" + member.id} >
                                                { member.firstName + ' ' + member.lastName }
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                      </React.Fragment>
                                    : 
                                       <React.Fragment key={key}>
                                        <div className="avatar-group-item">
                                            <Link to="#" className="d-inline-block" id={"member_change" + member.id} >
                                                <div className="avatar-sm">
                                                <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:member.color, opacity:0.65 }} >
                                                    {member.firstName.charAt(0) + member.lastName.charAt(0)}
                                                </span>
                                                <UncontrolledTooltip placement="top" target={"member_change" + member.id} >
                                                { member.firstName + ' ' + member.lastName }
                                                </UncontrolledTooltip>
                                                </div>
                                            </Link>
                                        </div>
                                        </React.Fragment>
                                    )
                                })
                              }



                                <div className="avatar-group-item" id="btnChangeMembers">
                                    <Link to="#" className="d-inline-block" id={"linkChangeMember"} >
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
                                           <UncontrolledTooltip placement="top" target={"linkChangeMember"} >
                                              { 'Add more members..' }
                                          </UncontrolledTooltip>
                                    </Link>
                                </div>
                                <Popover
                                    target="#btnChangeMembers"
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
                              id={'btnSaveEditTeam'}
                              width={30}
                              icon="check"
                              type="success"
                              stylingMode="outlined"
                              style={{ border:'none', marginRight:'-5px'}}
                              // style={{borderRadius:'0px', border:'none', borderBottom:'2px solid', marginRight:'5px'}}
                              disabled={ !(tName !== '' && (sManager && sManager.length > 0) && ( sMembers && sMembers.length > 0)) }
                              onClick={() => { submitEditTeam(team.id) }}
                            />
                            <UncontrolledTooltip placement="top" target={"btnSaveEditTeam"} >
                            { 'Save' }
                            </UncontrolledTooltip>
                            <Button
                                id={'btnCancelEditTeam'}
                                width={30}
                                icon="close"
                                type="danger"
                                stylingMode="outlined"
                                style={{  border:'none'}}
                                // style={{  borderRadius:'0px', border:'none', borderBottom:'2px solid'}}
                                onClick={() => { dispatch(toggleCardEditTeam(false, null)) }}
                            />
                            <UncontrolledTooltip placement="top" target={"btnCancelEditTeam"} >
                            { 'Cancel' }
                            </UncontrolledTooltip>
                        </Media>
                    </CardBody>
                    <div className="px-4 py-3 border-top">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item me-3" id="dueDateChange">
                            <i className="bx bx-calendar me-1" /> {moment().format("DD-MM-YY")}
                            <UncontrolledTooltip placement="top" target="dueDateChange">
                                Updated Date
                            </UncontrolledTooltip>
                          </li>
                        </ul>
                    </div>
                    </Card>
                </Col>
              
                {/* <FloatingBtnEdit onClick={onBtnEditTeamClick} of="#card-empty-edit-team"/> */}
            
            </>
    )
}

export default React.memo(EditTeamCard)
