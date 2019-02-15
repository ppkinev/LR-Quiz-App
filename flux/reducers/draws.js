import {
	SELECT_DRAW,

	FETCH_DRAWS,
	FETCH_DRAWS_SUCCESS,
	FETCH_DRAWS_ERROR,

	FETCH_PLAYED_DRAWS,
	FETCH_PLAYED_DRAWS_SUCCESS,
	FETCH_PLAYED_DRAWS_ERROR,

	POST_DRAW_BET,
	POST_DRAW_BET_SUCCESS,
	POST_DRAW_BET_ERROR,
} from '../actions';


export function selectedDrawId(state = null, action) {
	switch (action.type) {
		case SELECT_DRAW:
			return action.drawId;
		default:
			return state;
	}
}

export function draws(state = {
	isFetching: false,
	didInvalidate: false,
	list: [],

	isBetting: false,
	betError: undefined
}, action) {
	switch (action.type) {
		// TODO - case INVALIDATE_DRAWS:
		case FETCH_DRAWS:
			return {
				...state,
                list: [],
				isFetching: true,
				didInvalidate: true,
			};
		case FETCH_DRAWS_SUCCESS:
			return {
				...state,
				isFetching: false,
				didInvalidate: false,
				list: action.payload,
				lastUpdated: action.receivedAt,
			};
        case FETCH_PLAYED_DRAWS:
            return {
                ...state,
            };
		case FETCH_PLAYED_DRAWS_SUCCESS:
			return {
				...state,
				// Adding betAmount, isWinner, needToClaim...
				list: state.list.map((item) => {
					const playedItem = action.payload.find(({ drawId }) => item.drawId === drawId);
					if (playedItem) {
						return {
							...item,
							...playedItem
						};
					} else {
						return item;
					}
				}),
				lastUpdated: action.receivedAt,
			};
		case FETCH_PLAYED_DRAWS_ERROR:
			return {
				...state,
				// Removing betAmount, isWinner, needToClaim
				list: state.list.map(({ betAmount, isWinner, needToClaim, ...rest }) => {
					return {
						...rest
					};
				})
			};
		// Betting
		case POST_DRAW_BET:
			return {
				...state,
				isBetting: true,
				betError: undefined,
			};
		case SELECT_DRAW: // Select clears errors
		case POST_DRAW_BET_SUCCESS:
			return {
				...state,
				isBetting: false,
				betError: undefined,
			};
		case POST_DRAW_BET_ERROR:
			return {
				...state,
				isBetting: false,
				betError: action.error,
			};
		default:
			return state;
	}
}
