import React, {useState, useEffect, useRef} from "react"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Container, Label } from "reactstrap"
import MetaTags from 'react-meta-tags';
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import ProfileEditor from "./ProfileEditor";
import { useDispatch, useSelector } from "react-redux"
import { size } from "lodash";
import { getProfile, updateProfile, toggleProfileEdit } from 'store/actions'
import ProfileDashboard from "./ProfileDashboard";


const SettingProfile = () => {
    const activeUser = useSelector(state => state.Login.user)
    const dsProfile = useSelector(state => state.users.dsProfile)
    const dispatch = useDispatch()
    useEffect(() => {
        if(activeUser && size(Object.keys(activeUser ))> 0 ){
            dispatch(getProfile(activeUser.id))
        }
    }, [activeUser])

    return (
        <React.Fragment>
            <div className="page-content page-contain-settingprofile">
            <MetaTags>
                <title>Profile | Ticketing</title>
            </MetaTags>
            <Container fluid>
                <Breadcrumbs title="Setting" breadcrumbItem="Profile"  />
                <Row>
                    <Col lg="4">
                        {
                            dsProfile 
                            && size(Object.keys(dsProfile)) > 0
                            && <ProfileEditor dsProfile={dsProfile} />
                        }
                    </Col>
                    <Col lg="8">
                        <ProfileDashboard />
                    </Col>
                </Row>
            </Container>
            </div>
        </React.Fragment>
    )
}

export default React.memo(SettingProfile)
