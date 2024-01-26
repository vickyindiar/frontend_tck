import React, {useEffect, useState, useCallback, useRef} from 'react'
import DataGrid, { Button, Column, Editing, Popup, Form, SearchPanel} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { useSelector, useDispatch } from 'react-redux'
import { setChangesDetail, setEditRowKeyDetail, postAgency, putAgency, delAgency  } from 'store/actions';

const DetailTreeView = ({data}) => {
    const [ds, setDs] = useState([])
    const gridRef = useRef(null)


    const dispatch = useDispatch()
    const dsAgencies = useSelector(state => state.agency.dsAgencies)
    const changes = useSelector(state => state.agency.changes)
    const changesDetail = useSelector(state => state.agency.changesDetail)
    const editRowKeyDetail = useSelector(state => state.agency.editRowKeyDetail)

    function getTasks(key){
        return new DataSource({
          store: new ArrayStore({
            data: dsAgencies,
            key: 'id',
          }),
          filter: ['groupAgencyId', '=', key],
        });
      }
      const onToolbarPreparing = useCallback((e) => {
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            visible: true,
            options: {
              width: 150,
              onClick: (g) => { 
                if(gridRef){
                  gridRef.current.instance.addRow();
                  //if master grid expanded more than one row, button add on detail will be throw damn error..ahh
                  //for temp solution is master grid only able one row to expand
                  //see TreeView.js onRowExpanding 
                }
               },
              text:'Add Client',
              icon: 'plus',
              type:'default',
              stylingMode:'filled',
              disabled:false,
          }
        });
      }, []);
      const onEditorPreparing = (e) => {
        if (e.parentType === "searchPanel") {
            e.editorOptions.stylingMode = "underlined";
        }
      }

      const onSaving = useCallback((e, dsAgencies) => {
        e.cancel = true;
        switch (e.changes[0].type) {
          case 'insert':
            e.changes[0].data.groupAgencyId = data.data.id;
            dispatch(postAgency(e.changes[0]))
            break
          case 'update':
            let cData = e.component.getDataSource()._items.find(f => f.id === e.changes[0].key);
            cData.groupAgencyId = data.data.id;
            Object.keys(e.changes[0].data).forEach(d => {
              cData[d] = e.changes[0].data[d]
            });
            dispatch(putAgency(e.changes[0].key, cData))
            break
          case 'remove':
            e.changes[0].groupAgencyId = data.data.id;
            dispatch(delAgency(e.changes[0].key))
            break
          default:
            return null;
        }
      }, []);
  
      const onChangesChange = useCallback((changesDetail) => {
        dispatch(setChangesDetail(changesDetail))
      }, []);
    
      const onEditRowKeyChange = useCallback((editRowKeyDetail) => {
         dispatch(setEditRowKeyDetail(editRowKeyDetail))
      }, []);
      
      useEffect(() => {
        setDs(getTasks(data.key))
      }, [dsAgencies])

   
    return (
        <div>
            <DataGrid
                ref={gridRef}
                dataSource={ds}
                showBorders={true}
                columnAutoWidth={true}
                rowAlternationEnabled={true}
                onToolbarPreparing={onToolbarPreparing}
                onEditorPreparing={onEditorPreparing}
                onSaving={ (e, dsAgencies) =>{ onSaving(e, dsAgencies) }}
                // onCellPrepared = {onCellPrepared}
       
            >
              <Editing mode="popup"
                 allowUpdating={true}
                 allowAdding={false}
                 allowDeleting={true}
                 changes={changesDetail}
                 onChangesChange={onChangesChange}
                 editRowKey={editRowKeyDetail}
                 onEditRowKeyChange={onEditRowKeyChange}
              >
                  <Popup title="Client" showTitle={true} width={500} height={200}/>
                    <Form  > 
                          <Item dataField="name" caption='Name' editorOptions={{ stylingMode:'outlined' }} />
                          <Item dataField="domain" caption='Domain' editorOptions={{stylingMode:'outlined' }}/>
                    </Form>
              </Editing>
              <SearchPanel visible={true} highlightCaseSensitive={false} searchVisibleColumnsOnly={true} />
              <Column dataField="name" caption="Name"/>
              <Column dataField="domain" caption="Domain" />
              <Column type="buttons" width={150} caption="Action">
                    <Button name="edit"  />
                    <Button name="delete" type="danger"  cssClass={"btn-delete-user-grid"}  />
                    {/* <Button hint="Info" icon="fas fa-user" cssClass={"btn-info-user-grid"}  /> */}
              </Column>
            </DataGrid>
        </div>
    )
}

export default DetailTreeView
