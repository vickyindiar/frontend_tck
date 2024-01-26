import React,  {useState, useEffect, useRef, useCallback}  from 'react';
import { Button as DxButton } from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DataGrid, { Column, Selection, Grouping, GroupPanel, Paging, Pager, ColumnFixing, SearchPanel, Scrolling, LoadPanel, HeaderFilter,  Toolbar, Item } from 'devextreme-react/data-grid';
import { useDispatch, useSelector } from "react-redux";
import Editor from './Editor';
import ReactDrawer from 'react-drawer';
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Button, Media, Badge, UncontrolledTooltip, Card, CardBody, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { maxBy, map } from 'lodash';
import { Link } from "react-router-dom"
import config from '../../config';
import isEmpty from '../../helpers/isEmpty_helper';
import { getActionList, getOptionList, setSelectedMultiRow,
         setSelectedSingleRow, updateTicketStatus, postTicketAssign,
         updateTicketAssignViewed,  
         getDBList, changeDBActive, getTickets} from 'store/actions';
import DataSource from "devextreme/data/data_source";

const allowedPageSizes = [5, 10, 'all'];
function GridView() {

    console.log('rendergrid')
    const dispatch = useDispatch()
    const activeUser = useSelector(state => state.Login.user)
    //const activeRole = useSelector(state => state.Login.activeRole)
    // const activeDept = useSelector(state => state.Login.activeDept)
    const dataTickets = useSelector(state => state.tickets.tickets)
    const actionList = useSelector(state => state.tickets.actionList)
    const optionList = useSelector(state => state.tickets.optionList)
    const dbList = useSelector(state => state.tickets.dbList)
    const sMultiRow = useSelector(state => state.tickets.selectedMultiRow)
    // const loadingFetch = useSelector(state => state.tickets.loadingFetch)
    // const [expandMode, setExpandMode] = useState(true);
    //toolbar state
    const [ tActionValue, setTActionValue ] = useState(null);
    const [ tOptionValue, setTOptionValue] = useState(null);
    const [ tOptionDisabled, setTOptionDisabled] = useState(true); 
    const [ tOptionPlaceHolder, setTOptionPlaceHolder] = useState("Select Option"); 
    const [ tDBValue, setTDBValue] = useState(null);

    //drawer editor
    const [editorOpen, seteEditorOpen] = useState(false);
    // const [popOverState, setpopOverState] = useState({target:null, show:false})

    const thisGrid = useRef(null);  
    useEffect(() => {
      dispatch(getActionList())
      dispatch(getDBList())
    }, [])

    useEffect(() => {
      if(!isEmpty(dbList)){
        let dbLocal = sessionStorage.getItem('_db')
        if(isEmpty(dbLocal)){
          let activeYear = dbList.find(f => f.active)
          setTDBValue(activeYear.value)
          sessionStorage.setItem("_db", activeYear.value)
          sessionStorage.setItem("_dbact", activeYear.active)
        }
        else{
          setTDBValue(dbLocal)
        }
      }
    }, [dbList])

    useEffect(() => {
      //remove  on next update
        if(localStorage.getItem('_db')){
          localStorage.removeItem('_db')
          localStorage.removeItem('_dbact')
        }
      //
      console.log('render useEffec dataTicket')
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let tid = params.get('tid');
      let isOpenEditor =  params.get('open');
      let dby = params.get('year');
      let localDby = sessionStorage.getItem('_db')
      if(tid && isOpenEditor && dataTickets.length > 0 && dby === localDby){
          let fTicket = dataTickets.find(f => f.id === parseInt(tid))
          if(!isEmpty(fTicket)){
            dispatch(setSelectedSingleRow(fTicket))
            let iKey = thisGrid.current.instance.getRowIndexByKey(parseInt(tid)) 
            thisGrid.current.instance.selectRowsByIndexes(iKey);
            seteEditorOpen(true);
          }
      }
      else if(tid && isOpenEditor && dby !== localDby){
        setTDBValue(dby);
      }
    }, [dataTickets])

    // useEffect(() => {
    //   if(loadingFetch) thisGrid.current.instance.beginCustomLoading();
    //   else thisGrid.current.instance.endCustomLoading();
    // }, [loadingFetch])

    const onActionChanged = useCallback((e) => {
        // thisGrid.current.instance.clearSelection();
        // thisGrid.current.instance.refresh(); 
       
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
  
    }, []);

    const onOptionChanged = useCallback((e) => {
        setTOptionValue(e.value);
        setTOptionPlaceHolder("Select Option")
        thisGrid.current.instance.updateDimensions()
    }, [])

    const onDBChanged = (e) => {
       if(isEmpty(dbList)){ return }
       setTDBValue(e.value);
       let isActive = dbList.find(f => f.value == e.value).active
       dispatch(changeDBActive(isActive))
       sessionStorage.setItem("_db", e.value)
       sessionStorage.setItem("_dbact", isActive)
       if(e.value && !isEmpty(activeUser)){
         dispatch(getTickets());
       }
    }

    const onGroupOptionRender = (e) => {
      if(e.hasOwnProperty('items') && e.items.length > 0){
          return e.items[0].maxRole
      }
    }

    const getDSOptionList = (data) => {
      if(!data.length) return data;
      if(tActionValue === "U"){
          const selectBoxDataSource = new DataSource({
            store: data,
            group: { selector: "maxRoleId", desc: false }
        });
        return selectBoxDataSource;
      }
      else { return data; }
    }

    const onEditorPreparing = (e) => {
      if (e.parentType === "searchPanel") {
          e.editorOptions.stylingMode = "underlined";
      }
    }

    const onEditorClose = () => { seteEditorOpen(false); }

    const onRowClickChanged = useCallback((e) =>{
      dispatch(setSelectedSingleRow(e.data))
      if(!tActionValue){ 
        //update status && viewed when status new
          if(e.data.ticketAssigns.length > 0){
            let mAssign = e.data.ticketAssigns.find(f => f.assignType === "M");
            if(e.data.status.id === 1 && mAssign.userId === activeUser.id){
              let body = [];
              body.push({ Id:e.data.id, StatId: 2 })
              dispatch(updateTicketStatus(body))
            
            }
            else {
              let uAssign = e.data.ticketAssigns.filter(f => f.assignType !== "M" && f.userId === activeUser.id);
              let body = [];
              uAssign.forEach(el => {
                body.push({ Id: el.id, TicketId: e.data.id, AssignType: el.assignType })
              });
              dispatch(updateTicketAssignViewed(body));
            }
          }
          seteEditorOpen(true);
        }
    },[])

    //disabled make checkbox multi selection weird
    const onRowSelectionChanged = (e) => {
         if(tActionValue) { thisGrid.current.instance.refresh(); } 
         dispatch(setSelectedMultiRow(e.selectedRowsData))
    }
    
    const onConfirmAction = () => {
    //  let body =[...sMultiRow];
      let row = thisGrid.current.instance.getSelectedRowsData()
      if(tActionValue === "T" || tActionValue === "U"){
        let body = [];
        row.forEach(e => {
          let item = {
            ticketId: e.id,
            teamId: tActionValue === "T" ? tOptionValue : null,
            userId: tActionValue === "U" ? tOptionValue : null, 
            assignType: tActionValue === "T" ? "T" : "U",
            viewed: false
          }
          body.push(item)

        });
        dispatch(postTicketAssign(body))
      }
      else if( tActionValue === "S" ){
        let body = [];
        row.forEach(e => {
          let item = { Id:e.id, StatId: tOptionValue }
          if(tOptionValue === 4){ item.PendingBy = activeUser.Id }
          else if(tOptionValue === 5){ item.SolvedBy = activeUser.Id; }
          else if(tOptionValue === 6){ item.RejectedBy = activeUser.Id; }
          body.push(item);
        });
        dispatch(updateTicketStatus(body))
      }
      thisGrid.current.instance.clearSelection();
      setTOptionValue(null);
      setTOptionPlaceHolder("Select Option")
      // thisGrid.current.instance.refresh(); 
    }

    const cellRender = useCallback((e) => {
      if(e.column.dataField === 'request'){
        let id = e.data.ticketType === "E" ? e.data.senders.id  : e.data.users.id;
        let fullName = e.data.ticketType === "E" ? e.data.senders.firstName + ' ' + e.data.senders.lastName : e.data.users.firstName + ' ' + e.data.users.lastName;
        let src = e.data.ticketType === "E" ?`${config.apiURL}media/sender/${e.data.senders.id}` : `${config.apiURL}media/user/${e.data.users.id}`;
        let email = e.data.ticketType === "E" ? e.data.senders.email  : e.data.users.email;
        let image = e.data.ticketType === "E" ? e.data.senders.image  : e.data.users.image;
        let color = e.data.ticketType === "E" ? e.data.senders.color  : e.data.users.color;
      
        if(image){
          return (
            <div className="media">
              <img className="d-flex me-3 rounded-circle" src={src} alt={fullName} height="36" />
              <Media className="chat-user-box" body>
                <p className="user-title m-0">{fullName}</p>
                <p className="text-muted">{email}</p>
              </Media>
            </div>
          )
        }
        else{
            return(
            <div className="media" id={"requestFrom" + id}>
              <div className="avatar-xs ">
                    <span className={ "avatar-title  me-3 d-flex rounded-circle text-white font-size-20" } style={{background:color, opacity:0.65 }} >
                      {fullName.charAt(0) + fullName.charAt(fullName.indexOf(' ') + 1) }
                    </span>
              </div>
              <Media className="chat-user-box" body style={{marginLeft:'1rem'}}>
                <p className="user-title m-0">{fullName}</p>
                <p className="text-muted">{email}</p>
              </Media>
            </div>
            )
        }
      }
      else if(e.column.dataField === 'status.name'){
        return(
          <Badge className={`me-2 ${e.data.status.desc}`}>
              {e.data.status.name}
          </Badge>
        )
      }
      else if(e.column.dataField === 'ticketType'){
        if(e.data.ticketType === "I"){
          return "Internal"
        }
        else{
          return "External"
        }
      }
      else if(e.column.dataField === 'modules.name'){
        return(
            <div>
                <h5 className="text-truncate font-size-14">
                {e.data.modules.name} 
              </h5>
              <p className="text-muted mb-0"> {e.data.apps.name} </p>
            </div>
        )
      }
      else if(e.column.dataField === 'assignee'){
        if (e.data.ticketAssigns.length === 0) return null;
        let lastAssign = maxBy(e.data.ticketAssigns, 'id');

          if(lastAssign.assignType === "T"){
            let teamMembers = lastAssign.team.teamMembers;
            let target = `row-team${lastAssign.team.id}`;
            return(
              <div>
                  <div to="#" id={target}>{lastAssign.team.name}</div>
              </div>
              )
          }
          else{
            return  lastAssign.users.fullName 
          }
      }
      else if(e.column.dataField === 'agencies.name'){
        if(e.data.groupAgencies !== null && e.data.agencies !== null){
          return(
            <div>
                <h5 className="text-truncate font-size-14">
                {e.data.groupAgencies.name} 
              </h5>
              <p className="text-muted mb-0"> {e.data.agencies.name} </p> 
            </div>
          )
        }
        else {
          return null
        }
      }
      else if(e.column.dataField === 'priorities.name'){
        if(e.data.priorities !== null){
          return(
            <Badge className={`me-2 ${e.data.priorities.desc}`}>
                {e.data.priorities.name}
            </Badge>
          )
        }
        else return null
  
      }
    }, []);

    const calcCellValue = useCallback((e, field) => {
      if(field === 'request'){
        let fullName = e.ticketType === "E" ? e.senders.firstName + ' ' + e.senders.lastName : e.users.firstName + ' ' + e.users.lastName;
        let email = e.ticketType === "E" ? e.senders.email  : e.users.email;
        return `${fullName} ${email}`;
      }
      else if(field === 'status.name'){
        return e.status.name
      }
      else if(field === 'modules.name'){
        return e.modules.name + e.apps.name 
      }
      else if(field === 'ticketType'){
        if(e.ticketType === "E" ){
          return "External"
        }
        else{
          return "Internal"
        }
      }
      else if(field === 'assignee'){
        if (e.ticketAssigns.length === 0) return null;
        let lastAssign = maxBy(e.ticketAssigns, 'id');
        if(lastAssign.assignType === "T"){ return lastAssign.team.name }
        else{ return  lastAssign.users.fullName }
      }
      else if(field === 'agencies.name'){
        if(e.groupAgencies !== null && e.agencies !== null){
          return e.groupAgencies.name + ' ' + e.agencies.name;
        }
        else return ''
      }
      else if(field === 'priorities.name'){
        if(e.priorities !== null && e.agencies !== null){
          return e.priorities.name;
        }
        else return ''
      }
    }, [])

    const onContentReady = useCallback((e) => {
      //e.component.selectRowsByIndexes(2);
      // console.log('on content ready')
      // let search = window.location.search;
      // let params = new URLSearchParams(search);
      // let tid = params.get('tid');
      // let isOpenEditor =  params.get('open');
      // let dby = params.get('year');
      // let localDby = sessionStorage.getItem('_db')
      // if(tid && isOpenEditor && dataTickets.length > 0 && dby === localDby){
      //     let fTicket = dataTickets.find(f => f.id === parseInt(tid))
      //     if(!isEmpty(fTicket)){
      //       dispatch(setSelectedSingleRow(fTicket))
      //       let iKey = thisGrid.current.instance.getRowIndexByKey(parseInt(tid)) 
      //       thisGrid.current.instance.selectRowsByIndexes(iKey);
      //       seteEditorOpen(true);
      //     }
      // }
      // debugger

    }, [])
    return (
        <div className="ticketing m-1">
             <DataGrid
                    ref={thisGrid}
                    id={'TcGridView'}
                    dataSource={ dataTickets }
                    keyExpr={'id'}
                    columnAutoWidth={true}
                    height= {"100%"}
                    width= {"100%"}
                    noDataText={' '}
                    // toolbar ={ onToolbarPreparing  }
                    onEditorPreparing = { onEditorPreparing }
                    showBorders={false}
                    showColumnLines= {false}
                    showRowLines={true}
                    allowColumnResizing={true}
                    onRowClick={onRowClickChanged }
                    // onSelectionChanged={onRowSelectionChanged}
                    onContentReady={onContentReady}
                    allowColumnReordering={true}
                 > 
                {/* <HeaderFilter visible={true} /> */}
                <Scrolling rowRenderingMode='virtual' />
                <Paging defaultPageSize={5} defaultPageIndex={0} />
                <Pager
                  visible={true}
                  allowedPageSizes={allowedPageSizes}
                  displayMode={'full'}
                  showPageSizeSelector={true}
                  showInfo={true}
                  showNavigationButtons={true} 
                />
                <Toolbar>
                    <Item location="before" locateInMenu="auto">
                      <SelectBox
                          width = {150}
                          placeholder = "Select Action"
                          items = {actionList}
                          value = {tActionValue}
                          showClearButton = {true}
                          stylingMode = "underlined"
                          displayExpr = 'text'
                          valueExpr = 'value'
                          onValueChanged = {onActionChanged}
                      />
                    </Item>
                    <Item location="before" locateInMenu="auto">
                     <SelectBox
                          width = {150}
                          disabled = {tOptionDisabled}
                          placeholder = {tOptionPlaceHolder}
                          dataSource = {getDSOptionList(optionList)}
                          value = {tOptionValue}
                          showClearButton = {true}
                          stylingMode = "underlined"
                          grouped = {tActionValue === 'U' ? true : false}
                          displayExpr = { (e) => { 
                            if(e){
                              if(tActionValue === 'U' ){ return e.firstName + ' ' + e.lastName }
                              else { return e.name }
                            }
                           }
                          }
                          valueExpr = "id"
                          onValueChanged = {onOptionChanged}
                          groupTemplate = {onGroupOptionRender}
                          searchEnabled = {true}
                          searchMode = 'contains'
                          searchExpr = {tActionValue === 'U' ? ['firstName', 'lastName'] : ['name']}
                          searchTimeout = {200}
                          minSearchLength = {0}
                          showDataBeforeSearch = {true}
                      />
                    </Item>
      
                    <Item location="after" locateInMenu="auto">
                      <DxButton
                        visible = {(tActionValue === "D" || ( tOptionValue !== null) )}
                        width = {150}
                        onClick = {() => { onConfirmAction()  }}
                        text = "Confirm"
                        icon = {tActionValue === 'D' ? 'trash' : ''}
                        type = "danger"
                        stylingMode = "outlined"
                        // disabled = { ( ! selectedRows.length > 0 )}
                      />
                    </Item>
                    <Item location="before" >
                      <SelectBox
                          width = {150}
                          placeholder = "Select Data"
                          items = {dbList}
                          value = {tDBValue}
                          showClearButton = {false}
                          stylingMode = "underlined"
                          displayExpr = 'text'
                          valueExpr = 'value'
                          onValueChanged = {onDBChanged}
                      />
                    </Item>
         
                    <Item name="columnChooserButton" />
                    <Item name="searchPanel" />
                  </Toolbar>
                <LoadPanel enabled={ true }  showPane={true}/>
                <GroupPanel visible={false} />
                {/* <Grouping autoExpandAll={expandMode}/> */}
                <SearchPanel visible={true} highlightCaseSensitive={false} searchVisibleColumnsOnly={true} stylingMode='underlined' />
                <Selection mode={tActionValue?"multiple":"single"}  selectAllMode={'allPages'} showCheckBoxesMode={'always'} allowSelectAll={true} />
                <ColumnFixing enabled={true} />
                <Column dataField="request" caption="REQUESTED BY" width={180} cellRender={cellRender}  calculateCellValue={(e) => { return calcCellValue(e, 'request') }} />
                <Column dataField="ticketNumber" caption= "NUMBER"    width={100}  cssClass= "row-vertical-align"  />
                <Column dataField="ticketType" caption= "TYPE" width={100}  cssClass= "row-vertical-align"  cellRender={cellRender} calculateCellValue={(e) => { return calcCellValue(e, 'assignee') }}/>
                <Column dataField="subject" caption= "SUBJECT" width={200} cssClass= "row-vertical-align"  />
                <Column dataField="assignee" caption= "ASSIGNEE" width={150} cssClass= "row-vertical-align" cellRender={cellRender}  alignment={'center'}  calculateCellValue={(e) => { return calcCellValue(e, 'assignee') }}/>
                <Column dataField="modules.name" caption= "MODULE" width={100} cssClass= "row-vertical-align" cellRender={cellRender} calculateCellValue={(e) => { return calcCellValue(e, 'modules.name') }} />
                <Column dataField="status.name" caption= "STATUS" width={100} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'status.name') }} />
                <Column dataField="agencies.name" caption= "AGENCY" width={150} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'agencies.name') }} />
                <Column dataField="priorities.name" caption= "Priority" width={150} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'priorities.name') }}  />
                <Column dataField="createdAt" caption= "CREATED" dataType="date" format="dd/MM/yyyy" width={100} cssClass= "row-vertical-align"  />
                <Column dataField="updatedAt" caption= "UPDATED" dataType="date" format="dd/MM/yyyy" width={100} cssClass= "row-vertical-align"  />
  
            </DataGrid>  
            {}
            <ReactDrawer className="ticket-editor" open={editorOpen} position={'right'} onClose={onEditorClose} >
               <Editor onClose={onEditorClose} />
            </ReactDrawer>
        </div>
    )
}
const areEqual = (prevProps, nextProps) => { 
  return true; };
export default React.memo(GridView, areEqual)
