import {
	FETCH_REWARDS,
	FETCH_REWARDS_SUCCESS,
	FETCH_REWARDS_ERROR,
	SHOW_SHARE,
	HIDE_SHARE
} from '../actions';


export function rewards(state = {
	isFetching: false,
	map: {}
}, action) {
	switch (action.type) {
		case FETCH_REWARDS:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_REWARDS_SUCCESS:
			return {
				...state,
				isFetching: false,
				map: action.payload,
				lastUpdated: action.receivedAt,
			};
		case FETCH_REWARDS_ERROR:
			return {
				...state,
				isFetching: false,
			};
		default:
			return state;
	}
}
