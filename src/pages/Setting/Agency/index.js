import React, {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MetaTags from 'react-meta-tags'
import { Container, Row, Col } from "reactstrap"
import isEmpty from 'helpers/isEmpty_helper'
import { Button } from 'devextreme-react/button'
import SelectBox, {DropDownOptions} from 'devextreme-react/select-box'
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import TreeView from './TreeView'

function index() {
    return (
        <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Client | Ticketing</title>
          </MetaTags>
          <Container fluid>
           <Breadcrumbs title="Setting" breadcrumbItem="Client" />
            <Row>
              <Col>
                <TreeView />
              </Col>
            </Row>

          </Container>
        </div>
      </React.Fragment>
    )
}

export default index
