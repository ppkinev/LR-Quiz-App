import userData from '../../components/LeaderBoardContainer/data.js'; // fake profiles response data
import fetch from '../../lib/fetch.js';

export const FETCH_USER_LIST = 'FETCH_USER_LIST';
export const FETCH_USER_LIST_SUCCESS = 'FETCH_USER_LIST_SUCCESS';

export const SELECT_USER_PROFILE = 'SELECT_USER_PROFILE';
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';
export const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS';

const DELAY = 100;

// Leader-board
//

function fetchUserListStart() {
	return {
		type: FETCH_USER_LIST
	};
}


function fetchUserListSuccess(json) {
	return {
		type: FETCH_USER_LIST_SUCCESS,
		payload: json.Earners.map(({
			UserId: userId,
			UserName: name,
			ImageUrl: imageUrl,
			Amount: points,
			Rank: rank,
			}) => {
			return {
				userId,
				name,
				imageUrl,
				points,
				rank
			};
		}),
		receivedAt: Date.now()
	};
}

export function fetchUserList() {
	return (dispatch) => {
		dispatch(fetchUserListStart());

		return fetch({
			endpoint: 'leaderboard/gettopearners2'
		}).then((json) => {
			dispatch(fetchUserListSuccess(json));
		});

		//TODO - errors
	};
}

// User Profiles
//
export function selectUserProfile(userId) {
	return {
		type: SELECT_USER_PROFILE,
		userId
	};
}

function fetchUserProfileStart(userId) {
	return {
		type: FETCH_USER_PROFILE,
		userId
	};
}


function fetchUserProfileSuccess(userId, json) {
	return {
		type: FETCH_USER_PROFILE_SUCCESS,
		userId,
		payload: json,
		receivedAt: Date.now()
	};
}

function fetchUserProfile(userId) {
	return (dispatch, getState) => {
		dispatch(fetchUserProfileStart(userId));

		console.log('>>TODO: fetch /user[%s]', userId);
		//fetch(`/user/${iserId}`).then(response => response.json())
		//const response = userData.users.all.find(u => u.userId === userId);

		const myProfile = getState().profile; // TODO - separate elsewere

		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(myProfile), 0);
		}).then((json) => {
			dispatch(fetchUserProfileSuccess(userId, json));
		});
	};
}

function shouldFetchUserProfile(state, userId) {
	const profile = state.userProfiles[userId];
	if (!profile) {
		return true;
	} else if (profile.isFetching) {
		return false;
	} else {
		return profile.didInvalidate;
	}
}

export function fetchUserProfileIfNeeded(userId) {
	return (dispatch, getState) => {
		if (shouldFetchUserProfile(getState(), userId)) {
			return dispatch(fetchUserProfile(userId));
		} else {
			return Promise.resolve();
		}
	};
}
