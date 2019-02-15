import {UserManager, WebStorageStateStore} from 'oidc-client'
import {saveAuthSettings, getAuthSettings} from './auth-utils'
import {getHashParameters, getURLHash} from './utils';

export const authURLHandler = function (callback) {
    const url = window.location.href;

    const set = getAuthSettings() || {}; // {page, isPopup, isLogOut}
    const manager = new UserManager({
        userStore: new WebStorageStateStore({store: window.localStorage})
    });

    const params = getHashParameters(url);

    function clearHash() {
        window.setTimeout(function () {
            window.location.hash = '/';
        }, 100);
    }

    function closeWinAttempt() {
        window.setTimeout(function () {
            if (window !== window.parent) window.parent.close();
            else window.close();
        }, 300);
    }

    function onLoginCallbacks() {
        if (set.isPopup) {
            manager.signinPopupCallback();
            closeWinAttempt();
        } else {
            manager.signinRedirectCallback();
            clearHash();

            window.setTimeout(function () {
                // change page here, taken from set.page
                // but first save it somewhere
                if (callback) callback();
            }, 1000);
        }

        saveAuthSettings({page: set.page})
    }

    if (set.isLogOut) {
        if (set.isPopup) {
            manager.signoutPopupCallback();
            closeWinAttempt();
        } else {
            manager.signoutRedirectCallback();
            clearHash();
            if (callback) callback();
        }

        saveAuthSettings({page: set.page})
    }

    if (params.access_token && params.id_token)
        onLoginCallbacks();

    if (params.error) {
        switch (params.error) {
            // user is not logged in or token has to be obtained using UI
            case 'login_required':

                break;
            // user has to grant permissions to the app to get be logged in
            case 'consent_required':

                break;
        }

        console.warn('Authorization error occurred', params.error);

        if (set.isPopup) {
            closeWinAttempt();
        } else {
            clearHash();
        }
        saveAuthSettings({page: set.page})
    }
};
