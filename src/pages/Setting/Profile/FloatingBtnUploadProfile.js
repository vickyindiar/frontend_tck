import React from 'react'
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { useSelector } from 'react-redux'


function FloatingBtnUploadProfile({onClick, of }) {
    const leftMenu = useSelector(state => state.Layout.leftMenu) //refresh purpose when navigation collapse or expand : dont remove this
    return (
        <SpeedDialAction
            visible ={true}
            icon="photo"
            position={ { my: "center", at: "top right", of:of, offset:"0 0" }}
            onClick={()=> { onClick()  } } 
        />
    )
}
const areEqual = (prevProps, nextProps) => { return true; };

export default React.memo(FloatingBtnUploadProfile, areEqual)
