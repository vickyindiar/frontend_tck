import React from 'react'
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';


function FloatingBtnCreate({onClick, of}) {
    return (
        <SpeedDialAction
        icon="plus"
        position={ { my: "center", at: "center", of:of, offset:"4 4" }}//offset:{{ x:btnUpladOx , y:btnUpladOy }} }}
        onClick={()=> { onClick(true)  } } />
    )
}
const areEqual = (prevProps, nextProps) => { return true; };

export default React.memo(FloatingBtnCreate, areEqual)
