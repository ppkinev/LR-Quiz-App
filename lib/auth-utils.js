import axios from 'axios'
import Qs from 'qs'
import isMobile from 'ismobilejs'
import {UserManager, WebStorageStateStore} from 'oidc-client'

export let userManager = null;

const authURLs = {
    everton: {
        live: 'https://everton.auth.rewarded.club',
        test: 'http://everton.auth-test.rewarded.club',
        dev: 'http://everton.auth.localhost:5001'
    },
    mancity: {
        live: 'https://mancity.auth.rewarded.club',
        test: 'http://mancity.auth-test.rewarded.club',
        dev: 'http://mancity.auth.localhost:5001'
    },
    qpr: {
        live: 'https://qpr.auth.rewarded.club',
        test: 'http://qpr.auth-test.rewarded.club',
        dev: 'http://qpr.auth.localhost:5001'
    }
};

const saveAccessToken = function (token) {
    window.localStorage.setItem(`${window.config.apiKey}:access_token`, token);
};

export const getAccessToken = function (callback) {
    if (!callback) return null;
    userManager.getUser().then(function (user) {
        if (user) {
            if (Date.now() - (user.expires_at * 1000) >= 0) {
                userManager.removeUser();
                callback(window.localStorage.getItem(`${window.config.apiKey}:access_token`));
            } else {
                callback(user.token_type + ' ' + user.access_token);
            }
        } else {
            callback(window.localStorage.getItem(`${window.config.apiKey}:access_token`));
        }
    });
};

export const saveAuthSettings = function ({page, isPopup, isLogOut, isSilent}) {
    window.localStorage.setItem(`${window.config.apiKey}:auth_settings`, JSON.stringify({
        page,
        isPopup,
        isLogOut,
        isSilent
    }));
};

export const getAuthSettings = function () {
    const set = window.localStorage.getItem(`${window.config.apiKey}:auth_settings`);
    return set && JSON.parse(set);
};

const prolongClientToken = function (expires_in, endpoint) {
    const THRESHOLD = 30;
    const checkIn = expires_in > THRESHOLD ? expires_in - THRESHOLD : expires_in;

    userManager.getUser().then(function (user) {
        if (!user) {
            const timeout = window.setTimeout(function () {
                window.clearTimeout(timeout);
                getClientToken({endpoint});
            }, checkIn * 1000);
        }
    });
};

function getClientToken({endpoint, cb}) {
    const data = Qs.stringify({
        client_id: window.config.apiKey,
        grant_type: 'client_credentials',
        scope: 'coreapi_full'
    });

    axios({url: endpoint, method: 'post', data: data})
        .then(function (response) {
            console.info('Getting client access token');
            const access_token = response.data.access_token;
            const token_type = response.data.token_type;
            const expires_in = response.data.expires_in;

            saveAccessToken(token_type + ' ' + access_token);

            prolongClientToken(expires_in, endpoint);
            if (cb) cb();
        })
        .catch(function (error) {
            console.warn('Failing client access token');
            console.warn(error);
        });
}

const initClientTokenFn = function (authURL, callback) {
    const configURL = authURL + '.well-known/openid-configuration';

    axios({url: configURL}).then(function (response) {
        console.info('Getting URL for obtaining client access token');
        getClientToken({endpoint: response.data.token_endpoint, cb: callback});
    }).catch(function (error) {
        console.warn('Failing getting URL for client access token');
        console.warn(error);
    });
};

