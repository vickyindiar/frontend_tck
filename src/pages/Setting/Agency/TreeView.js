
import React, {useEffect, useCallback} from 'react';
// import { TreeList, Editing, Column, RequiredRule, Lookup, } from 'devextreme-react/tree-list';
import DataGrid, {Button, Column, MasterDetail, Editing, Popup, Form, SearchPanel} from 'devextreme-react/data-grid';
import DetailTreeView from './DetailTreeView';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { getGroupAgency, setChanges, setEditRowKey, postGroupAgency, putGroupAgency, delGroupAgency  } from 'store/actions';
import { useSelector, useDispatch } from 'react-redux'
  

const TreeView = () => {
    const dispatch = useDispatch()
    const changes = useSelector(state => state.agency.changes)
    const editRowKey = useSelector(state => state.agency.editRowKey)
    const dsGroupAgencies = useSelector(state => state.agency.dsGroupAgencies)

    useEffect(() => {
       dispatch(getGroupAgency()) 
      },
    [])

    const onToolbarPreparing = (e) => {
      e.toolbarOptions.items.unshift({
          location: 'before',
          widget: 'dxButton',
          visible: true,
          options: {
            width: 150,
            onClick: (g) => { 
              e.component.addRow();
             },
            text:'Add Group',
            icon: 'plus',
            type:'default',
            stylingMode:'filled',
            disabled:false,
        }
      });
    }

    const onSaving = useCallback((e) => {
      e.cancel = true;
      switch (e.changes[0].type) {
        case 'insert':
          dispatch(postGroupAgency(e.changes[0]))
          break
        case 'update':
          dispatch(putGroupAgency(e.changes[0].key, e.changes[0].data))
          break
        case 'remove':
          dispatch(delGroupAgency(e.changes[0].key))
          break
        default:
          return null;
      }
    }, []);
    const onEditorPreparing = (e) => {
      if (e.parentType === "searchPanel") {
          e.editorOptions.stylingMode = "underlined";
      }
    }

    const onChangesChange = useCallback((changes) => {
      dispatch(setChanges(changes))
    }, []);
  
    const onEditRowKeyChange = useCallback((editRowKey) => {
       dispatch(setEditRowKey(editRowKey));
    }, []);

    return (
        <div>
              <DataGrid id="grid-master-client" 
               dataSource={dsGroupAgencies} keyExpr="id"
               showBorders={false} 
               showColumnLines={true}
               repaintChangesOnly
               onSaving={onSaving}
               onToolbarPreparing={ onToolbarPreparing  }
               onEditorPreparing={onEditorPreparing}
               onRowExpanding = {  
                 (e) => {
                   e.component.collapseAll(-1);
                 }
                }
              >

                <MasterDetail
                  enabled={true}
                  component={DetailTreeView}
                />
                <Editing mode="popup" 
                  allowUpdating={true} 
                  allowAdding={false} 
                  allowDeleting={true}
                  changes={changes}
                  onChangesChange={onChangesChange}
                  editRowKey={editRowKey}
                  onEditRowKeyChange={onEditRowKeyChange}
                >
                <Popup title="Group" showTitle={true} width={500} height={200} />
                  <Form>
                        <Item dataField="name" caption={'Name'}  editorOptions={{stylingMode:'outlined'}}/>
                  </Form>
               </Editing>
               <SearchPanel visible={true} highlightCaseSensitive={false} searchVisibleColumnsOnly={true} />
                <Column dataField="number" caption="No" width={20}  />
                <Column dataField="name" caption="Group Agency"/>
                <Column type="buttons" width={150} caption="Action">
                  <Button name="edit"  />
                  <Button name="delete" type="danger"  cssClass={"btn-delete-user-grid"}  />
                  {/* <Button hint="Info" icon="fas fa-user" cssClass={"btn-info-user-grid"}  /> */}
                </Column>
            </DataGrid>
            
        </div>
    )
}

export default TreeView
