import React, {useState, useEffect} from "react"
import MetaTags from 'react-meta-tags';
import { Container, Button } from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import TeamsGrid from "./TeamsGrid";


const SettingTeam = props => {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Team | Ticketing</title>
        </MetaTags>
        <Container fluid>
             <Breadcrumbs title="Setting" breadcrumbItem="Team" />
             <TeamsGrid/>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default React.memo(SettingTeam)
