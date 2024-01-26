import React,{useState, useEffect } from 'react'
import { Button } from 'devextreme-react/button'
import { Row, Col, Label, Card, CardBody, Badge,  Media } from 'reactstrap'
import SimpleBar from "simplebar-react"
import { useDispatch, useSelector } from "react-redux";
import isEmpty from 'helpers/isEmpty_helper'
import { getEnhancement, getPriority, updatePriorityEnhance } from 'store/actions'
import SelectBox from 'devextreme-react/select-box'



const EditorBadge = () => {
    const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
    const activeUser = useSelector(state => state.Login.user)
    const activeDept = useSelector(state => state.Login.activeDept)
    const dsPriority = useSelector(state => state.tickets.dsPriority)
    const dsEnhancement = useSelector(state => state.tickets.dsEnhancement)

    const [enhCursorStyle, setenhCursorStyle] = useState('default')
    const [prioCursorStyle, setprioCursorStyle] = useState('default')
    const [editBadgeState, seteditBandgeState] = useState(false)
    const [newPriValue, setnewPriValue] = useState(null)
    const [newEnhValue, setnewEnhValue] = useState(null)

    const dispatch = useDispatch();

    const showPriority = () => {
        if(editBadgeState){
            return(
            <SelectBox 
                dataSource={dsPriority} 
                stylingMode="underlined" 
                label='Priority'
                labelMode='floating'
                showClearButton={false} 
                value={newPriValue} 
                displayExpr={"name"} 
                valueExpr={"id"} 
                onValueChanged={(e) => { 
                    setnewPriValue(e.value)
                }} 
             >
          </SelectBox>
            )
        }
        else{
            if(selectedSingleRow.priorities === null) { return null}
            else return(
            <Badge className={`me-2 ${selectedSingleRow.priorities.desc}`} style={{fontSize: 12}}>
                {selectedSingleRow.priorities.name}
            </Badge>
            )
        }
        
  
    }
    const showEnhancement = () => {
        if(editBadgeState && (activeUser.dept[0].departmentId === 3 || activeUser.dept[0].departmentId === 1) ){
            return(
                <SelectBox 
                    dataSource={dsEnhancement} 
                    // placeholder={'Enhancement'}
                    stylingMode="underlined" 
                    label='Enhancement'
                    labelMode='floating'
                    showClearButton={true} 
                    //stylingMode="underlined" 
                    value={newEnhValue} 
                    displayExpr={"name"} 
                    valueExpr={"id"} 
                    onValueChanged={(e) => { 
                        setnewEnhValue(e.value)
                    }} 
                >
              </SelectBox>
            )
        }
        else{
        if(selectedSingleRow.enhancements === null) { return null}
        else return(
        <Badge className={`me-2 ${selectedSingleRow.enhancements.desc}`} style={{fontSize: 12}}>
            {selectedSingleRow.enhancements.name}
        </Badge>
        )
        }
    }

    // useEffect(() => {
    //     if(!isEmpty(selectedSingleRow) &&  !isEmpty(activeUser)){
    //         let isAdmin = (activeUser.role.filter(f => f.roleId === 1).length > 0)
    //         let isCS = (activeUser.dept.filter(f => f.departmentId === 2).length > 0)
    //         let isPRG = (activeUser.dept.filter(f => f.departmentId === 3).length > 0)
    //         if(isAdmin || isPRG){ setenhCursorStyle('pointer')}
    //         if(isAdmin || isCS){ setprioCursorStyle('pointer')}
    //     }
    // }, [selectedSingleRow, activeUser])

    useEffect(() => {
        dispatch(getEnhancement()) 
        dispatch(getPriority())
      }, [])

    const onPriorityClick = () => {
    }
    const onEnhanceClick = () => {
    }
    const onSubmitBadge = () => {
        let body = [];
        let item = {
            Id: selectedSingleRow.id,
            PriorityId: newPriValue,
            EnhancementId: newEnhValue
        }
        body.push(item)
        dispatch(updatePriorityEnhance(item))
        seteditBandgeState(!editBadgeState) 
    }
    return (
        <>
         {
            !isEmpty(selectedSingleRow) && (
            <Card style={{marginBottom:'10px'}}>
            <CardBody>
                <SimpleBar style={{ maxHeight: "100px", marginTop:'10px' }}>
                        <Row className="no-padding no-marginlr">
                            <Col className="no-padding no-marginlr" xs="6">
                            { !editBadgeState && (<span className="text-muted">Priority</span>) }
                            </Col>
                            <Col className="no-padding no-marginlr" xs="6">
                             { !editBadgeState && (<span className="text-muted">Enhancement</span>) }
                            </Col>
                        </Row>
                        <Row className="no-padding no-marginlr">
                            <Col className="no-padding no-marginlr" xs="6" >
                                { showPriority() }
                            </Col>
                            <Col className="no-padding no-marginlr" xs="6" >
                                { showEnhancement() }
                            </Col>
                       </Row>
                </SimpleBar>
                <Button
                    width={10}
                    // height={'auto'}
                    hint="Save"
                    icon= {'save'}
                    type="default"
                    stylingMode="outlined"
                    className="position-absolute"
                    visible={editBadgeState}
                    style={
                        {
                            borderRadius:'50%',
                            marginRight:'3px',
                            top:'-2%', 
                            right:'10%', 
                            border:'hidden'
                        }
                    }
                    onClick={() => { onSubmitBadge() }}
                />
                <Button
                    width={10}
                    // height={'auto'}
                    hint="Edit"
                    icon= {editBadgeState ? 'close' : 'edit'}
                    type="default"
                    stylingMode="outlined"
                    className="position-absolute"
                    style={
                        {
                            borderRadius:'50%',
                            marginRight:'3px',
                            top:'-2%', 
                            right:'0', 
                            border:'hidden'
                        }
                    }
                    onClick={() => {
                         seteditBandgeState(!editBadgeState) 
                         if(selectedSingleRow.priorities !== null)
                            setnewPriValue(selectedSingleRow.priorities.id);
                         if(selectedSingleRow.enhancements !== null)
                            setnewEnhValue(selectedSingleRow.enhancements.id)   
                        }}
                />
            </CardBody>
        </Card>
         )
    }       
    </>
    )
}
const areEqual = (prevProps, nextProps) => { return true; };
export default React.memo(EditorBadge, areEqual) 