const initUserManager = function (authURL, callback) {
    let callbackURI = window.location.origin + '?mode=spa';
    console.info('OpenID callbackURI', callbackURI);

    if (callbackURI.indexOf('localhost') !== -1) callbackURI = 'http://localhost/spr-matchquiz?mode=spa';

    userManager = new UserManager({
        authority: authURL,
        client_id: window.config.apiKey,
        redirect_uri: callbackURI, // on successful login getting back to the same page
        silent_redirect_uri: callbackURI, // trying same URI to fetch silent token renewal
        response_type: 'id_token token',
        scope: 'openid coreapi_full',
        post_logout_redirect_uri: callbackURI, // getting back to the same page on logout

        // setting local storage as default user storage
        userStore: new WebStorageStateStore({store: window.localStorage}),

        // should automatically renew the token using silent redirect page
        // check it, if not working, do this logic yourself
        automaticSilentRenew: true
    });

    userManager.events.addUserSignedOut(function () {
        userManager.removeUser();


        // DGW.global.methods.unAuthorize();
        // DGW.main.methods.changeMainState('profile');
    });

    window.userManager = userManager;

    if (getAuthSettings() && getAuthSettings().loginRequired) {
        userManager.removeUser();
    }

    // it uses authorization server to sign in in the background
    // if user logged in using other app
    // catch is needed as this shit always throws an error
    // right after retrieving the result
    saveAuthSettings({...getAuthSettings(), isSilent: callbackURI});
    userManager.signinSilent().catch(function (err) {
        // on iframe timeout, killing isSilent to prevent any further bugs
        saveAuthSettings({...getAuthSettings(), isSilent: null});
    });

    // wrapping with a timeout to make sure that signinSilent will be able to finish its job
    window.setTimeout(function () {
        if (callback) callback();
    }, 1000);
};

// public API call to retrieve auth server address
function dummyPublicAPICall(callback) {
    let authURL = authURLs.everton.live; // get this from the public API

    switch (window.config.envType) {
        case 'test':
            authURL = authURLs.everton.test;
            break;
        case 'local':
            authURL = authURLs.everton.dev;
    }

    if (authURL[authURL.length - 1] !== '/') authURL += '/';

    if (callback) callback(authURL);
}

function onSuccessLogIn(response, callback) {
    console.log(response);
    if (callback) callback(response);
}

function onSuccessLogOut(response, callback) {
    console.log(response);
    if (callback) callback(response);
}

const getPopupSettings = function ({w, h}) {
    const width = w || 480;
    const height = h || 750;

    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    return 'menubar=no,location=no,resizable=no,scrollbars=yes,status=no, ' +
        'width=' + width + ', ' +
        'height=' + height + ', ' +
        'top=' + top + ', ' +
        'left=' + left;
};

export const triggerLogInFlow = function ({page, isFB, cb, onError}) {
    const signinRequestArgs = {};

    if (isFB) signinRequestArgs.acr_values = 'idp:facebook';
    if (!isMobile.any) signinRequestArgs.popupWindowFeatures = getPopupSettings({w: 480, h: 750});

    if (isMobile.any) {
        // for mobile
        saveAuthSettings({page: page});

        userManager.signinRedirect(signinRequestArgs)
            .then(function (response) {
                onSuccessLogIn(response, cb);
            })
            .catch(function (err) {
                if (onError) onError(err);
                console.warn('OpenID redirect error', err);
            });
    } else {
        // for desktop

        saveAuthSettings({page: page, isPopup: true});

        userManager.signinPopup(signinRequestArgs)
            .then(function (response) {
                onSuccessLogIn(response, cb);
            })
            .catch(function (err) {
                if (onError) onError(err);
                console.warn('OpenID popup error', err);
            });
    }
};

export const triggerLogOutFlow = function ({page, cb, onError}) {
    if (isMobile.any) {
        // for mobile
        saveAuthSettings({page: page, isLogOut: true});

        userManager.signoutRedirect()
            .then(function (response) {
                onSuccessLogOut(response, cb);
            })
            .catch(function (err) {
                if (onError) onError(err);
                console.warn('OpenID redirect error', err);
            });
    } else {
        // for desktop
        saveAuthSettings({page: page, isPopup: true, isLogOut: true});

        userManager.signoutPopup({
            popupWindowFeatures: getPopupSettings({w: 780, h: 450})
        })
            .then(function (response) {
                onSuccessLogOut(response, cb);
            })
            .catch(function (err) {
                if (onError) onError(err);
                console.warn('OpenID popup error', err);
            });
    }

};

export const checkApp = function (callback) {
    dummyPublicAPICall(function (authURL) {
        initUserManager(authURL, function () {
            initClientTokenFn(authURL, callback);
        });
    });
};
