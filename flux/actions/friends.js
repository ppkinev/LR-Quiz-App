import fetch from '../../lib/fetch.js';

export const FETCH_FRIENDS = 'FETCH_FRIENDS';
export const FETCH_FRIENDS_SUCCESS = 'FETCH_FRIENDS_SUCCESS';
export const FETCH_FRIENDS_ERROR = 'FETCH_FRIENDS_ERROR';
export const SEARCH_FRIENDS_START = 'SEARCH_FRIENDS_START';
export const SEARCH_FRIENDS_SUCCESS = 'SEARCH_FRIENDS_SUCCESS';
export const RESET_SEARCH = 'RESET_SEARCH';

export function fetchFriends() {
    return dispatch => {
        dispatch(fetchFriendsStart());

        return fetch({
            endpoint: 'friend/GetUserRelations'
        }).then(
            json => dispatch(fetchFriendsSuccess(json)),
            err => console.log(err) // TODO
        );
    }
}

function fetchFriendsStart() {
    return {
        type: FETCH_FRIENDS
    };
}

function fetchFriendsSuccess(payload) {
    return {
        type: FETCH_FRIENDS_SUCCESS,
        payload
    }
}

export function acceptFriendRequest(userId) {
    return (dispatch) => {

        return fetch({
            method: 'POST',
            endpoint: 'friend/AcceptFriendRequest',
            data: {
                UserId: userId
            }
        }).then(
            (json) => {
                dispatch(fetchFriends());
            },
            (error) => console.log('error ', error)
        ).catch(({Message: error = 'Invalid'}) => {
            throw error;
        });
    };
}

export function declineFriendRequest(userId) {
    return (dispatch) => {

        return fetch({
            method: 'POST',
            endpoint: 'friend/DeclineFriendRequest',
            data: {
                UserId: userId
            }
        }).then(
            (json) => {
                dispatch(fetchFriends());
            },
            (error) => console.log('error ', error)
        ).catch(({Message: error = 'Invalid'}) => {
            throw error;
        });
    };
}

function searchFriendStart() {
    return {
        type: SEARCH_FRIENDS_START
    }
}

function searchFriendSucces(payload) {
    return {
        type: SEARCH_FRIENDS_SUCCESS,
        payload
    }
}

export function resetSearch() {
    return {
        type: RESET_SEARCH
    }
}

export function findUsers(query) {
    return dispatch => {
        dispatch(searchFriendStart());

        return fetch({
            method: 'POST',
            endpoint: 'friend/FindUsers',
            data: {
                query: query
            }
        }).then(
            (json) => {
                dispatch(searchFriendSucces(json));
            },
            (error) => {
                dispatch({type: FETCH_FRIENDS_ERROR});
                console.warn('error ', error);
            }
        ).catch(({Message: error = 'Invalid'}) => {
            dispatch({type: FETCH_FRIENDS_ERROR});
            console.warn('error ', error);
        });
    }
}
