import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types'
import React from "react"
import { Card, CardBody, Col, Media } from "reactstrap"
import { Link } from "react-router-dom"

const MiniCards = ({ title, text, iconClass }) => {
  function Number({n}){
    const spring = useSpring({ from: { val: 0 }, to: { val: n } });
    return <animated.div>{ spring.val.to(f => Math.floor(f)) }</animated.div>
  }
  
  return (
    <React.Fragment>
      <Col md="4">
        <Card className="mini-stats-wid">
          <CardBody>
            {/* <Link to ={url !== '' ? `/admin/ticket?tab=${url}` : `/admin/ticket`}> */}
            <Media>
              <Media body>
                <p className="text-muted fw-medium mb-2">{title}</p>
                <h4 className="mb-0">
                  <Number n={parseInt(text)}/>
                  </h4>
              </Media>
              <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                <span className="avatar-title">
                  <i className={ iconClass + " font-size-24"} />
                </span>
              </div>
            </Media>
            {/* </Link> */}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}
export default React.memo(MiniCards)
