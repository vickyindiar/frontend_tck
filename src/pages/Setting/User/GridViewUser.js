import React, { useEffect, useState } from 'react'
import DataGrid, { Button, Column, Editing, Paging, Lookup,  Selection, Grouping, GroupPanel,  Pager, ColumnFixing, SearchPanel, Scrolling, LoadPanel, HeaderFilter } from 'devextreme-react/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {getUsers} from '../../../store/actions';
import config from '../../../config';
import { toggleModalCreateUser,toggleModalEditUser, deleteUser} from '../../../store/actions';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import isEmpty from 'helpers/isEmpty_helper';

const allowedPageSizes = [5, 10, 'all'];

function GridViewUser() {
    const allUsers = useSelector(state => state.users.allUsers)
    const showModalCreate = useSelector(state => state.users.modalCreateUser)
    const showModalEdit = useSelector(state => state.users.modalEditUser)
    const [selectedRowEdit, setselectedRowEdit] = useState(null)
    const dispatch = useDispatch()

  
    useEffect(() => {
      dispatch(getUsers())
    }, [])

    const cellRender = (e) => {
      if(e.column.dataField === 'image'){
        if(e.data.image){
          return (
            <img className="img-thumbnail rounded-circle avatar-sm mt-md-0" alt={e.data.name} src={`${config.apiURL}media/user/${e.data.id}`} />
          )
        }
        else{
            return(
              <div className="avatar-sm">
                    <span className={ "avatar-title rounded-circle text-white font-size-18" } style={{background:e.data.color, opacity:0.65 }} >
                      {e.data.firstName.charAt(0) + e.data.lastName.charAt(0) }
                    </span>
              </div>
            )
        }
      }

    }

    const renderRole =(e)=> {
      let roles = [];  
      if(!isEmpty(e.data.userRoles)){
        e.data.userRoles.forEach(item => {
          roles.push(item.roles.name)
        });
      }
      if(!isEmpty(roles)){
        return roles.join();
      }
      else{
        return "";
      }
    }
    const renderDepartment = (e) => {
      let depts = [];  
      if(!isEmpty(e.data.userDepts)){
        e.data.userDepts.forEach(item => {
          depts.push(item.departments.name)
        });
      }
      if(!isEmpty(depts)){
        return depts.join();
      }
      else{
        return "";
      }
    }

    const onEditingStart = (e) => {
      e.cancel = true;
      setselectedRowEdit(e.data)
      dispatch(toggleModalEditUser(true))
    }
    const onRowRemoving = (e) => {
      e.cancel = true;
      dispatch(deleteUser(e.data.id))
    }
    

    const onToolbarPreparing = (e) => {
      e.toolbarOptions.items.unshift({
          location: 'before',
          widget: 'dxButton',
          visible: true,
          options: {
            width: 150,
            onClick: () => { dispatch(toggleModalCreateUser(true)) },
            text:'Create User',
            icon: 'plus',
            type:'default',
            stylingMode:'filled',
            disabled:false,
        }
      });
    }

    const onEditorPreparing = (e) => {
      if (e.parentType === "searchPanel") {
          e.editorOptions.stylingMode = "underlined";
      }
    }
 

    return (
        <>
        <DataGrid
          id="gridUser"
          dataSource={allUsers}
          keyExpr="id"
          columnAutoWidth={true}
          height= {"100%"}
          width= {"100%"}
          noDataText={'No Data !'}
          allowColumnReordering={true}
          showBorders={true}
          onToolbarPreparing={ onToolbarPreparing  }
          onEditingStart={onEditingStart}
          onRowRemoving={onRowRemoving}
          onEditorPreparing={onEditorPreparing}
        //   onRowRemoved={this.onRowRemoved}
          showBorders={false}
          showColumnLines= {false}
          showRowLines={true}
          allowColumnResizing={true}
        //   onEditCanceling={this.onEditCanceling}
        //   onEditCanceled={this.onEditCanceled}
          >

          <Paging defaultPageSize={5} defaultPageIndex={0} />
          <Pager
                  visible={true}
                  allowedPageSizes={allowedPageSizes}
                  displayMode={'full'}
                  showPageSizeSelector={true}
                  showInfo={true}
                  showNavigationButtons={true} 
          />
          <Editing
            mode="row"
            useIcons={true}
            allowUpdating={true}
            allowDeleting={true}
          />
          <Scrolling rowRenderingMode='virtual' />
          <SearchPanel visible={true} highlightCaseSensitive={true} searchVisibleColumnsOnly={true} />
          <Column dataField="image" caption="#" width={80} cellRender={cellRender} />
          <Column dataField="firstName" caption="First Name" width={120} />
          <Column dataField="lastName" caption="Last Name" width={120} />
          <Column dataField="email" caption="Email" width={250} />
          <Column dataField="roles" caption="Role" cellRender={ renderRole } />
          <Column dataField="depts" caption="Department" cellRender={ renderDepartment } />
          <Column dataField="createdAt" dataType="date" caption="Created At" width={130} />
          <Column type="buttons" width={150} caption="Action">
            <Button name="edit"  />
            <Button name="delete" type="danger"  cssClass={"btn-delete-user-grid"}  />
            {/* <Button hint="Info" icon="fas fa-user" cssClass={"btn-info-user-grid"}  /> */}
          </Column>
        </DataGrid>
        {
          showModalCreate && <CreateUserModal />
        }
        {
          showModalEdit && Object.keys(selectedRowEdit).length > 0 && <EditUserModal data={selectedRowEdit} />
        }
            
        </>
    )
}

export default React.memo(GridViewUser)
