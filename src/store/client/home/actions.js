import {CHANGE_SEARCH_VALUE} from './actionTypes'

export const onSearchValueChange = (v) => {
    return {type: CHANGE_SEARCH_VALUE, payload: v}
}