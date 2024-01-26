import React, {useState, useEffect} from "react"
import MetaTags from 'react-meta-tags';
import { Container, Button } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Card, CardBody, Label } from 'reactstrap'
import TicketCount from './TicketCount'
import TicketModuleChart from "./TicketModuleChart";
import NewChangeLog from "./NewChangeLog";
import Breadcrumbs from "../../components/Common/Breadcrumb"

const Dashboard = props => {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | Ticketing</title>
        </MetaTags>
        <Container fluid>
            {/* <PagesMaintenance /> */}
            <Breadcrumbs title="" breadcrumbItem="Dashboard" />
            <Row>
              <TicketCount/>
            </Row>
            <Row>
              <Col lg="8">
                 <TicketModuleChart />
              </Col>
              <Col>
                 <NewChangeLog />
              </Col>
            </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
