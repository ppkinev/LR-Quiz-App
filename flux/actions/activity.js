import fetch from '../../lib/fetch.js';

export const FETCH_USER_ACTIVITY = 'FETCH_USER_ACTIVITY';
export const FETCH_USER_ACTIVITY_SUCCESS = 'FETCH_USER_ACTIVITY_SUCCESS';

export function fetchActivity() {
	return (dispatch) => {
		dispatch(fetchUserActivityStart());

		return fetch({
      endpoint: 'Activity/GetAllActivities'
		}).then((allActivities) => {

			fetch({
				endpoint: 'Activity/GetUserActivities'
			}).then((userActivities) => {

				const payload = {
					allActivities,
					userActivities
				};
				dispatch(fetchUserActivitySuccess(payload));

			})

		}).catch(({ Message: error = 'Invalid'}) => {
			// TODO
		});
	};
}

export function fetchUserActivity(userId) {
	return (dispatch) => {

		return fetch({
      endpoint: 'Activity/GetAllActivities'
		}).then((json) => {

			const userActivities = json.Activities.filter(userActivity => userActivity.User.UserId === userId);

			const payload = {
				allActivities: {
					Activities: null
				},
				userActivities: {
					Activities: userActivities
				}
			};
			dispatch(fetchUserActivitySuccess(payload));

		}).catch(({ Message: error = 'Invalid'}) => {
			// TODO
		});
	};
}

function fetchUserActivityStart() {
	return {
		type: FETCH_USER_ACTIVITY
	};
}

function fetchUserActivitySuccess(payload) {
	return {
		type: FETCH_USER_ACTIVITY_SUCCESS,
		payload
	};
}
