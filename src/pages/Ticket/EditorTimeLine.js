import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import LiVerticalTimeline from "./EditorTimeLineItem"

import {
  Card,
  CardBody,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap"

//SimpleBar
import SimpleBar from "simplebar-react"
import isEmpty from "helpers/isEmpty_helper"


function EditorTimeLine() {
  const [stat, setStat] = useState(null);
  const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)

  const getInProgressTimeAt = () => {

    const getFirstResponse = () => {
      let result = null;
      let firstResponse = null;
      let firstAsign = null;
      if(!isEmpty(selectedSingleRow)){
        //find first response
        if(!isEmpty(selectedSingleRow.ticketDetails)){
          let fResponse = selectedSingleRow.ticketDetails.find(f => !isEmpty(f.users) && f.users.email !== selectedSingleRow.createdBy)
          if(!isEmpty(fResponse)){
            firstResponse = fResponse.createdAt;
          }
        }

        //find first assign 
        let fAssign = selectedSingleRow.ticketAssigns.filter(e => e.assignType !== 'M');
        if(fAssign.length > 0){
          firstAsign = fAssign[0].teamAt !== null ? fAssign[0].teamAt : fAssign[0].userAt;
        }

        if(firstResponse && firstAsign){
          result = new Date(firstResponse) > new Date(firstAsign) ? firstAsign : firstResponse
        }
        else{
          result = firstResponse ? firstResponse : firstAsign;
        }
      }
      return result;
    }
    let result = null;
    if(selectedSingleRow.status.id === 4){ result = selectedSingleRow.pendingAt; }
    else if(selectedSingleRow.status.id === 3) { 
      result = getFirstResponse()
    }
  
    return result;
  }
  
  const getOpenTimeAt = () => {
    let f = selectedSingleRow.ticketAssigns.filter(e => e.assignType === 'M');
    let result = null;
    if(f.length > 0){
      result = f[0].viewedAt;
    }
    return result;
  }

  useEffect(() => {
    if( Object.keys(selectedSingleRow).length > 0){

      const newAt = selectedSingleRow.createdAt;
      const openAt = getOpenTimeAt() // find viewed by Leader
      const progAt = getInProgressTimeAt(); //find first comment from users 
      const doneAt = selectedSingleRow.cancelBy ? selectedSingleRow.cancelAt : selectedSingleRow.solvedBy ? selectedSingleRow.solvedAt : selectedSingleRow.rejectedAt;
      const activeAt =  doneAt? 'solvedAt' : (progAt ? 'progAt' : (openAt ? 'openAt' : 'newAt' ) );
      setStat([
        {id: 1, iconClass:'bx-copy', statusTitle:'New', description : newAt, isActive: activeAt === 'newAt'? true: false, reason: '' },
        {id: 2, iconClass:'bx-envelope-open', statusTitle:'Open', description:openAt ? openAt : '', isActive: activeAt === 'openAt'? true: false, reason: ''},
        {id: 3, iconClass:'bx-rotate-left', statusTitle: selectedSingleRow.status.id === 4 ? 'Pending' : 'InProgress', description:progAt ? progAt : '', isActive: activeAt === 'progAt'? true: false, reason: '' },
        {id: 4, iconClass:'bx-badge-check', statusTitle: selectedSingleRow.status.id === 7 ? 'Cancel' : selectedSingleRow.rejectedBy ? 'Rejected' : 'Solved' , description:doneAt ? doneAt : '', isActive: activeAt === 'solvedAt'? true: false, reason: selectedSingleRow.rejectedReason ? selectedSingleRow.rejectedReason :'' },
      ])
    
    }
  }, [selectedSingleRow])
    return (
        <React.Fragment>
            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="me-2"> <h5 className="card-title mb-2">Progress</h5></div>
                </div>
                <SimpleBar style={{ maxHeight: "235px" }}>
                  <div className="mt-2">
                    <ul className="verti-timeline list-unstyled">
                        {
                          stat && stat.map(e =>{
                              return(<LiVerticalTimeline props={e} key={`status-timeline ${e.id}`} />)
                          })  
                        }
                    </ul>
                  </div>
                </SimpleBar>
              </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default EditorTimeLine
