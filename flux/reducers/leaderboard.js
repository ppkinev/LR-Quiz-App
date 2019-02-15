import {
	FETCH_LEADERBOARD_START,
	FETCH_LEADERBOARD_SUCCESS,
	FETCH_LEADERBOARD_ERROR,
	CURRENT_USER_INSIDE
} from '../actions';

export function leaderboard(state = {
	isFetching: false,
	players: [],
	userAnswers : false
}, action) {
	switch (action.type) {

		case FETCH_LEADERBOARD_START:
			return {
				...state,
				isFetching: true
			};

		case FETCH_LEADERBOARD_SUCCESS:

			return {
				...state,
				isFetching: false,
				players: action.payload.players,
			};

		case FETCH_LEADERBOARD_ERROR:
			return {
				...state,
				isSearching: false
			};

		case CURRENT_USER_INSIDE:
			let answers = false;
			state.players.forEach((p) => {
				if(p.UserId === action.payload) {
					answers = true
				}
			});

			return {
				...state,
				userAnswers: answers
			};

		default:
			return state;
	}
}
