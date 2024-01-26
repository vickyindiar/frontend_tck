import React, {useState, useEffect} from 'react'
import { map } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import {Row, Col, Media} from 'reactstrap'
import { getCLogs } from 'store/clog/actions'
import Accordion from 'devextreme-react/accordion'
import moment from "moment"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import getImgUrl from 'helpers/url_image_helper'
import styled from 'styled-components'
import { Button } from 'devextreme-react/button'
import isEmpty from 'helpers/isEmpty_helper'
import CreateCLogModal from './CreateCLogModal'
import EditCLogModal from './EditCLogModal'
import { toggleModalEditCLog, deleteCLog, getApps, setAppActive } from 'store/actions'
import { confirm } from 'devextreme/ui/dialog'
import { useHistory } from 'react-router-dom'



const HoveredImg = styled.img`
&:hover {
    cursor: pointer;
  }
`

const CLogContent = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const filteredCLogs = useSelector(state => state.clog.filteredCLogs)
    const allCLogs = useSelector(state => state.clog.allCLogs)
    const showModalCreate = useSelector(state => state.clog.modalCreateCLog)
    const showModalEdit = useSelector(state => state.clog.modalEditCLog)
    const activeUser = useSelector(state =>  state.Login.user)
    const ruleVersion = useSelector(state => state.clog.ruleVersion)
    const dsApps = useSelector(state => state.misc.allApps)
    const [selectedRow, setselectedRow] = useState({})
    const [isGallery, setisGallery] = useState(0)
    const [photoIndex, setphotoIndex] = useState(0)
    const [nextSrc, setnextSrc] = useState('')
    const [prevSrc, setprevSrc] = useState('')
    const [depts, setdepts] = useState([])
    
    useEffect(() => {
        dispatch(getApps()) 
    }, [])
    
    
    useEffect(() => {
        if(!isEmpty(dsApps)){
            let loc = history.location.pathname;
            let app = dsApps.find(f => loc.includes(f.name.toLowerCase()));
            dispatch(setAppActive(app)) 
            dispatch(getCLogs(app.id))
        }
    }, [dsApps])



    useEffect(() => {
        if(!isEmpty(activeUser)){
            activeUser.dept.forEach(d => {
                setdepts([...depts, d.departmentId])
            });
        }
    }, [activeUser])

    const CustomTitle = (e) => {
        return(
                <p className="font-size-14" style={{margin:'-5px 0 0 3px'}}>{`${e.title}`}</p>
        )
    }
    const CustomItem = (e) => {
        const getNextSrc = (id) => {
            let cIndex = e.medias.findIndex((f) => { return f.id === id})
            if(!e.medias[cIndex + 1]){ return  getImgUrl('clog', false,e.medias[0].id)}
            return getImgUrl('clog', false, e.medias[cIndex + 1].id)
        }
        const getPrevSrc = (id) => {
            let cIndex = e.medias.findIndex((f) => { return f.id === id})
            if(!e.medias[cIndex - 1]){ return  getImgUrl('clog', false, e.medias[e.medias.length -1].id) }
            return getImgUrl('clog', false, e.medias[cIndex - 1].id)
        }

        const getNextId = () => {
            let cIndex = e.medias.findIndex((f) => { return f.id === photoIndex})
            if(!e.medias[cIndex + 1]){ return e.medias[0].id }
            return e.medias[cIndex + 1].id
        }
        const getPrevId = () => {
            let cIndex = e.medias.findIndex((f) => { return f.id === photoIndex})
            if(!e.medias[cIndex - 1]){ return e.medias[e.medias.length -1].id }
            return e.medias[cIndex - 1].id
        }

        return (
            <React.Fragment>
                {isGallery === e.id ? (
                    <Lightbox
                        mainSrc={ getImgUrl('clog', false, photoIndex)}
                        nextSrc={  nextSrc }
                        prevSrc={  prevSrc }
                        enableZoom={true}
                        onCloseRequest={() => { setisGallery(0) }}
                        onMovePrevRequest={() => {
                            setphotoIndex(getPrevId())
                        }}
                        onMoveNextRequest={() => {
                            setphotoIndex( getNextId() )
                        }}
                        // imageCaption={"Project " + parseFloat(photoIndex + 1)}
                     />
                ) : null}
                 <p className="text-muted" style={{margin:'1px 0 30px 3px'}} dangerouslySetInnerHTML={{__html: e.desc}} ></p>
                 {
                     e.medias && e.medias.length > 0 &&
                     <React.Fragment>
                     {/* <hr /> */}
                     <div className="popup-gallery d-flex flex-wrap">
                         {
                            map(e.medias, (img, key) => (
                                <div className="img-fluid float-left" key={`_IMG_CLOG_DETAIL_${key}`}>
                                     <HoveredImg src={ getImgUrl('clog', false, img.id)} onClick={() => { 
                                         setisGallery(e.id); 
                                         setphotoIndex(img.id);
                                         setnextSrc(getNextSrc(img.id));
                                         setprevSrc(getPrevSrc(img.id));
                                         }} alt="" width="120" />
                                </div>
                            ))
                         }
                     </div>
                     </React.Fragment>
                 }
            </React.Fragment>
        )
    }

    const onDeleteCLog = async(id) => {
        const confirmDelete = () => {
            dispatch(deleteCLog(id))
        }
        let result = await confirm("Are you sure you want to delete ?", "Confirm Delete");
        if(result){
            confirmDelete()
        }
    }

    const parseVersion = (v) => { //add point in version string
       let pVersion = '';
       let mRule = v.length < 13 ? 1 : 0; //handle mayor only 1 digit
       Object.keys(ruleVersion).forEach((e, i) => {
            let start = e === 'mayor' ? ruleVersion[e].start : ruleVersion[e].start - mRule;
            let end = ruleVersion[e].end - mRule; 
           if(i === Object.keys(ruleVersion).length - 1){ pVersion = pVersion + v.substring(start, end) }
           else {
             pVersion = pVersion + v.substring(start, end) + '.';
           }
       });
        return pVersion;
    }
 
    return (
        <>
            {
                filteredCLogs && 
                map(filteredCLogs, (clog, key) => (
                   <React.Fragment  key={`_CLOG_ITEM_${key}`}>
                    <Row className="mb-2">
                        <Col>
                            <div className="text-truncate font-size-16 mb-0" style={{marginLeft:'10px'}}>  
                                    <strong>{ clog.apps ? clog.apps.name : '' }</strong>
                                    { clog.version ? `   v${parseVersion(clog.version)}` : 'GENERAL UPDATE'}
                                    <Button
                                        width={20}
                                        hint="Edit"
                                        icon= {'edit'}
                                        type="default"
                                        stylingMode="outlined"
                                        visible={ depts.includes(1) || depts.includes(3) }
                                        style={
                                            {
                                                opacity:'0.75',
                                                borderRadius:'50%',
                                                marginRight:'3px',
                                                marginLeft:'10px',
                                                border:'hidden'
                                            }
                                        }
                                        onClick={() => { setselectedRow(clog);  dispatch( toggleModalEditCLog(true) ) }}
                                    />
                                    <Button
                                        width={20}
                                        hint="Delete"
                                        icon= {'trash'}
                                        type="danger"
                                        stylingMode="outlined"
                                        visible={ depts.includes(1) || depts.includes(3) }
                                        style={
                                            {
                                                opacity:'0.75',
                                                borderRadius:'50%',
                                                marginRight:'3px',
                                                border:'hidden'
                                            }
                                        }
                                        onClick={() => {  onDeleteCLog(clog.id) }}
                                    />

                            </div>
                        </Col>
                        <Col>
                            <p className="text-truncate mb-0 align-self-end d-flex justify-content-end" style={{marginRight:'10px'}}> 
                                <i className="bx bx-time-five align-self-center me-1" />
                                { clog.updatedAt ? moment(clog.updatedAt).format( "DD MMMM YYYY" ) : moment(clog.createdAt).format( "DD MMMM YYYY" ) }
                            </p>
                        </Col>
                    </Row>
                     <Row className="mb-4"> 
                        <Col>
                            <Accordion
                                dataSource={clog.cLogDetails}
                                collapsible={true}
                                multiple={true}
                                animationDuration={300}
                                // selectedItems={selectedItems}
                                defaultSelectedItem={[]}
                                // onSelectionChanged={this.selectionChanged}
                                itemTitleRender={CustomTitle}
                                itemRender={CustomItem}
                            />
                        </Col>
                      </Row>
            
                 
                   </React.Fragment>
                ))
            }
            {
                showModalCreate ?  < CreateCLogModal /> : null
            }
            {
                showModalEdit && selectedRow ?  < EditCLogModal data={selectedRow} /> : null
            }
        </>
    )
}

export default React.memo(CLogContent)
