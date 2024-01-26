import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { isEmpty, map } from "lodash"
import moment from "moment"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { getClientTickets, changeClientActiveTicket, getDBList, changeDBActive} from "store/actions"
import { Link, useHistory } from "react-router-dom"
import SelectBox from 'devextreme-react/select-box';
import DataGrid, { Column, Selection, GroupPanel, Paging, Pager, ColumnFixing, SearchPanel, Scrolling, LoadPanel, HeaderFilter, Toolbar, Item} from 'devextreme-react/data-grid'
import { Media, Badge} from 'reactstrap';
import config from '../../../config';



const allowedPageSizes = [5, 10, 'all'];
function TicketList({searchValue , widthCon, thisGrid}) {
    const dispatch = useDispatch()
    const allTickets = useSelector(state => state.ticketsClient.allTickets)
    const activeTicket = useSelector(state => state.ticketsClient.activeTicket)
    const isAuthenticatedClient = useSelector(state => state.authClient.isAuthenticated) 
    const dbList = useSelector(state => state.tickets.dbList)
    const [filterdTickets, setfilterdTickets] = useState([])
    const [ tDBValue, setTDBValue] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if(isAuthenticatedClient){
            dispatch(getClientTickets())
            dispatch(getDBList())
        }
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
        if(!isEmpty(searchValue)){
            let filtered = allTickets.filter(f =>  f.ticketNumber.includes(searchValue) || f.subject.includes(searchValue)) 
            setfilterdTickets(filtered)
        }
        else{
            setfilterdTickets(allTickets)
        }
    
    }, [allTickets, searchValue])

    
    useEffect(() => {
       let selectedRowExist = filterdTickets.find(f => f.id === activeTicket);

       if(!isEmpty(filterdTickets) && isEmpty(selectedRowExist)){
           let id = filterdTickets[0].id
        dispatch(changeClientActiveTicket(id))
       }
    }, [filterdTickets])

    const onselectionchange =(id) => {
        dispatch(changeClientActiveTicket(id))
    }

    const cellRender = (e) => {
        if(e.column.dataField === 'request'){
          let id = e.data.senders.id;
          let fullName =  e.data.senders.firstName + ' ' + e.data.senders.lastName;
          let src = `${config.apiURL}media/sender/${e.data.senders.id}`;
          let email = e.data.senders.email;
          let image = e.data.senders.image;
          let color = e.data.senders.color;
        
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
    }


    const calcCellValue = (e, field) => {
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
    }
   
    const onEditorPreparing = (e) => {
      if (e.parentType === "searchPanel") {
          e.editorOptions.stylingMode = "underlined";
      }
    }

    const onDBChanged = (e) => {
      if(isEmpty(dbList)){ return }
      setTDBValue(e.value);
      let isActive = dbList.find(f => f.value == e.value).active
      dispatch(changeDBActive(isActive))
      sessionStorage.setItem("_db", e.value)
      sessionStorage.setItem("_dbact", isActive)
      if(e.value){
        dispatch(getClientTickets());
      }
    }

    return (
      <div className="chat-leftsidebar-nav">
        <div>
            <h5 className="font-size-14 mb-3">My Tickets</h5>
            {/* 
              <PerfectScrollbar style={{ height: "410px" }}>
                  {map(filterdTickets, ticket => (
                  <li key={ticket.id} className={ activeTicket === ticket.id ? "active" : "" } >
                      <a  onClick={(e) => { onselectionchange(ticket.id) } } >
                      <Media>
                          <div className="align-self-center me-3">
                          <i
                              className={
                                  !isEmpty(ticket.status) ? `mdi mdi-circle text-${ticket.status.desc.replace('bg-', '')} font-size-10`: "mdi mdi-circle font-size-10"
                              }
                          />
                          </div>
                          <div className="align-self-center me-3">
                          </div>

                          <Media className="overflow-hidden" body>
                          <h5 className="text-truncate font-size-14 mb-1"> {ticket.ticketNumber} </h5>
                          <p className="text-truncate mb-0"> {ticket.subject} </p>
                          </Media>
                          <div className="font-size-11"> { !isEmpty(ticket.createdAt) ? moment(ticket.createdAt).fromNow() : ''} </div>
                      </Media>
                      </a>
                  </li>
                  ))}
              </PerfectScrollbar>
            */}
            <DataGrid
                ref={thisGrid}
                id={'TcGridView'}
                dataSource={ allTickets }
                keyExpr={'id'}
                columnAutoWidth={true}
                height= {"100%"}
                width= {"100%"}
                noDataText={' '}
                showBorders={false}
                showColumnLines= {false}
                showRowLines={true}
                allowColumnResizing={true}
                onEditorPreparing={onEditorPreparing}
                onSelectionChanged={(e) => { onselectionchange(e.selectedRowKeys[0]) }}
                allowColumnReordering={true}
                // onRowClick={onRowClickChanged }
                // onContentReady={onContentReady}
              > 
                <HeaderFilter visible={true} />
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
                <SearchPanel visible={true} highlightCaseSensitive={false} searchVisibleColumnsOnly={true} />
                <Selection mode={"single"}  selectAllMode={'allPages'} allowSelectAll={false} />
                <ColumnFixing enabled={true} />
                <Column dataField="request" caption="REQUESTED BY" width={180} cellRender={cellRender} calculateCellValue={(e) => { return calcCellValue(e, 'request') }} />
                <Column dataField="ticketNumber" caption= "NUMBER" width={100} cssClass= "row-vertical-align" allowHeaderFiltering={false}>
                </Column>
                <Column dataField="subject" caption= "SUBJECT" width={200} cssClass= "row-vertical-align"  />
                {/* <Column dataField="modules.name" caption= "MODULE" width={100} cssClass= "row-vertical-align" cellRender={cellRender} calculateCellValue={(e) => { return calcCellValue(e, 'modules.name') }} /> */}
                <Column dataField="status.name" caption= "STATUS" width={100} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'status.name') }} />
                <Column dataField="agencies.name" caption= "AGENCY" width={150} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'agencies.name') }} />
                <Column dataField="priorities.name" caption= "Priority" width={150} cssClass= "row-vertical-align" cellRender={cellRender} alignment={'center'}   calculateCellValue={(e) => { return calcCellValue(e, 'priorities.name') }}  />
                <Column dataField="createdAt" caption= "CREATED" dataType="date" format="dd/MM/yyyy" width={100} cssClass= "row-vertical-align"  />
                <Column dataField="updatedAt" caption= "UPDATED" dataType="date" format="dd/MM/yyyy" width={100} cssClass= "row-vertical-align"  />
     
            </DataGrid>  
        </div>
      </div>
    )
}

export default React.memo(TicketList)
