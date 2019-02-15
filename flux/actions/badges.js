import fetch from '../../lib/fetch.js';

export const FETCH_BADGES = 'FETCH_BADGES';
export const FETCH_BADGES_SUCCESS = 'FETCH_BADGES_SUCCESS';
export const FETCH_BADGES_ERROR = 'FETCH_BADGES_ERROR';

export function fetchUserBadges() {
	return (dispatch, getState) => {
		dispatch(fetchBadgesStart());

		return fetch({
			endpoint: 'badge/getbadges'
		}).then((json) => {

			const earnedBadges = getState().user.user.EarnedBadges;

			const allBadges = {
				badges: json.Badges,
				earnedBadges: earnedBadges
			};
			dispatch(fetchBadgesSuccess(allBadges));

		}).catch(({ Message: error = 'Invalid'}) => {
			// TODO
		});
	};
}

export function fetchBadges(earnedBadges) {
	return (dispatch, getState) => {
		dispatch(fetchBadgesStart());

		return fetch({
			endpoint: 'badge/getbadges'
		}).then((json) => {
		    if (getState().auth.isLoggedIn) {
                dispatch(fetchEarnedBadges(json));
            } else {
                dispatch(fetchBadgesSuccess({
                    badges: json.Badges,
                    earnedBadges: []
                }));
            }
		}).catch(({ Message: error = 'Invalid'}) => {
			// TODO
		});
	};
}

function fetchEarnedBadges({ Badges }) {
	return (dispatch) => {

		return fetch({
			endpoint: 'badge/getearnedbadges'
		}).then(({ EarnedBadges }) => {
			const allBadges = {
				badges: Badges,
				earnedBadges: EarnedBadges
			};
			dispatch(fetchBadgesSuccess(allBadges));
		}).catch(({ Message: error = 'Invalid'}) => {
			dispatch(fetchBadgesError());
		});
	};
}

function fetchBadgesStart() {
	return {
		type: FETCH_BADGES
	};
}

function fetchBadgesSuccess(payload) {
	return {
		type: FETCH_BADGES_SUCCESS,
		payload
	};
}

function fetchBadgesError() {
	return {
		type: FETCH_BADGES_ERROR
	};
}
