import {
	FETCH_INVITE_START,
	FETCH_INVITE_SUCCESS,
	FETCH_INVITE_ERROR,
	GET_SOCIAL_INVITE_SUCCESS,
	GET_SOCIAL_INVITE_START,
	GET_SOCIAL_INVITE_ERROR,
	GET_INVITE_LINK,
	HIDE_SOCIAL_MESSAGE,
	SHOW_SOCIAL_MESSAGE
} from '../actions';

export function inviteFriends(state = {
	isFetching: false,
	showModal: null,
	link : null,
	showSocial : false
}, action) {
	switch (action.type) {

		case FETCH_INVITE_START:
			return {
				...state,
				isFetching: true
			};

		case FETCH_INVITE_SUCCESS:
			return {
				...state,
				isFetching: false,
				showModal: true
			};

		case FETCH_INVITE_ERROR:
			return {
				...state,
				isFetching: false,
				showModal: false
			};
        case GET_SOCIAL_INVITE_START:
            return {
                ...state,
                isFetching: true,
            };
		case GET_INVITE_LINK:
			return {
				...state,
				link : action.payload,
                isFetching: false
			};

		case SHOW_SOCIAL_MESSAGE:
			return {
				...state,
				showSocial : action.payload
			};

		case HIDE_SOCIAL_MESSAGE:
			return {
				...state,
				showSocial : action.payload
			};

		default:
			return state;
	}
}
