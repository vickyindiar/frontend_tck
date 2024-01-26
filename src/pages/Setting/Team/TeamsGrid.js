import React, {useState, useRef, useEffect, useCallback} from 'react'
import { map, size } from "lodash"
import { Col, Container, Row } from "reactstrap"
import TeamCard from './TeamCard'
import { useDispatch, useSelector } from 'react-redux'
import { getTeams, toggleCardCreateTeam } from 'store/actions'
import NewTeamCard from './NewTeamCard'
import NewTeamCardInput from './NewTeamCardInput'


function TeamsGrid() {
    const dsTeams = useSelector(state => state.users.allTeams)
    const showNewInput = useSelector(state => state.users.cardCreateTeam)
    const dispatch = useDispatch()
    // const [showNewInput, setshowNewInput] = useState(false)

    useEffect(() => {
      dispatch(getTeams('settings'))
    }, [])

    const onBtnCreateTeamClick = useCallback( (e) => {
      dispatch(toggleCardCreateTeam(e))
     },[]);

    return (
        <div>
          <Row>
            { !showNewInput && <NewTeamCard onBtnCreateTeamClick={onBtnCreateTeamClick} /> }
            { showNewInput && <NewTeamCardInput onBtnCreateTeamClick={onBtnCreateTeamClick}/> }
            {
             size(dsTeams) > 0 && <TeamCard teams={dsTeams} />
            }
          </Row>
            
        </div>
    )
}

export default React.memo(TeamsGrid)
