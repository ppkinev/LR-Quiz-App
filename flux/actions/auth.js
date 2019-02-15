import fetch from '../../lib/fetch.js';
import {triggerLogInFlow, triggerLogOutFlow} from '../../lib/auth-utils';
import {Window} from '../../lib/utils.js';
import {fetchProfile, fetchProfileSuccess} from './profile.js'

const popup = Window();


export const TOGGLE_WELCOME = 'TOGGLE_WELCOME';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const AUTH_CANCEL = 'AUTH_CANCEL';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const RESET_JUST_AUTHORIZED = 'RESET_JUST_AUTHORIZED';

export const POST_LOGIN = 'POST_LOGIN';
export const POST_LOGIN_ERROR = 'POST_LOGIN_ERROR';
export const POST_SIGNUP = 'POST_SIGNUP';
export const POST_SIGNUP_ERROR = 'POST_SIGNUP_ERROR';
export const POST_RESTORE = 'POST_RESTORE';
export const POST_RESTORE_ERROR = 'POST_RESTORE_ERROR';
export const POST_RESTORE_SUCCESS = 'POST_RESTORE_SUCCESS';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const SAFARI_COOKIE_HACKED = 'SAFARI_COOKIE_HACKED';

/*
 Welcome popup
 */
export function toggleWelcome(show) {
    return {
        type: TOGGLE_WELCOME,
        show
    }
}

/*
 Common Auth
 */
function requestAuthPopup(authPopupView = 'signup') {
    return {
        type: REQUEST_AUTH,
        authPopupView
    };
}

function safariCookieHack() {
    return {
        type: SAFARI_COOKIE_HACKED
    };
}

export function checkSafariCookieHack() {
    return (dispatch) => {
        // TODO:
        // action does nothing
        // remove later from all components
        dispatch(safariCookieHack());
    };
}

export function requestAuth(authPopupView) {
    return (dispatch) => {
        dispatch(requestAuthPopup(authPopupView));
    };
}

export function cancelAuth() {
    return {
        type: AUTH_CANCEL
    };
}

export function successAuth() {
    return {
        type: AUTH_SUCCESS
    };
}

export function resetJustAuthorized() {
    return {
        type: RESET_JUST_AUTHORIZED
    };
}

/*
 Login
 */
function postLoginStart() {
    return {
        type: POST_LOGIN
    };
}

function postLoginError(error) {
    return {
        type: POST_LOGIN_ERROR,
        error
    };
}

export function postLogin({page} = {}) {
    return async dispatch => {
        dispatch(postLoginStart());

        triggerLogInFlow({
            cb: () => {
                dispatch(fetchProfile());
                dispatch(successAuth());
            },
            onError: (err) => {
                dispatch(postLoginError(err));
            },
            page
        });
    };
}


/*
 Restore
 */
function postRestoreStart() {
    return {
        type: POST_SIGNUP
    };
}

function postRestoreError(error) {
    return {
        type: POST_RESTORE_ERROR,
        error
    };
}

function postRestoreSuccess() {
    return {
        type: POST_RESTORE_SUCCESS,
        // TODO: need to show some success message - need deign
    };
}

export function postRestore({email}) {
    return (dispatch) => {
        dispatch(postRestoreStart());

        return fetch({
            method: 'POST',
            endpoint: 'auth/forgotpassword',
            data: {
                Email: email,
            }
        }).then((json) => {
            dispatch(postRestoreSuccess());
        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(postRestoreError(error));
            throw error;
        });
    };
}


/*
 Logout
 */
function postLogoutSuccess() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

export function postLogout({page, onSuccess} = {}) {
    return async dispatch => {
        triggerLogOutFlow({
            cb: () => {
                dispatch(postLogoutSuccess());
                if (onSuccess) onSuccess();
            },
            onError: () => {
                dispatch(postLogoutSuccess());
                if (onSuccess) onSuccess();
            },
            page
        });
    };
}


/*
 Facebook
 */

export function authWithFacebook() {
    return (dispatch) => {
        triggerLogInFlow({
            isFB: true,
            cb: () => {
                dispatch(fetchProfile());
                // dispatch(successAuth());
            },
            onError: (err) => {
                dispatch(postLoginError(err));
            }
        });
    };
}
