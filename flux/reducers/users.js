import {
	FETCH_USER_LIST,
	FETCH_USER_LIST_SUCCESS,
	//FETCH_USER_LIST_ERROR - TODO

	FETCH_USER_PROFILE,
	FETCH_USER_PROFILE_SUCCESS,
	SELECT_USER_PROFILE,
} from '../actions';


/*
 User List
 */
export function userList(state = {
	isFetching: false,
	list: []
}, action) {
	switch (action.type) {
		case FETCH_USER_LIST:
			return {
				...state,
				isFetching: true
			};
		case FETCH_USER_LIST_SUCCESS:
			return {
				isFetching: false,
				list: action.payload,
				lastUpdated: action.receivedAt,
			};
		default:
			return state;
	}
}

/*
 User Profiles
 */

export function selectedUserProfile(state = null, action) {
	switch (action.type) {
		case SELECT_USER_PROFILE:
			return action.userId;
		default:
			return state;
	}
}

function userProfileById(state = {
	isFetching: false,
	user: {}
}, action) {
	switch (action.type) {
		case FETCH_USER_PROFILE:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_USER_PROFILE_SUCCESS:
			return {
				isFetching: false,
				user: action.payload,
				lastUpdated: action.receivedAt,
			};
		default:
			return state;
	}
}

export function userProfiles(state = {}, action) {
	switch (action.type) {
		case FETCH_USER_PROFILE:
		case FETCH_USER_PROFILE_SUCCESS:
			return {
				...state,
				[action.userId]: userProfileById(state[action.userId], action)
			};
		default:
			return state;
	}
}
