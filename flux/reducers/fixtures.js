import {
	FETCH_FIXTURES,
	FETCH_FIXTURES_SUCCESS,
	//FETCH_FIXTURES_ERROR, TODO
	FETCH_PLAYED_FIXTURES_SUCCESS,
	FETCH_PLAYED_FIXTURES_ERROR,

    UPDATE_FIXTURES,
    UPDATE_FIXTURES_SUCCESS,
    UPDATE_FIXTURES_ERROR,

	FETCH_TOURNAMENTS_SUCCESS
} from '../actions';


export function fixtures(state = {
	isFetching: false,
	didInvalidate: false,
	list: [],
    listCount: 0,
	tournaments: []
}, action) {
	switch (action.type) {

		case FETCH_TOURNAMENTS_SUCCESS:
			return {
				...state,
				tournaments: payload.Tournaments
			};

		// TODO - case INVALIDATE_FIXTURES:
		case FETCH_FIXTURES:
			return {
				...state,
				isFetching: true,
				didInvalidate: true,
                list: [],
                listCount: 0,
			};
		case FETCH_FIXTURES_SUCCESS:
			return {
				...state,
				isFetching: false,
				didInvalidate: false,
				tournaments: action.tournaments.Tournaments,
				list: action.payload,
                listCount: action.payload.length,
				lastUpdated: action.receivedAt,
			};
		case FETCH_PLAYED_FIXTURES_SUCCESS:
			return {
				...state,
				// Adding betAmount, isWinner, answers...
                listPlayed: action.payload,
				list: state.list.map((item) => {
					const playedItem = action.payload.find(({matchId}) => item.matchId === matchId);
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
		case FETCH_PLAYED_FIXTURES_ERROR:
			return {
				...state,
				// Removing betAmount, isWinner, answers
				list: state.list.map(({betAmount, isWinner, answers, ...rest}) => {
					return {
						...rest
					};
				})
			};
        case UPDATE_FIXTURES:
            return {
                ...state,
                isFetching: true,
                didInvalidate: true,
            };
        case UPDATE_FIXTURES_SUCCESS:
            let list = [...state.list, ...action.payload];

            if (state.listPlayed) {
                list = list.map((item) => {
                    const playedItem = state.listPlayed.find(({matchId}) => item.matchId === matchId);
                    if (playedItem) {
                        return {
                            ...item,
                            ...playedItem
                        };
                    } else {
                        return item;
                    }
                });
            }

            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                tournaments: action.tournaments.Tournaments,
                list: list,
                // list: [...state.list, ...action.payload],
                listCount: state.listCount + action.payload.length,
                lastUpdated: action.receivedAt,
            };
        case UPDATE_FIXTURES_ERROR:
            return {
                ...state
            };
		default:
			return state;
	}
}
