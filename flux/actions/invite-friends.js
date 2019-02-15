import fetch, {apiPrefix, apiKey} from '../../lib/fetch.js';
import {Window} from '../../lib/utils.js';

const popup = Window();

import {fetchProfile} from './profile.js';
import {fetchPlayedEarns} from './earns'

export const FETCH_INVITE_START = 'FETCH_INVITE_START';
export const FETCH_INVITE_SUCCESS = 'FETCH_INVITE_SUCCESS';
export const FETCH_INVITE_ERROR = 'FETCH_INVITE_ERROR';
export const GET_SOCIAL_INVITE_START = 'GET_SOCIAL_INVITE_START';
export const GET_SOCIAL_INVITE_SUCCESS = 'GET_SOCIAL_INVITE_SUCCESS';
export const GET_SOCIAL_INVITE_ERROR = 'GET_SOCIAL_INVITE_ERROR';
export const GET_INVITE_LINK = 'GET_INVITE_LINK';

export const SHOW_SOCIAL_MESSAGE = 'SHOW_SOCIAL_MESSAGE';
export const HIDE_SOCIAL_MESSAGE = 'HIDE_SOCIAL_MESSAGE';

export function showSocialBlock() {
    return (dispatch) => {
        return dispatch({
            type: SHOW_SOCIAL_MESSAGE,
            payload: true
        })
    }
}

export function hideSocial() {
    return (dispatch) => {
        return dispatch({
            type: HIDE_SOCIAL_MESSAGE,
            payload: false
        })
    }
}

function fetchInviteStart() {
    return {
        type: FETCH_INVITE_START
    }
}

function fetchInviteSuccess() {
    return {
        type: FETCH_INVITE_SUCCESS,
    }
}

function fetchInviteError(err) {
    return {
        type: FETCH_INVITE_ERROR,
        payload: err.message
    }
}


export function inviteFriends(email) {
    return (dispatch) => {
        dispatch(fetchInviteStart());
        return fetch({
            method: 'POST',
            endpoint: 'friend/invite',
            data: {
                'email': email
            }
        }).then(() => {
            dispatch(fetchInviteSuccess());
        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(fetchInviteError(error));
        });
    };
}


function fetchSocialInviteStart() {
    return {
        type: GET_SOCIAL_INVITE_START
    }
}


function inviteLinkGet(link) {
    return {
        type: GET_INVITE_LINK,
        payload: link
    }
}

export function getInviteLink() {
    return (dispatch) => {
        dispatch(fetchSocialInviteStart());
        return fetch({endpoint: 'friend/GetInviteLink'}).then((inviteLink) => {

            dispatch(inviteLinkGet(inviteLink.ShareUrl))

        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(fetchInviteError(error));
        });
    };
}


export function inviteSocialFriendsFacebook(link) {
    return (dispatch) => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;

        popup.open({url}, () => {
            dispatch(fetchProfile());
            dispatch(showSocialBlock());
        });
    }
}


export function inviteSocialFriendsTwitter(link) {
    return (dispatch) => {
        const TweetText = `Hey, mates! Join Everton Rewards team and get exclusive prizes!`;
        const Hashtags = 'Everton'
        const url = `https://twitter.com/intent/tweet?text=${ encodeURI(TweetText) }&url=${ encodeURIComponent(link) }&hashtags=${ Hashtags }`;
        popup.open({url}, () => {
            dispatch(fetchProfile());
            dispatch(showSocialBlock());
        });
    };
}


