import React, {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, CardBody, Label } from 'reactstrap'
import MiniCards from './MiniCard'
import { getDashTicket } from 'store/actions'
import { map } from 'lodash'
import isEmpty from 'helpers/isEmpty_helper'
import { ACTIVE_TAB_TYPE } from "store/tickets/actionTypes"



function TicketCount() {
    const dashTicket = useSelector(state => state.dash.dashTicket)
    const dispatch = useDispatch()
    const [miniCards, setMiniCards] = useState([
        { id: 1, title: "Total Tickets", iconClass: "mdi mdi-ticket-account", text: "0", url:ACTIVE_TAB_TYPE.ALL},
        { id: 2, title: "In Progress Tickets", iconClass: "mdi mdi-clipboard-text-search-outline", text: "0", url:ACTIVE_TAB_TYPE.INPROGRESS },
        { id: 3, title: "Solved Tickets", iconClass: "bx bx-check-circle", text: "0", url:ACTIVE_TAB_TYPE.RECENTLY_SOLVED },
      ])
    useEffect(() => {
        dispatch(getDashTicket())
    }, [])
    useEffect(() => {
        if(dashTicket && dashTicket.length > 0){
         let reCount = [...miniCards]
         miniCards.forEach((v, i) => {
                if(v.id === 1){ v.text = dashTicket.length.toString() } 
                else if(v.id === 2){
                    let solved = dashTicket.filter(f => f.status.id === 3).length;
                    v.text = solved.toString();
                }
                else if(v.id === 3){
                    let solved = dashTicket.filter(f => f.status.id === 5).length;
                    v.text = solved.toString();
                }
         })
         setMiniCards( [...reCount] )
         }
    }, [dashTicket])
    return (
        <>
               {map(miniCards, (card, key) => (
                  <MiniCards
                    title={card.title}
                    text={card.text}
                    iconClass={card.iconClass}
                    key={"_card_" + key}
                    url={card.url}
                    
                  />
                ))}
            
        </>
    )
}

export default React.memo(TicketCount)
