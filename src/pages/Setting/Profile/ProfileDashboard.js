import React, { useState, useEffect} from 'react'
import { map } from 'lodash'
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, CardBody, Label } from 'reactstrap'
import MiniCards from './MiniCard'
import ProfileDashboardTeams from './ProfileDashboardTeams'
import { getProfileTickets } from 'store/actions'
import isEmpty from 'helpers/isEmpty_helper'

function ProfileDashboard() {
    const dsProfileTickets = useSelector(state => state.users.dsProfileTickets)
    const dispatch = useDispatch()

    const [miniCards, setMiniCards] = useState([
        { id: 1, title: "My Tickets", iconClass: "mdi-ticket-account", text: "0", },
        { id: 2, title: "Solved Tickets", iconClass: "bx-check-circle", text: "0" },
        { id: 3, title: "Pending Tickets", iconClass: "bx-package", text: "0" },
      ])

      useEffect(() => {
            dispatch(getProfileTickets())
      }, [])

      useEffect(() => {
         if(dsProfileTickets && dsProfileTickets.length > 0){
             let reCount = [...miniCards]
             miniCards.forEach((v, i) => {
                    if(v.id === 1){ v.text = dsProfileTickets.length.toString() } 
                    else if(v.id === 2){
                        let solved = dsProfileTickets.filter(f => !isEmpty(f.solvedBy)).length;
                        v.text = solved.toString();
                    }
                    else if(v.id === 3){
                        let solved = dsProfileTickets.filter(f => !isEmpty(f.pendingBy)).length;
                        v.text = solved.toString();
                    }
             })
             setMiniCards( [...reCount] )
         }
      }, [dsProfileTickets])

    return (
        <>
            <Row>
                {map(miniCards, (card, key) => (
                  <MiniCards
                    title={card.title}
                    text={card.text}
                    iconClass={card.iconClass}
                    key={"_card_" + key}
                  />
                ))}
            </Row>
            <Row>
                <Col>
                    <ProfileDashboardTeams />
                </Col>
            </Row>

            
        </>
    )
}

export default React.memo(ProfileDashboard)
