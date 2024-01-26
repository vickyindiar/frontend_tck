import React from 'react'
import { Row, Col } from 'reactstrap'

function TicketColorLegend() {
    return (
        <>
        <Row>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-danger align-middle me-1" } />
                    {"New"}
                </a>
            </Col>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-info align-middle me-1" } />
                    {"Open"}
                </a>
            </Col>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-primary align-middle me-1" } />
                    {"In Progess"}
                </a>
            </Col>
        </Row>
        <Row>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-warning align-middle me-1" } />
                    {"Pending"}
                </a>
            </Col>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-success align-middle me-1" } />
                    {"Solve"}
                </a>
            </Col>
            <Col>
                <a className="text-muted mb-0">
                    <i className={ "mdi mdi-circle text-dark align-middle me-1" } />
                    {"Reject"}
                </a>
            </Col>
        </Row>
  
     
        </>
    )
}

export default React.memo(TicketColorLegend)
