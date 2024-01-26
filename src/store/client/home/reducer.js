 import {
    CHANGE_SEARCH_VALUE
 } from './actionTypes'

const INIT_STATE = {
    searchValue : ''
}

const homeClient = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_SEARCH_VALUE:
            return{
                ...state,
                searchValue: action.payload
            }
            break;
        default:
            return state
    }
}

export default homeClient