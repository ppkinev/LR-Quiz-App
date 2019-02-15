import fetch from '../../lib/fetch.js';
import {userManager} from '../../lib/auth-utils';
import {successAuth} from './auth.js';
import { getCookie, eraseCookie, CONFIRM_EMAIL_CODE_COOKIE } from '../../lib/utils.js';

export const FETCH_PROFILE = 'FETCH_PROFILE';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_ERROR = 'FETCH_PROFILE_ERROR';
export const INVALIDATE_PROFILE = 'INVALIDATE_PROFILE';

export const POST_VERIFY_EMAIL = 'POST_VERIFY_EMAIL';
export const POST_VERIFY_EMAIL_SUCCESS = 'POST_VERIFY_EMAIL_SUCCESS';
export const POST_VERIFY_EMAIL_ERROR = 'POST_VERIFY_EMAIL_ERROR';

export const POST_CONFIRM_EMAIL = 'POST_CONFIRM_EMAIL';
export const POST_CONFIRM_EMAIL_SUCCESS = 'POST_CONFIRM_EMAIL_SUCCESS';
export const POST_CONFIRM_EMAIL_ERROR = 'POST_CONFIRM_EMAIL_ERROR';


export function invalidateProfile() {
	return {
		type: INVALIDATE_PROFILE
	}
}

function fetchProfileStart() {
	return {
		type: FETCH_PROFILE
	};
}

export function fetchProfileSuccess({
	UserId: userId,
    Email: email,
    IsEmailConfirmed: isEmailConfirmed,
	UserName: name,
	ImageUrl: imageUrl,
	Wallet: {
		PointsConfirmed: points,
		PointsPending: pendingPoints,
		CreditsConfirmed: credits,
		CreditsPending: pendingCredits
	},
	FriendsCount: friendsCount,
	FriendRequestsCount: friendRequestsCount
}) {
	return {
		type: FETCH_PROFILE_SUCCESS,
		payload: {
			userId,
			name,
			imageUrl,
			points,
			pendingPoints,
			credits,
			pendingCredits,
			friendsCount,
			friendRequestsCount,
            email,
            isEmailConfirmed
		},
		receivedAt: Date.now()
	};
}

function fetchProfileError(error) {
	return {
		type: FETCH_PROFILE_ERROR,
		error
	};
}

export function fetchProfile() {
	return (dispatch, getState) => {
		dispatch(fetchProfileStart());

		return fetch({
			endpoint: 'user/me'
		}).then(
			(json) => {

			    return new Promise((resolve, reject) => {
                    const profile = getState().profile;
                    const auth = getState().auth;

                    userManager.getUser().then((user) => {
                        if (user) {
                            dispatch(fetchProfileSuccess(json));
                            dispatch(successAuth());

                            // Checking confirmation cookies
                            if (getCookie(CONFIRM_EMAIL_CODE_COOKIE)) {
                                dispatch(confirmEmail());
                            }
                        } else {

                        }

                        if (profile.friendRequestsCount !== json.friendRequestsCount) {
                            dispatch(fetchProfileSuccess(json));
                        }

                        resolve();
                    });
                });
			},
			(error) => dispatch(fetchProfileError(error))
		).catch(({Message: error = 'Invalid'}) => {
			dispatch(fetchProfileError(error)); // TODO
			throw error;
		});
	};
}

function shouldFetchProfile(state) {
	const {profile, auth} = state;

	if (!auth.isLoggedIn) {
		return true;
	} else if (profile.isFetching) {
		return false;
	} else {
		return profile.didInvalidate;
	}
}

export function fetchProfileIfNeeded() {
	return (dispatch, getState) => {

	    userManager.getUser().then((user) => {
	        if (user) {
                dispatch(fetchProfile());
            }
        });

	};
}

/**
 * Verify email
 */

export function verifyEmail() {
    return (dispatch) => {
        dispatch({type: POST_VERIFY_EMAIL});

        return fetch({
            method: 'POST',
            endpoint: 'user/verifyemail',
        }).then(() => {
            dispatch({
                type: POST_VERIFY_EMAIL_SUCCESS,
            })
        }).catch((error) => {
            dispatch({
                type: POST_VERIFY_EMAIL_ERROR,
                error,
            })
        })
    }
}

export function confirmEmail() {
    return (dispatch) => {
        dispatch({type: POST_CONFIRM_EMAIL});

        return fetch({
            method: 'POST',
            endpoint: 'user/confirmemail',
            data: {
                Code: getCookie(CONFIRM_EMAIL_CODE_COOKIE)
            }
        }).then(() => {
            eraseCookie(CONFIRM_EMAIL_CODE_COOKIE);
            dispatch({
                type: POST_CONFIRM_EMAIL_SUCCESS
            })
        }).catch((error) => {
            eraseCookie(CONFIRM_EMAIL_CODE_COOKIE);
            dispatch({
                type: POST_CONFIRM_EMAIL_ERROR,
                error,
            })
        })
    }
}

