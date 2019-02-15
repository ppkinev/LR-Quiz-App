import MobileDetect from "mobile-detect";

const md = new MobileDetect(window.navigator.userAgent);

// Wrapper for window.open()
//
export function Window() {
    var W = {};
    var windowRef = null;
    var windowTimer = null;

    W.open = function ({url, settings}, onClose) {
        if (windowRef == null || windowRef.closed) {
            windowTimer = window.setInterval(function () {
                if (!windowRef || windowRef.closed) {
                    window.clearInterval(windowTimer);
                    windowRef = null;
                    onClose();
                }
            }, 500);

            // Note: only '_blank' is supported by old Chrome/iOS
            // See: https://bugs.chromium.org/p/chromium/issues/detail?id=136610#c68
            windowRef = window.open(url, '_blank', settings || 'resizable=yes,scrollbars=yes,status=yes');
            windowRef.focus();
        } else {
            windowRef.focus();
        }
    };

    return W;
}

// is Safari: feature-detect
//
// export const isSafari = md.is('iPhone') && md.userAgent() === 'Safari'; //Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
export const isSafari = (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) || (md.is('iPhone') && md.userAgent() === 'Safari');


// Returns next *active* draw item after selected item: [a]
//  - if selected is the last active, then the first (active) item in list (loop). [b]
//  - if selected is the only active, then next item (despite it is inactive). [c]
//  - if selected is inactive, then first item. [d]
//
export function getNextDrawItem(drawList, selectedDrawId) {
    const selectedItem = drawList.find(({drawId}) => drawId === selectedDrawId);
    const nextItem = drawList[drawList.indexOf(selectedItem) + 1];
    const firstItem = drawList[0];

    if (!nextItem) return firstItem;
    if (!nextItem.isDrawn) {
        return nextItem; //a
    } else if (firstItem === selectedItem) {
        return nextItem; //c
    } else {
        return firstItem; //b, d
    }
}

export function getLatestStartedDrawItem(drawList) {
    const drawListSorted = drawList.slice().sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const latestNotDrawn = drawListSorted.find(({isDrawn}) => !isDrawn);
    return latestNotDrawn || drawListSorted[0];
}

export function findPublicPath() {
    const appScript = document.getElementById('entry');
    if (appScript) {
        return appScript.src.substring(appScript.src.indexOf('/'), appScript.src.lastIndexOf('/') + 1);
    } else {
        return './';
    }
}

export function getURLParameter(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getHashParameters(url) {
    // return empty object if no hash
    if ((url && url.indexOf('#') === -1) || window.location.hash === '') return {};

    const hash = url ? url.substring(url.lastIndexOf('#') + 1, url.length) : window.location.hash.substr(1);

    return hash.split('&').reduce((result, item) => {
        const parts = item.split('=');
        if (parts[0].length === 0 || parts[0] === '/') return result;
        result[parts[0]] = parts[1];
        return result;
    }, {});
}

export function getURLHash(url) {
    return url.substring(url.lastIndexOf('#') + 1, url.length)
}

export function numToFixed(num, fixed) {
    if (num === null || num === undefined || isNaN(num)) return new Error('NUM is not a number');
    if (fixed && fixed < 0) return num;
    const parts = String(num).split('.');
    if (parts.length === 1) return Number(parts[0]).toFixed(fixed);
    if (fixed === 0) return String(parts[0]);
    return `${parts[0]}.${parts[1].substring(0, fixed)}`;
}

export function isFacebookApp() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

export const CONFIRM_EMAIL_CODE_COOKIE = 'CONFIRM_EMAIL_CODE';

export function addBodySkinClass(skinName) {
    if (!skinName) return;
    switch (skinName) {
        case 'mbet':
            window.document.body.classList.add('mbet');
            break;
    }
}

export function getBrandName(skinName) {
    if (!skinName) return null;
    switch (skinName) {
        case 'mbet':
            return 'Marathon Bet';
        case 'everton':
            return 'Everton';
    }
}

export function getWelcomeImagesPath(skinName) {
    if (!skinName) return '';
    switch (skinName) {
        case 'mbet':
            return 'mbet-welcome/';
        case 'everton':
            return '';
    }
}

