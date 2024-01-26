import React from 'react'

function NewTeamManagerList() {

    const syncTVManagerSelection = (e) => {
      let treeView = (e.component.selectItem && e.component) || (refTManagerList && refTManagerList.current.instance);
      if (treeView) {
        if (e.value === null) {
          refTManagerList.current.instance.unselectAll();
        } else {
          let values = e.value || sManager;
          values && values.forEach(function(value) {
              refTManagerList.current.instance.selectItem(value);
          });
        }
      }
      if (e.value !== undefined) { setsManager(e.value) }
    }

    return (
        <div>
            
        </div>
    )
}

export default React.memo(NewTeamManagerList)
