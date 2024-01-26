import React, {useEffect} from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Card, CardBody, CardHeader, Media, Row, UncontrolledTooltip,  Col } from "reactstrap"
import { getProfileTeams } from 'store/actions'
import { useDispatch, useSelector } from 'react-redux'
import ProfileDashboardTeamCard from './ProfileDashboardTeamCard'

const ProfileDashboardTeams = () => {
    const dispatch = useDispatch()
    const dsProfileTeams = useSelector(state => state.users.dsProfileTeams)
    useEffect(() => {
       dispatch(getProfileTeams())
        
    }, [])
    return (
        <>
           <Card>
               <CardHeader>
                    <span> My Teams</span>
               </CardHeader>
               <CardBody style={{padding:'0.5rem'}}>
                <PerfectScrollbar>
                        <div style={{width:'200%'}}>
                         <Row>
                            <ProfileDashboardTeamCard teams={dsProfileTeams}/>
                         </Row>
                        </div>
                    </PerfectScrollbar>

               </CardBody>
            

            </Card>
        </>
    )
}

export default React.memo(ProfileDashboardTeams)
