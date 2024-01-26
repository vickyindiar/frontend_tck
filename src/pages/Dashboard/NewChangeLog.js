import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Card, CardBody, CardHeader, Media} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import isEmpty from 'helpers/isEmpty_helper';
import getImgUrl from '../../helpers/url_image_helper'
import Lightbox from "react-image-lightbox"
import SimpleBar from "simplebar-react"
import { getlatestCLog } from 'store/actions'
import { Link, withRouter } from "react-router-dom"

import moment from "moment"



const NewChangeLog = () => {
    const latestClog = useSelector(state => state.clog.latestClog)
    const ruleVersion = useSelector(state => state.clog.ruleVersion)
    const [cSrc, setcSrc] = useState('')

    const [openLightBox, setopenLightBox] = useState(false)


    const dispatch = useDispatch()

    const parseVersion = useCallback((v) => {
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
        },
    [], )

    useEffect(() => {
        dispatch(getlatestCLog())
        
    }, [])

    useEffect(() => {
        //all this code for open image preview react-image-lightbox purpose
         if( !isEmpty(latestClog) ){
            if(latestClog.cLogDetails[0].desc.includes('<img')){
                let p = document.getElementById('dashboard_clog_details');
                let imglist = p.getElementsByTagName('img');
                for (let i = 0; i < imglist.length; i++) {
                    imglist[i].addEventListener("click", () => {
                        setopenLightBox(true);
                        setcSrc(imglist[i].src)
                    });
                }
            }
         }
    }, [latestClog])
    return (
        <div>
        {  !isEmpty(latestClog) && 
            <Card>
                <CardHeader>
                    <h2  className="card-title mb-4">What's New</h2>
                    <Media>
                        <div className="avatar-lg me-4">
                                {
                                    !isEmpty(latestClog.apps) ?
                                    (
                                        <span className="avatar-title rounded-circle bg-light p-2">
                                             <img className ="image-thumbnail image-fluid" src={ getImgUrl('apps', false, latestClog.apps.id) } alt="" height="75" />
                                         </span>
                                    )
                                    :
                                    ( 
                                        <span className="avatar-title rounded-circle bg-light">
                                            <i className={ "mdi mdi-update" } style={{fontSize:'80px', color:'deepskyblue'}}  />
                                         </span>
                                    ) 
                                }
                        </div>
                        <Media body>
                        <Link to={`/admin/changelog/sysadxx`}> <h5 className="font-size-15"><strong>{ latestClog.version ? 'v'+parseVersion(latestClog.version) : 'GENERAL UPDATE' }</strong></h5>  </Link>
                                {latestClog.cLogDetails[0].title}

                            <div className="float-end">
                            <p className="text-muted mb-0">
                                <i className="mdi mdi-account me-1" /> {latestClog.users.firstName}
                            </p>
                            </div>
                            <p className="text-muted mb-0"> {moment(latestClog.createdAt).format( "DD MMM, YYYY HH:mm" ) }</p>
                        </Media>
                    </Media>
                </CardHeader>
            <CardBody>
                <SimpleBar style={{ height: "300px" }}>
                  <p className="" style={{margin:'1px 0 30px 3px'}} id={`dashboard_clog_details` }  dangerouslySetInnerHTML={{__html: latestClog.cLogDetails[0].desc}} ></p>
                </SimpleBar>
                {
                            openLightBox  ? (
                               <Lightbox
                                    mainSrc={cSrc}
                                    enableZoom={true}
                                    onCloseRequest={() => { setopenLightBox(false) }}
                                    reactModalStyle={{'z-index':1000005}}
                                />
                            ) : null
                 }
            </CardBody>
            </Card>
        }
        </div>
    )
}

export default NewChangeLog
