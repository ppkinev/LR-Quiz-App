import {
    FETCH_USER,
    FETCH_USER_SUCCESS,
    FETCH_USER_ERROR,
    UPDATE_FRIEND_RELS,
} from '../actions';


export function user(state = {
    isFetching: false,
    didInvalidate: false,
    user: {},
}, action) {
    switch (action.type) {
        case FETCH_USER:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                user: action.payload
            };
        case FETCH_USER_ERROR:
            return {
                ...state,
                isFetching: false,
                didInvalidate: true,
            };
        case UPDATE_FRIEND_RELS:
            let user = Object.assign({}, state.user);
            if (!Object.keys(user).length) {
                user = {
                    Relationships: {
                        Rels: action.payload.Rels
                    }
                }
            } else {
                user.Relationships.Rels = action.payload.Rels;
            }
            return {
                ...state,
                isFetching: false,
                user: user
            };
        default:
            return state;
    }
}
