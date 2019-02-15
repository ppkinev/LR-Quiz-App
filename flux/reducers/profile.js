import {
	FETCH_PROFILE,
	FETCH_PROFILE_SUCCESS,
	FETCH_PROFILE_ERROR,
	INVALIDATE_PROFILE,

    POST_VERIFY_EMAIL,
    POST_VERIFY_EMAIL_SUCCESS,
    POST_VERIFY_EMAIL_ERROR,

    POST_CONFIRM_EMAIL,
    POST_CONFIRM_EMAIL_SUCCESS,
    POST_CONFIRM_EMAIL_ERROR,
} from '../actions';


export function profile(state = {
	isFetching: false,
	didInvalidate: false,
	userId: null,
	name: '',
	imageUrl: null,
	points: 0,
	pendingPoints: 0,
    isEmailConfirmed: false,
    isEmailVerificationSent: false,
}, action) {
	switch (action.type) {
		case INVALIDATE_PROFILE:
			return {
				...state,
				didInvalidate: true,
			};
		case FETCH_PROFILE:
			return {
				...state,
				isFetching: true,
				didInvalidate: true,
			};
		case FETCH_PROFILE_SUCCESS:
			return {
				...state,
				...action.payload,
				isFetching: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt,
			};
		case FETCH_PROFILE_ERROR:
			return {
				...state,
				isFetching: false,
				didInvalidate: true,
			};
        case POST_VERIFY_EMAIL:
            return {
                ...state,
                isEmailVerificationSent: false,
            };
        case POST_VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                isEmailVerificationSent: true,
            };
        case POST_VERIFY_EMAIL_ERROR:
            return {
                ...state,
                isEmailVerificationSent: false,
            };
        case POST_CONFIRM_EMAIL_SUCCESS:
            return {
                ...state,
                isEmailConfirmed: true,
            };
		default:
			return state;
	}
}
