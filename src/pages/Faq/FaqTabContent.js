import React, {useState, useEffect} from 'react'
import { map } from 'lodash'
import { useSelector,  useDispatch } from 'react-redux'
import Accordion from 'devextreme-react/accordion'
import moment from "moment"
import getImgUrl from 'helpers/url_image_helper'
import styled from 'styled-components'
import { Button } from 'devextreme-react/button'
import isEmpty from 'helpers/isEmpty_helper'

import { confirm } from 'devextreme/ui/dialog';
import {SelectBox } from 'devextreme-react/select-box'
import classnames from "classnames"
import { changeActiveTab, getFaqsByApp } from "store/actions"
import CreateFaqModal from './CreateFaqModal'
import EditFaqModal from './EditFaqModal'
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
import { Link, useHistory } from "react-router-dom"


const FaqTabContent = ({dsModules, app}) => {
    const tabActive = useSelector(state => state.faq.mTabActive)
    const sFaqs = useSelector(state => state.faq.sFaqs)
    const sFaqsByTabs = useSelector(state => state.faq.sFaqsByTabs)
    const showModalCreate = useSelector(state => state.faq.modalCreateFaq)
    const showModalEdit = useSelector(state => state.faq.modalEditFaq)
    const [selectedRow, setselectedRow] = useState({})
    const [openDesc, setopenDesc] = useState(0)
    const freeToken = useSelector(state => state.authClient.freeToken)
    const isAuthenticatedUser = useSelector(state => state.Login.isAuthenticated)
  const history = useHistory()


    const dispatch = useDispatch()

    useEffect(() => {
        if(isAuthenticatedUser || (!isEmpty(tabActive) && !isEmpty(freeToken)) ){
            dispatch(getFaqsByApp(app, freeToken))
        }
    }, [isAuthenticatedUser, tabActive, freeToken])

        
  useEffect(() => {
    const search = history.location.search;
    const id = new URLSearchParams(search).get('id');
    if(!isEmpty(id)){
        setopenDesc(parseInt(id))
    }
  }, [])

    return (
        <>
            <TabContent activeTab={tabActive} className="p-3 text-muted">
                {
                    !isEmpty(dsModules) && !isEmpty(sFaqs) &&
                    map(dsModules, (v, i) => {
                        return(
                            <TabPane tabId={v.id} key={`_TAB_PANE_MODULE${i}`}> 
                                <Row>
                                    <Col sm="12">
                                        {
                                           !isEmpty(sFaqsByTabs) && map(sFaqsByTabs, (x, ix) => {
                                                return (
                                                <React.Fragment key={`_TAB_ITEMS_PANE_MODULE${ix}`}>
                                                    <Row>
                                                        <Col>
                                                        <Button
                                                            width={20}
                                                            text=""
                                                            type="normal"
                                                            stylingMode="outlined"
                                                            icon= { openDesc === x.id ? "minus" : "plus"}
                                                            style={{borderRadius:'5px', padding:'0px', float:'left', marginRight:'20px'}}
                                                            onClick={() => { openDesc === x.id ? setopenDesc(0) : setopenDesc(x.id) }}
                                                            className={'btn-center-icon'}
                                                        />
                                                        <p style={{fontSize:'1.2rem'}}><strong>{x.question}</strong> </p>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Collapse isOpen={openDesc === x.id}>
                                                                  {x.desc}
                                                            </Collapse>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <hr />
                                                        </Col>
                                                    </Row>

                                                </React.Fragment>    
                                                )
                                            })
                                         }
                                   
                                    </Col>
                                </Row>
                            </TabPane>
                        )
                    })
                }
            </TabContent>
            {
                showModalCreate ?  < CreateFaqModal appId={app} /> : null
            }
            {
                showModalEdit && selectedRow ?  < EditFaqModal appId={app}/> : null
            }
        </>
    )
}

export default FaqTabContent
