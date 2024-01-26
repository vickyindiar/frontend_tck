import React from 'react'
import { map } from "lodash"
import {Card, Col } from "reactstrap"
import xls from '../../../assets/images/file_format/xls.png'
import doc from '../../../assets/images/file_format/doc.png'
import pdf from '../../../assets/images/file_format/pdf.png'
import zip from '../../../assets/images/file_format/zip.png'
import config from '../../../config'
import getImgUrl from '../../../helpers/url_image_helper'


function TicketResponseAttach({data, forheader, openImage, setImage}) {
    const folder = forheader ? 'ticket' : 'ticket-detail'; 
    return (
        <>
            {
                data &&  map(data, (atc, index)=> {
                    if(atc.fileType === '.pdf'){
                        return  (
                            <Col className={"col-xs-2 col-sm-2 col-md-2 col-xl-2"} key={`atchment ${index}`}>
                                <Card style={{marginBottom:'5px'}}>
                                    <img className="card-img-top img-fluid img-thumbnail p-2" src={pdf} alt="pdf"/>
                                    <div className="py-2 text-center">
                                          {/* <a href={`${config.apiURL}media/${folder}/download/${atc.id}`} className="fw-medium"> Download </a> */}
                                        <a href={ getImgUrl(folder, true, atc.id) } className="fw-medium"> Download </a>

                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                    else if( atc.fileType === '.xls' || atc.fileType === '.xlsx' ){
                        return  (
                            <Col className={"col-xs-2 col-sm-2 col-md-2 col-xl-2"} key={`atchment ${index}`}>
                                <Card style={{marginBottom:'5px'}}>
                                    <img className="card-img-top img-fluid img-thumbnail p-2" src={xls} alt="xls" />
                                    <div className="py-2 text-center">
                                    {/* <a href={`${config.apiURL}media/${folder}/download/${atc.id}`} className="fw-medium"> Download </a> */}
                                    <a href={ getImgUrl(folder, true, atc.id) } className="fw-medium"> Download </a>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                    else if ( atc.fileType === '.doc' || atc.fileType === '.docs' ){
                        return  (
                            <Col className={"col-xs-2 col-sm-2 col-md-2 col-xl-2"} key={`atchment ${index}`}>
                                <Card style={{marginBottom:'5px'}}>
                                    <img className="card-img-top img-fluid img-thumbnail p-2" src={doc} alt="doc" />
                                    <div className="py-2 text-center">
                                     {/* <a href={`${config.apiURL}media/${folder}/download/${atc.id}`} className="fw-medium"> Download </a> */}
                                     <a href={ getImgUrl(folder, true, atc.id) } className="fw-medium"> Download </a>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                    else if ( atc.fileType === '.rar' || atc.fileType === '.zip' ){
                        return  (
                            <Col className={"col-xs-2 col-sm-2 col-md-2 col-xl-2"} key={`atchment ${index}`}>
                                <Card style={{marginBottom:'5px'}}>
                                    <img className="card-img-top img-fluid img-thumbnail p-2" src={zip} alt="rar" />
                                    <div className="py-2 text-center">
                                        {/* <a href={`${config.apiURL}media/${folder}/download/${atc.id}`} className="fw-medium"> Download </a> */}
                                        <a href={ getImgUrl(folder, true, atc.id) } className="fw-medium"> Download </a>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                    else{
                        return  (
                            <Col className={"col-xs-2 col-sm-2 col-md-2 col-xl-2"} key={`atchment ${index}`}>
                                <Card style={{marginBottom:'5px'}}>
                                    <img className="card-img-top img-fluid img-thumbnail" 
                                    src={getImgUrl(folder, false, atc.id)} 
                                    alt="image"
                                    style={{cursor:'pointer'}} 
                                    onClick={() => {
                                        openImage(true)
                                        setImage(getImgUrl(folder, false, atc.id))
                                     }}
                                    />
                                    <div className="py-2 text-center">
                                    <a href={getImgUrl(folder, true, atc.id)} className="fw-medium"> Download </a>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                }
            )}  
        </>
    )
}

export default React.memo(TicketResponseAttach)
