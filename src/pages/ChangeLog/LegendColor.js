import React, {useState, useEffect} from 'react'
import { map } from 'lodash'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {Row, Col, Media} from 'reactstrap'
import { getCLogType } from 'store/clog/actions'

const LegendColor = () => {
    const dispatch = useDispatch()
    const cLogType = useSelector(state => state.clog.cLogType)
    useEffect(() => {
        dispatch( getCLogType())
    }, [])
    return (
        <>
        <Row>
            {
                cLogType && 
                map(cLogType, (type, index) => (
                    <Col key={`_LEGEND_COLOR_CLOG_${index}`}>
                        <Media>
                            <div className="avatar-xxs" id="avatar-legen-new">
                                <div className={ "avatar-title rounded-circle text-white font-size-12" } style={{background:type.color, opacity:0.65 }} >
                                    { type.name.charAt(0) }
                                </div> 
                            </div>
                            <p  style={{margin:'1px 0 0 3px'}}>{type.name}</p>
                        </Media>
                    </Col>
                ))
            }
        </Row>
        </>
    )
}

export default React.memo(LegendColor)
