import {
    FETCH_EARNS,
    FETCH_EARNS_SUCCESS,
    FETCH_EARNS_ERROR,
    CLOSE_FRIEND_WINDOW
} from '../actions';


export function earns(state = {
    isFetching: false,
    didInvalidate: false,
    list: [],
    showInvite: true
}, action) {
    switch (action.type) {
        case FETCH_EARNS:
            return {
                ...state,
                isFetching: true,
                didInvalidate: true,
            };
        case FETCH_EARNS_SUCCESS:
            const list = action.payload;
            const allCategories = new Set(list.map(item => item.type));
            const categories = [...allCategories].map(item => ({tabId: item.toLowerCase(), label: item}));
            categories.unshift({label: 'Overall', tabId: 'all'});
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                list, categories,
                lastUpdated: action.receivedAt,
            };

        case CLOSE_FRIEND_WINDOW:
            return {
                ...state,
                showInvite: false
            };

        default:
            return state;
    }
}
