import React from 'react'
import { isEmpty, size, map } from "lodash"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, Media, UncontrolledTooltip, Row} from "reactstrap"
import config from '../../../config'
import { Button } from 'devextreme-react/button';
import moment from "moment"
import {deleteTeam, toggleCardEditTeam} from '../../../store/actions';
import { useDispatch, useSelector } from 'react-redux'
import { confirm } from 'devextreme/ui/dialog';


function TeamCard({teams}) {

    return (
        <React.Fragment>
          
            {map(teams, (team, key) => {
                    return (
                        <Col xl="2" sm="2" key={key}>
                        <Card className="shadow-sm" style={{margin:'3px 3px 10px 3px' }}>
                        <CardBody style={{padding:'1rem'}}>
                            <Media>
                               {
                                    team.manager.image !== null ? 
                                    <React.Fragment key={'_team_leader_'+key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member" + team.id} >
                                            <img  alt={team.firstName} src={`${config.apiURL}media/user/${team.manager.id}`} className="rounded-circle avatar-sm me-2" />
                                            <UncontrolledTooltip placement="top" target={"member" + team.id} >
                                                { team.manager.firstName.charAt(0) + ' ' + team.manager.lastName.charAt(0)  }
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                    </React.Fragment>
                                    : 
                                    <React.Fragment key={'_team_leader_'+key}>
                                        <div className="avatar-sm me-2">
                                          <Link to="#" id={"member" + team.id} >
                                            <span className={ "avatar-title rounded-circle text-white  font-size-18" } style={{background:team.manager.color, opacity:0.65 }} >
                                                {team.manager.firstName.charAt(0) + ' ' + team.manager.lastName.charAt(0) }
                                            </span>
                                            <UncontrolledTooltip placement="top" target={"member" + team.id} >
                                            { team.manager.firstName+ ' ' + team.manager.lastName}
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                     
                                    </React.Fragment>
                                }
                             <Media className="overflow-hidden" body>
                                <h5 className="text-truncate font-size-13">
                                <Link to={`/teams-overview/${team.id}`} className="text-dark" >
                                    {team.name}
                                </Link>
                                </h5> 
                                {
                                    team.desc === '' ?
                                    ( <p className="text-muted mb-2"> &nbsp;</p>)
                                    :
                                    ( <p className="text-muted mb-2"> {team.desc}</p>)
                                }
                               
        
                                <div className="avatar-group">
                                {team.teamMembers.map((member, key) =>
                                 member.users.image !== null ? 
                                    <React.Fragment key={key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member" + member.users.id} >
                                            <img  alt={member.users.firstnAME} src={`${config.apiURL}media/user/${member.users.id}`}className="rounded-circle avatar-xs" alt="" />
                                            <UncontrolledTooltip placement="top" target={"member" + member.users.id} >
                                                { member.users.firstName + ' ' + member.users.lastName }
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                    </React.Fragment>
                                    : 
                                    <React.Fragment key={key}>
                                        <div className="avatar-group-item">
                                            <Link to="#" className="d-inline-block" id={"member" + member.users.id} >
                                                <div className="avatar-xs">
                                                <span className={ "avatar-title rounded-circle text-white font-size-18" } style={{background:member.users.color, opacity:0.65 }} >
                                                    {member.users.firstName.charAt(0) + member.users.lastName.charAt(0)}
                                                </span>
                                                <UncontrolledTooltip placement="top" target={"member" + member.users.id} >
                                                { member.users.firstName + ' ' + member.users.lastName }
                                                </UncontrolledTooltip>
                                                </div>
                                            </Link>
                                        </div>
                                        </React.Fragment>
                                    )
                                }
                                </div>
                            </Media>
                            </Media>
                        </CardBody>
                        <div className="px-2 py-1 border-top">
                            <ul className="list-inline mb-0">
                            <li className="list-inline-item me-2" id={'dueDate'+team.id}>
                                <i className="bx bx-calendar me-1" /> { team.updatedAt ? moment(team.updatedAt).format("DD-MM-YY") : moment(team.createdAt).format("DD-MM-YY")  }
                                <UncontrolledTooltip placement="top" target={'dueDate'+team.id}>
                                  { team.updatedAt ? 'Updated Date' : 'Created Date'  }  
                                </UncontrolledTooltip>
                            </li>
                            </ul>
                        </div>
                        </Card>
                    </Col>
                    )
                }
            )}
        
        </React.Fragment>
    )
}

export default React.memo(TeamCard)
