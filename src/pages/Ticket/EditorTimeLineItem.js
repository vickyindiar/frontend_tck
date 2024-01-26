import React from "react"
import moment from "moment"

const LiVerticalTimeline = ({props}) => {
          return (
            <React.Fragment>
              <li className={`event-list ${ props.isActive ?'active':''}` }>
                <div className="event-timeline-dot">
                  <i
                    className={ props.isActive ? "bx bxs-right-arrow-circle bx-fade-right font-size-15" : "bx bx-right-arrow-circle font-size-15" }
                  />
                </div>
                <div className="media">
                  <div className="me-3">
                    <i className={"bx " + props.iconClass + " h5 text-primary"} />
                  </div>
                  <div className="media-body">
                    <div>
                      <h5 className="font-size-14">{props.statusTitle}</h5>
                      {/* <p className="text-muted">{props.description}</p> */}
                      <p className="text-muted mb-0 font-size-10"> 
                        {  props.description !== '' ?  <i className="bx bx-time-five align-self-center me-1" /> : '' } 
                        {  props.description !== '' ? moment(props.description).fromNow() : '' }
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </React.Fragment>
          )
 
}

export default React.memo(LiVerticalTimeline)
