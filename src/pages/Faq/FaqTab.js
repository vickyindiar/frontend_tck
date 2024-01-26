import React, {useState, useEffect} from 'react'
import { map } from 'lodash'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { changeModuleTab } from 'store/actions'
import Accordion from 'devextreme-react/accordion'
import moment from "moment"
import getImgUrl from 'helpers/url_image_helper'
import styled from 'styled-components'
import { Button } from 'devextreme-react/button'
import isEmpty from 'helpers/isEmpty_helper'
import { confirm } from 'devextreme/ui/dialog';
import {SelectBox } from 'devextreme-react/select-box'
import classnames from "classnames"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import { Link, useHistory } from "react-router-dom"

import {
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Collapse,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
  } from "reactstrap"
  
import FaqTabContent from './FaqTabContent'



const FaqTab = ({dsModules, app, setApp}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const tabActive = useSelector(state => state.faq.mTabActive)
    const toggleTabActive = (tab) => {
        dispatch(changeModuleTab(tab))
    }

    
  useEffect(() => {
    const search = history.location.search;
    const tab = new URLSearchParams(search).get('mod');
    if(!isEmpty(tab)){
        toggleTabActive(parseInt(tab))
    }
  }, [])

    return (
        <>
        <Row>
            <Col>
                <Nav tabs className="nav-tabs-custom nav-justified">
                    {
                       !isEmpty(dsModules) &&
                        map(dsModules, (v, i) => {
                            return(
                                <NavItem key={`_TAB_MODULE_FAQ${i}`}>
                                    <NavLink style={{ cursor: "pointer" }}  className={classnames({ active:tabActive === v.id })} onClick={() => { toggleTabActive(v.id) }} >
                                        <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                        <span className="d-none d-sm-block">{v.name}</span>
                                    </NavLink>
                                </NavItem>
                            )
                        })
                    }
                </Nav>
                <FaqTabContent dsModules={dsModules} app={app}/>
            </Col>
        </Row>
        </>
    )
}

export default React.memo(FaqTab)
