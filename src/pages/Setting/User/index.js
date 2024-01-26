import React, {useState, useEffect} from "react"
import MetaTags from 'react-meta-tags';
import { Container, Button } from "reactstrap"
import GridViewUser from "pages/Setting/User/GridViewUser"
import Breadcrumbs from "../../../components/Common/Breadcrumb"


const SettingUser = props => {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>User | Ticketing</title>
        </MetaTags>
        <Container fluid id="container-setting-user"> 
             <Breadcrumbs title="Setting" breadcrumbItem="User" />
              {/* <h3>User</h3> */}
              <GridViewUser />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SettingUser
