import fetch, {apiPrefix, apiKey} from '../../lib/fetch.js';
import {Window} from '../../lib/utils.js';
import {fetchProfile, fetchProfileSuccess} from './profile.js';

const popup = Window();

export const FETCH_EARNS = 'FETCH_EARNS';
export const FETCH_USER_EARNS = 'FETCH_USER_EARNS';
export const FETCH_EARNS_SUCCESS = 'FETCH_EARNS_SUCCESS';
export const FETCH_EARNS_ERROR = 'FETCH_EARNS_ERROR';
export const CLOSE_FRIEND_WINDOW = 'CLOSE_FRIEND_WINDOW';

/*
 All earns
 */

function fetchEarnsStart() {
    return {
        type: FETCH_EARNS
    };
}

function fetchEarnsSuccess(json) {
    return {
        type: FETCH_EARNS_SUCCESS,
        payload: json.Offers.map(
            ({
                 Offer: {
                     Id: earnId,
                     ImageUrl,
                     Type: {
                         Group: {
                             Name: type,
                             ImageUrl: groupIcon
                         },
                         Name: subType,
                         ImageUrl: imageUrl,
                     },
                     Title: title,
                     Description: description,
                     PointsReward: earnPoints,
                     CustomData: customData,
                 },
                 TotalCompletersCount: completersCount,
                 RecentCompleters: recentCompleters
             }) => {
                return {
                    earnId,
                    type,
                    subType,
                    title,
                    description,
                    earnPoints,
                    customData,
                    imageUrl: ImageUrl || imageUrl,
                    groupIcon,
                    completersCount,
                    recentCompleters
                }
            }),
        receivedAt: Date.now()
    };
}

function fetchEarnsError(error) {
    return {
        type: FETCH_EARNS_ERROR,
        error
    };
}

export function fetchEarns() {
    return (dispatch) => {
        dispatch(fetchEarnsStart());

        return fetch({
            endpoint: 'Offer/GetOffers'
        }).then((json) => {
            dispatch(fetchEarnsSuccess(json));
        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(fetchEarnsError(error)); // TODO
        });
    };
}


/*
 User related earns
 */
export function fetchPlayedEarns() {
    return (dispatch) => {
        dispatch({type: FETCH_USER_EARNS});

        return fetch({
            endpoint: 'Offer/GetUserOffers'
        }).then((json) => {
            dispatch(fetchEarnsSuccess(json)); // just replaces all-items list
        }).catch(({Message: error = 'Invalid'}) => {
            // Nothing
        });
    };
}


/*
 Start earning flow
 */
export function postTrackOffer(earnId) {
    return (dispatch) => {
        return fetch({
            method: 'POST',
            endpoint: 'Offer/TrackOffer',
            data: {
                'OfferId': earnId,
            }
        }).then((json) => {
            dispatch(fetchProfileSuccess(json.User));
        });
    };
}

export function postCompleteOffer(earnId) {
    return (dispatch) => {
        return fetch({
            method: 'POST',
            endpoint: 'Offer/CompleteOffer',
            data: {
                'OfferId': earnId,
            }
        }).then(() => {
            dispatch(fetchProfile());
            dispatch(fetchPlayedEarns());
        }).catch(() => {
            //TODO
        });
    };
}

// TODO - why needed?
export function postCancelOffer(earnId) {
    return fetch({
        method: 'POST',
        endpoint: 'Offer/CancelOffer',
        data: {
            'OfferId': earnId,
        }
    });
}

export function startEarnSharingTwitter(earnId, customData) {
    return (dispatch) => {
        const {Hashtags, TweetText, Url} = customData;
        const url = `https://twitter.com/intent/tweet?text=${ encodeURI(TweetText) }&url=${ encodeURIComponent(Url) }&hashtags=${ Hashtags }`;

        dispatch(postTrackOffer(earnId));

        popup.open({url}, () => {
            dispatch(postCompleteOffer(earnId));
        });
    };
}

export function startEarnSharingFacebook(earnId, customData) {
    return (dispatch) => {
        const {Url} = customData;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(Url)}`;

        dispatch(postTrackOffer(earnId));

        popup.open({url}, () => {
            dispatch(postCompleteOffer(earnId));
        });
    };
}


// Close invite window

export function closeInvite() {
    return (dispatch) => {
        dispatch(inviteClose())
    }
}

function inviteClose() {
    return {
        type: CLOSE_FRIEND_WINDOW
    };
}
