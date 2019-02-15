import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {UserManager, WebStorageStateStore} from 'oidc-client'
import rootReducer from './flux/reducers';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import Location from './lib/Location';
import Layout from './components/Layout';
import {findPublicPath, addBodySkinClass, getURLParameter, setCookie, CONFIRM_EMAIL_CODE_COOKIE} from './lib/utils.js';
import {fetchProfileIfNeeded} from './flux/actions';
import fetch, {getApp} from './lib/fetch.js';

import {checkApp, getAuthSettings, saveAuthSettings} from './lib/auth-utils';
import {authURLHandler} from './lib/auth-callbacks';
import {getHashParameters} from './lib/utils';

import initReactFastclick from 'react-fastclick';

const loggerMiddleware = createLogger();
let store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

const routes = {}; // Auto-generated on build. See tools/lib/routes-loader.js

// TODO: do proper caching for lifetime methods
let cacheImitationTime = null;
const CACHE_GAP = 10 * 60 * 1000;

const parseURLParams = (sourceParams) => {
    const params = {};
    for (let par in sourceParams) {
        if (sourceParams.hasOwnProperty(par)) {
            params[par.toLowerCase()] = sourceParams[par];
        }
    }

    if (params.confirmemailcode)
        setCookie(CONFIRM_EMAIL_CODE_COOKIE, params.confirmemailcode, 7);
};

const route = async (path, params = {}, callback) => {
    const handler = routes[path] || routes['/404'];
    const Component = await handler();
    const pageTitle = Component.title || '';

    parseURLParams(params);

    const isLoggedIn = store.getState().auth.isLoggedIn;

    await callback(
        <Layout title={pageTitle} path={path} isLoggedIn={isLoggedIn}>
            <Component params={params}/>
        </Layout>
    );
};

function doOnBeforeAppLoad(cb) {
    authURLHandler(() => {
        store.dispatch(fetchProfileIfNeeded());
    });
    if (cb) window.setTimeout(cb, 200)
}

function run() {
    // initReactFastclick();
    const container = document.getElementById('app');
    Location.listen(location => {
        const {pathname, query} = location;
        const path = pathname.slice(pathname.lastIndexOf('/'));

        route(path, query, async (component) => {
            ReactDOM.render(
                <Provider store={store}>
                    {component}
                </Provider>,
                container,
                () => {
                    // Track the page view event via Google Analytics
                    //window.ga('send', 'pageview');
                });
        });
    });

    if (window.config) addBodySkinClass(window.config.skin);
}

function checkIfSilentSignIn(callback) {
    // app is launched in iframe and has errors in url
    // most probably it is due to silent sign in attempt
    // so preventing the rest of app loading

    if (window.parent !== window) {
        if (getAuthSettings() && getAuthSettings().isSilent) {

            if (getHashParameters().error) {
                const err = getHashParameters().error;

                if (err === 'login_required') {
                    const settings = getAuthSettings();
                    settings.loginRequired = true;
                    saveAuthSettings(settings);
                }
            } else {
                (new UserManager({
                    userStore: new WebStorageStateStore({store: window.localStorage})
                })).signinRedirectCallback().catch(err => {
                    console.log(err)
                });
            }

            saveAuthSettings({...getAuthSettings(), isSilent: null});

            return null;
        } else {
            if (callback) callback();
        }
    } else {
        if (callback) callback();
    }
}

if (canUseDOM) {
// Run the application when both DOM is ready
// and page content is loaded

    checkIfSilentSignIn(() => {
        if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded',
                checkApp(() => {
                        doOnBeforeAppLoad(run)
                    }
                ));
        } else {
            window.attachEvent('onload',
                checkApp(() => {
                        doOnBeforeAppLoad(run)
                    }
                ));
        }
    });


    // See http://webpack.github.io/docs/configuration.html#output-publicpath
    __webpack_public_path__ = findPublicPath();
}

export default {route, routes};
