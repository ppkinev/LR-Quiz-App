import { FETCH_USER_ACTIVITY, FETCH_USER_ACTIVITY_SUCCESS } from '../actions';

export function activity(state = {
	isFetching: false,
	allActivities: [],
	userActivities: []
}, action) {
	switch (action.type) {

		case FETCH_USER_ACTIVITY:
			return {
				...state,
				isFetching: true
			};

    case FETCH_USER_ACTIVITY_SUCCESS:
      return {
        ...state,
				isFetching: false,
				allActivities: action.payload.allActivities.Activities,
				userActivities: action.payload.userActivities.Activities
      };

		default:
			return state;
	}
  return state;
}
