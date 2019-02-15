import {
    FETCH_OFFERWALLS,
    FETCH_OFFERWALLS_SUCCESS,
    FETCH_OFFERWALLS_FAIL
} from '../actions';

export function offerwalls(state = {
    isFetching: false,
    list: [],
    error: null
}, action) {
    switch (action.type) {
        case FETCH_OFFERWALLS:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_OFFERWALLS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                list: action.payload,
                error: null
            };
        case FETCH_OFFERWALLS_FAIL:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}
