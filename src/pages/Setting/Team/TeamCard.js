import React from 'react'
import { isEmpty, size, map } from "lodash"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, Media, UncontrolledTooltip, } from "reactstrap"
import config from '../../../config'
import { Button } from 'devextreme-react/button';
import moment from "moment"
import {deleteTeam, toggleCardEditTeam} from '../../../store/actions';
import { useDispatch, useSelector } from 'react-redux'
import EditTeamCard from './EditTeamCard'
import { confirm } from 'devextreme/ui/dialog';


function TeamCard({teams}) {
    const dispatch = useDispatch();
    const editMode = useSelector(state => state.users.cardEditTeam)
    const editTeamId =  useSelector(state => state.users.cardEditTeamId)
 //   const [doDelete, setdoDelete] = useState(false)


    // useEffect(() => {
    //     let result = confirm("<i>Are you sure?</i>", "Confirm changes");
    //     result.then((dialogResult) => {
    //         alert(dialogResult ? "Confirmed" : "Canceled");
    //     });
    // }, [doDelete])
    const onDeleteTeam = async(team) => {
        let result = await confirm("Are you sure?", "Confirm Delete Team");
        if(result){
            dispatch(deleteTeam(team.id))
        }
    }

    const onEditTeam = (id) => {
        dispatch(toggleCardEditTeam(true, id))
    }

    

    return (
        <React.Fragment>
            {map(teams, (team, key) => {
                if(editMode && team.id === editTeamId){
                    return ( <EditTeamCard team={team} key={'editing_team_card'+key}/>)
                }
                else{
                    return (
                        <Col xl="4" sm="6" key={key}>
                        <Card>
                        <CardBody>
                            <Media>
                               {
                                    team.manager.image !== null ? 
                                    <React.Fragment key={'_team_leader_'+key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member" + team.id} >
                                            <img  alt={team.firstName} src={`${config.apiURL}media/user/${team.manager.id}`} className="rounded-circle avatar-md me-4" />
                                            <UncontrolledTooltip placement="top" target={"member" + team.id} >
                                                { team.manager.firstName.charAt(0) + ' ' + team.manager.lastName.charAt(0)  }
                                            </UncontrolledTooltip>
                                            </Link>
                                        </div>
                                    </React.Fragment>
                                    : 
                                    <React.Fragment key={'_team_leader_'+key}>
                                   
                                        <Link to="#" className="avatar-md me-4" id={"member" + team.id}>
                                            <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-30" } style={{background:team.manager.color, opacity:0.65 }} >
                                                {team.manager.firstName.charAt(0) + ' ' + team.manager.lastName.charAt(0) }
                                            </span>
                                            <UncontrolledTooltip placement="top" target={"member" + team.id} >
                                             { team.manager.firstName + ' ' + team.manager.lastName }
                                            </UncontrolledTooltip>
                                        </Link>
                                    </React.Fragment>
                                }
                             <Media className="overflow-hidden" body>
                                <h5 className="text-truncate font-size-15">
                                <Link to={`/teams-overview/${team.id}`} className="text-dark" >
                                    {team.name}
                                </Link>
                                </h5> 
                                {
                                    team.desc === '' ?
                                    ( <p className="text-muted mb-4"> &nbsp;</p>)
                                    :
                                    ( <p className="text-muted mb-4"> {team.desc}</p>)
                                }
                               
        
                                <div className="avatar-group">
                                {team.teamMembers.map((member, key) =>
                                 member.users.image !== null ? 
                                    <React.Fragment key={key}>
                                        <div className="avatar-group-item" >
                                            <Link to="#" className="d-inline-block" id={"member" + member.users.id} >
                                            <img  alt={member.users.firstnAME} src={`${config.apiURL}media/user/${member.users.id}`}className="rounded-circle avatar-sm" alt="" />
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
                                                <div className="avatar-sm">
                                                <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:member.users.color, opacity:0.65 }} >
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
                                <Button
                                    width={30}
                                    icon="edit"
                                    type="default"
                                    stylingMode="outlined"
                                    style={{ border:'none', marginRight:'-5px'}}
                                    onClick={() => { onEditTeam(team.id) }}
                                    />
                                <Button
                                    width={30}
                                    icon="trash"
                                    type="danger"
                                    stylingMode="outlined"
                                    style={{  border:'none'}}
                                    onClick={() => { onDeleteTeam(team) }}
                                    />
                            </Media>
                        </CardBody>
                        <div className="px-4 py-3 border-top">
                            <ul className="list-inline mb-0">
                            <li className="list-inline-item me-3">
                                {/* <Badge className={"bg-" + team.color}>{team.status}</Badge> */}
                            </li>
                            <li className="list-inline-item me-3" id={'dueDate'+team.id}>
                                <i className="bx bx-calendar me-1" /> { team.updatedAt ? moment(team.updatedAt).format("DD-MM-YY") : moment(team.createdAt).format("DD-MM-YY")  }
                                <UncontrolledTooltip placement="top" target={'dueDate'+team.id}>
                                  { team.updatedAt ? 'Updated Date' : 'Created Date'  }  
                                </UncontrolledTooltip>
                            </li>
                            {/* <li className="list-inline-item me-3" id="comments">
                                <i className="bx bx-comment-dots me-1" />{" "}
                                {7}
                                <UncontrolledTooltip placement="top" target="comments">
                                Comments
                                </UncontrolledTooltip>
                            </li> */}
                            </ul>
                        </div>
                        </Card>
                    </Col>
                    )
                }
            } )}
        </React.Fragment>
    )
}

export default React.memo(TeamCard)
