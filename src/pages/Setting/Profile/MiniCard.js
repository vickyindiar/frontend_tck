import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types'
import React from "react"
import { Card, CardBody, Col, Media } from "reactstrap"

const MiniCards = props => {
  const { title, text, iconClass } = props
  function Number({n}){
    const spring = useSpring({ from: { val: 0 }, to: { val: n } });
    return <animated.div>{ spring.val.to(f => Math.floor(f)) }</animated.div>
  }
  
  return (
    <React.Fragment>
      <Col md="4">
        <Card className="mini-stats-wid">
          <CardBody>
            <Media>
              <Media body>
                <p className="text-muted fw-medium mb-2">{title}</p>
                <h4 className="mb-0">
                <Number n={parseInt(text)}/>
                  </h4>
              </Media>
              <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                <span className="avatar-title">
                  <i className={(iconClass.includes('mdi')? "mdi " : "bx ") + iconClass + " font-size-24"} />
                </span>
              </div>
            </Media>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

MiniCards.propTypes = {
  iconClass: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string
}

export default MiniCards
