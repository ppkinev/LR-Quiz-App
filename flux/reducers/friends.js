import {
	FETCH_FRIENDS,
	FETCH_FRIENDS_SUCCESS,
	FETCH_FRIENDS_ERROR,
	SEARCH_FRIENDS_START,
	SEARCH_FRIENDS_SUCCESS,
	RESET_SEARCH,
	UPDATE_FRIEND_RELS
} from '../actions';

export function friends(state = {
	isFetching: false,
	list: [],
	friends: [],
	isSearching: false,
	searchResults: false,
	friendRequestSent: false
}, action) {
	switch (action.type) {

		case FETCH_FRIENDS:
			return {
				...state,
				isFetching: true
			};

		case FETCH_FRIENDS_SUCCESS:
			return {
				...state,
				isFetching: false,
				list: action.payload.Users,
				friends: action.payload.Users,
				searchResults: false
			};

		case SEARCH_FRIENDS_START:
			return {
				...state,
				isSearching: true
			};

		case SEARCH_FRIENDS_SUCCESS:
			return {
				...state,
				list: action.payload.Users,
				isSearching: false,
				searchResults: true
			};

		case RESET_SEARCH:
		case FETCH_FRIENDS_ERROR:
			return {
				...state,
				list: state.friends,
				isSearching: false,
				searchResults: false
			};

		case UPDATE_FRIEND_RELS:
			const _friends = state.list.map(friend => {
				if (friend.User.UserId === action.payload.User.UserId) {
					friend = action.payload;
				}
				return friend;
			});
			return {
				...state,
				list: _friends
			};

		default:
			return state;
	}
}
