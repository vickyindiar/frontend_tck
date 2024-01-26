import React, {useCallback} from 'react'
import { Badge, Card, CardBody, Col, Row, Media, UncontrolledTooltip, } from "reactstrap"
import { Link } from "react-router-dom"
import FloatingBtnCreate  from './FloatingBtnCreate'



function NewTeamCard({onBtnCreateTeamClick}) {
    return (
        <React.Fragment>
            <Col xl="4" sm="6" key={"_key_create_1"}>
                <Card id="card-empty-create-team">
                    <CardBody  style={{visibility:'hidden'}} >
                        <Media>
                        <React.Fragment key={'_team_leader_1'}>

                        <div className="avatar-md me-4">
                      {/* style={{visibility:'hidden'}} */}
                                <span className="avatar-title rounded-circle bg-light text-danger font-size-30">
                                {/* <img src={team.image} alt="" height="30" /> */}
                                {'y'}
                                </span>
                        </div>
                        </React.Fragment>

                        <Media className="overflow-hidden" body>
                            <h5 className="text-truncate font-size-15">
                            <Link to={`#`} className="text-dark" >
                                {'TEAM CS 1'}
                            </Link>
                            </h5>
                            <p className="text-muted mb-4">{'descccc for team'}</p>

                            <div className="avatar-group">
                            <React.Fragment>
                                <div className="avatar-group-item">
                                    <Link to="#" className="d-inline-block" id={"member_1"} >
                                        <div className="avatar-xs">
                                        <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:'red', opacity:0.6 }} >
                                            {'yy'}
                                        </span>
                                        </div>
                                    </Link>
                                </div>
                                </React.Fragment>
                                <div className="avatar-group-item">
                                    <Link to="#" className="d-inline-block" id={"member_1"} >
                                        <div className="avatar-xs">
                                        <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:'red', opacity:0.6 }} >
                                            {'xx'}
                                        </span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="avatar-group-item">
                                    <Link to="#" className="d-inline-block" id={"member_1"} >
                                        <div className="avatar-sm">
                                        <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:'red', opacity:0.6 }} >
                                            {'xx'}
                                        </span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="avatar-group-item">
                                    <Link to="#" className="d-inline-block" id={"member_1"} >
                                        <div className="avatar-sm">
                                        <span className={ "avatar-title rounded-circle" + " text-white " + " font-size-18" } style={{background:'red', opacity:0.6 }} >
                                            {'xx'}
                                        </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Media>
                        </Media>
                    </CardBody>
                    <div className="px-4 py-3">
                        <ul className="list-inline mb-0">
                        <li className="list-inline-item me-3">
                        </li>
                        <li className="list-inline-item me-3" id="dueDate-empty">
                            {/* <i className="bx bx-calendar me-1" /> {} */}
                        </li>
                        </ul>
                    </div>
                    </Card>
                </Col>
                <FloatingBtnCreate onClick={(e) => {onBtnCreateTeamClick(e)}} of="#card-empty-create-team"/>

            
            </React.Fragment>
        // <React.Fragment>
        //     <Col xl="4" sm="6">
        //         <Card>
        //             <CardBody style={{height:'200px'}} >
        //                 <div className="d-flex justify-content-center ">
                        
        //                   <button type="button" className="btn btn-success align-self-center" style={{borderRadius:'50%', padding:'5%'}} >
        //                     <span className="fa-stack" >
        //                         <i className="fas fa-users fa-stack-2x"></i>
        //                         <i className="fas fa-plus fa-stack-1x ml-2" style={{top:'30%', left:'60%'}}></i>
        //                     </span>
        //                   </button>
        //                   <br />
        //                   Add Team . .
        //                 </div>
                  
        //             </CardBody>
        //         </Card>
        //     </Col>
        // </React.Fragment>
    )
}

export default React.memo(NewTeamCard)
