import React from 'react'
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';


function FloatingBtnUpload({onClick, of}) {
    return (
        <SpeedDialAction
        icon="photo"
        position={ { my: "center", at: "right", of:of, offset:"4 4" }}//offset:{{ x:btnUpladOx , y:btnUpladOy }} }}
        onClick={()=> { onClick()  } } />
    )
}
const areEqual = (prevProps, nextProps) => { return true; };

export default React.memo(FloatingBtnUpload, areEqual)
