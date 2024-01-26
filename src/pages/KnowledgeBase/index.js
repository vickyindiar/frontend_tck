import React from 'react'
import MetaTags from 'react-meta-tags'
import { Container } from "reactstrap"
import KBaseList from './KBaseList'

function index() {
    return (
        <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Knowledge Base | Ticketing</title>
          </MetaTags>
          <Container fluid>
            <h3>Knowledge Base</h3>
            {/* <PagesMaintenance /> */}
            <KBaseList />

          </Container>
        </div>
      </React.Fragment>
    )
}

export default index
