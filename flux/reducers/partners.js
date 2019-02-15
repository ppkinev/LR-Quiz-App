import {
	FETCH_PARTNERS,
	FETCH_PARTNERS_SUCCESS,
	//FETCH_PARTNERS_ERROR,
} from '../actions';


export function partners(state = {
	isFetching: false,
	list: []
}, action) {
	switch (action.type) {
		case FETCH_PARTNERS:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_PARTNERS_SUCCESS:
			return {
				isFetching: false,
				list: action.payload,
				lastUpdated: action.receivedAt,
			};
		default:
			return state;
	}
}
