import React,{useState, useEffect } from 'react'
import { SelectBox } from 'devextreme-react/select-box'
import { Button } from 'devextreme-react/button'
import { Row, Col, Label, Card, CardBody } from 'reactstrap'
import SimpleBar from "simplebar-react"
import { getActionList, getOptionList, updateTicketStatus, postTicketAssign  } from 'store/actions';
import { useDispatch, useSelector } from "react-redux";
import { baseZIndex } from 'devextreme/ui/overlay';
import DataSource from "devextreme/data/data_source";
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box'
import TextArea from 'devextreme-react/text-area';




function EditorControl() {
   //toolbar state
   const dispatch = useDispatch()
   const actionList = useSelector(state => state.tickets.actionList)
   const optionList = useSelector(state => state.tickets.optionList)
   const selectedSingleRow = useSelector(state => state.tickets.selectedSingleRow)
   const dataTickets = useSelector(state => state.tickets.tickets)
   const [ showRejectReason, setshowRejectReason] = useState(false)
   const [ rejectReason, setrejectReason] = useState('')
   const [ tActionValue, setTActionValue ] = useState(null);
   const [ tOptionValue, setTOptionValue] = useState(null);
   const [ tOptionDisabled, setTOptionDisabled] = useState(true); 
   const [ tOptionPlaceHolder, setTOptionPlaceHolder] = useState("Select Option"); 

   useEffect(() => {

    dispatch(getActionList())
    baseZIndex(10000);
   }, [])

   const getDSOptionList = (data) => {
    if(!data.length) return data;
    if(tActionValue === "U"){
        const selectBoxDataSource = new DataSource({
          store: data,
          group: { selector: "maxRoleId", desc: false } //,
         // sort:  { selector: "maxRoleId", desc: false }
      });
      return selectBoxDataSource;
    }
    else {
        return data;
    }
  }

    const onActionChanged = (e) => {
        setTActionValue(e.value);

        setTOptionDisabled(false);
        if(!e.value){
          setTOptionDisabled(true);
          setTOptionValue(null);
          setTOptionPlaceHolder('Select Option')
        }
        else{ dispatch(getOptionList(e.value)); }
        if(e.value === "T"){ setTOptionPlaceHolder("Select Team") }
        else if(e.value === "U"){ setTOptionPlaceHolder("Select User") }
        else if(e.value === "S"){ setTOptionPlaceHolder("Select Status") }
      }


      const needRejectReason = (e) => {
          if(tActionValue === 'S' && e.value === 6){
            setshowRejectReason(true)
          }
      }

      const onRejectReasonHide = () => {
        setshowRejectReason(false)
      }

      const onOptionChanged = (e) => {
        needRejectReason(e)
        setTOptionValue(e.value);
        setTOptionPlaceHolder("Select Option")
    }

    const onConfirmAction = () => {
        if(tActionValue === "T" || tActionValue === "U"){
            let body = [];
            let item = {
                ticketId: selectedSingleRow.id,
                teamId: tActionValue === "T" ? tOptionValue : null,
                userId: tActionValue === "U" ? tOptionValue : null, 
                assignType: tActionValue === "T" ? "T" : "U",
                viewed: false
            }
            body.push(item)
            dispatch(postTicketAssign(body))
        }
        else if( tActionValue === "S" ){
            let body = [];
            let item = { 
                Id:selectedSingleRow.id, 
                StatId: tOptionValue
            }
            if(tOptionValue === 6){
                item.RejectedReason = rejectReason;
            }
            body.push(item)
            dispatch(updateTicketStatus(body))
            if(showRejectReason) { setshowRejectReason(false) }
        }
        setTActionValue(null);
        setTOptionValue(null);
    }
    const onGroupOptionRender = (e) => {
        if(e.hasOwnProperty('items') && e.items.length > 0){
            return e.items[0].maxRole
        }
    }

    const optionDelete = () => {
        if (tActionValue === "D" ){
            return (
                <Row className="no-padding mt-2 mb-4">
                    <Col xs="12" className="no-padding no-marginlr d-flex justify-content-center" >
                        <Button text={'Confirm'} icon={ 'trash' } type={ 'danger'} onClick= {() => {alert('x')}} />
                    </Col>
                </Row>
            )
        }
        if(tActionValue !== 'D'){
            return (    
                <>    
                <Row className="no-padding no-marginlr mb-4">
                    <Col xs="12" className="no-padding no-marginlr">
                    <SelectBox 
                      //  items={optionList}
                        dataSource={ getDSOptionList(optionList) }
                        valueExpr={'id'}
                        displayExpr={(e) => {
                            if(e){
                                if(tActionValue === "U") return  e.firstName + ' ' + e.lastName
                                else return e.name
                            }
                        }}
                        showClearButton={true}
                       // placeholder={tOptionPlaceHolder}
                        stylingMode="underlined" 
                        label={tOptionPlaceHolder}
                        labelMode='floating'
                        disabled={tOptionDisabled}
                        value={tOptionValue}
                        grouped={tActionValue === "U" ? true : false}
                        onValueChanged={onOptionChanged}
                        groupRender = { onGroupOptionRender }
                        searchEnabled={true}
                        searchMode={'contains'}
                        searchExpr={['firstName', 'lastName']}
                        searchTimeout={200}
                        minSearchLength={0}
                         showDataBeforeSearch={true}
                    />
                    </Col>
               </Row>
               {
                    showRejectReason && tActionValue === 'S' && tOptionValue === 6 &&
                    (
                        <Row>
                            <Col>
                                <TextArea
                                    height={100}
                                    value={rejectReason}
                                    valueChangeEvent={'keyup'}
                                    stylingMode="outlined"
                                    label={'Reject Reason'}
                                    labelMode={'floating'}
                                    onValueChanged={(e)=>{ setrejectReason(e.value) }}
                                />
                            </Col>
                        </Row>
                    )
               }
                <Row className="no-padding mt-2 mb-2">
                   <Col xs="12" className="no-padding no-marginlr d-flex justify-content-center" >
                       <Button text={'Confirm'} disabled={(tOptionValue === null)}  type={'danger'} onClick= {() => { onConfirmAction() }} />
                   </Col>
               </Row>
               </>
            )
        }
    }


    return (
        <>
            <Card style={{marginBottom:'10px'}}>
                <CardBody>
                    <SimpleBar style={{ maxHeight: "300px" }}>
                        <Row className="no-padding no-marginlr mb-4">
                            <Col className="no-padding no-marginlr" xs="12">
                                <SelectBox
                                    items={actionList}
                                    valueExpr={"value"}
                                    displayExpr={"text"}
                                    noDataText=''
                                    showClearButton={true}
                                   // placeholder="Select Action"
                                    stylingMode="underlined" 
                                    label={'Select Action'}
                                    labelMode='floating'
                                    value={tActionValue}
                                    onValueChanged={onActionChanged}
                                    
                                />
                            </Col>
                        </Row>
                       
                        {
                            optionDelete()
                        }
                    
               
                    </SimpleBar>
          
                </CardBody>
            </Card>
        </>
    )
}
const areEqual = (prevProps, nextProps) => { return true; };
export default React.memo(EditorControl, areEqual) 
