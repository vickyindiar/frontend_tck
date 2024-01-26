import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { Card, CardBody, Media, Row, UncontrolledTooltip,  Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import {  map } from "lodash"
import config from '../../config'
import { Link } from "react-router-dom"
import isEmpty from 'helpers/isEmpty_helper'



function EditorAssigns() {
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
    const [listAssign, setlistAssign] = useState([])

    useEffect(() => {
        if( !isEmpty(selectedSingleRow)){
            let result = [];
           // let getTeamAssign = selectedSingleRow.ticketAssigns.filter(f => f.assignType === "T");
            selectedSingleRow.ticketAssigns.forEach(assign => {
              if(assign.assignType === "M"){
                  result.push(assign)
              }
              else if(assign.assignType === "T"){
                result.push(assign)
              }
              else if(assign.assignType === "U"){
                // CODE FOR AUTO ASSIGN TO TEAM MEMBERS && HIDE USER ASSIGN IF TEAM ALREADY ASSIGNED
                // let userIsManagerTeam = getTeamAssign.filter(f => f.userId === assign.userId);
                // let userIsMemberTeam = getTeamAssign.filter(f => !isEmpty(f.team.teamMembers.filter(ff => ff.users.userId === assign.userId)));
                // if(isEmpty(userIsManagerTeam) && isEmpty(userIsMemberTeam)) {
                //     result.push(assign)
                // }
                result.push(assign)
              }
            });
            setlistAssign([...result]) 
        }
    }, [selectedSingleRow])

    return (
        <>
        <Card style={{marginBottom:'10px'}}>
             <CardBody>
                <div className="d-flex">
                  <div className="me-2"> <h5 className="card-title mb-2">Assignees</h5></div>
                </div>
                <SimpleBar style={{ maxHeight: "300px" }}>
                    <Row className="no-padding no-marginlr">
                        <Col className="no-padding no-marginlr" xs="12">
                            <div className="avatar-group">
                                {  !isEmpty(selectedSingleRow) && !isEmpty(listAssign) &&  map(listAssign, (assign, key) => (
                                assign.users.image || assign.users.image !== null ? 
                                <React.Fragment key={key}>
                                    <div className="avatar-group-item" >
                                   <a href="#" className="d-inline-block" id={"assign-key-" + assign.id} >
                                        <img src={`${config.apiURL}media/user/${assign.users.userId}`} className="rounded-circle avatar-xs" alt="" />
                                        <UncontrolledTooltip placement="bottom" target={"assign-key-" + assign.id} >
                                             {assign.assignType === "T" ? assign.team.name : assign.users.fullName}
                                         
                                        </UncontrolledTooltip>
                                   </a>
                                    </div>
                                    </React.Fragment>
                                : 
                                <React.Fragment key={key}>
                                    <div className="avatar-group-item">
                                       <a to="#" className="d-inline-block" id={"assign-key-" + assign.id} >
                                        <div className="avatar-xs">
                                            <span className={ "avatar-title rounded-circle text-white font-size-25" }  style={{background:assign.users.color, opacity:0.65 }} >
                                            {  
                                                assign.assignType === "T" ?
                                                assign.team.name.charAt(0) 
                                                :
                                                assign.users.fullName.charAt(0) + assign.users.fullName.charAt(assign.users.fullName.indexOf(' ') + 1) 
                                            }
                                            </span>
                                            <UncontrolledTooltip placement="top-end" target={"assign-key-" + assign.id} >
                                            { assign.assignType === "T" ?
                                                assign.team.name
                                                :
                                                assign.users.fullName
                                            }
                                            </UncontrolledTooltip>
                                        </div>
                                       </a>
                                    </div>
                                    </React.Fragment>
                                    )
                                )
                            }
                        
                            </div>
                        </Col>
                    </Row>
                </SimpleBar>
            </CardBody>
        </Card>
    </>
    )
}

export default React.memo(EditorAssigns)
