import fetch from '../../lib/fetch.js';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const UPDATE_FRIEND_RELS = 'UPDATE_FRIEND_RELS';

export function fetchFriendProfile(userId) {
    return dispatch => {
        dispatch(fetchFriendStart());

        return fetch({
            endpoint: '/user/getuser',
            data: {
                'userId': userId
            }
        }).then(
            json => {
                dispatch(fetchFriendSuccess(json));
            },
            err => console.log(err) // TODO
        );
    }
}

function fetchFriendStart() {
    return {
        type: FETCH_USER
    }
}

function fetchFriendSuccess(payload) {
    return {
        type: FETCH_USER_SUCCESS,
        payload
    }
}

function friendRequestSent(payload) {
    return {
        type: UPDATE_FRIEND_RELS,
        payload
    }
}

export function sendFriendRequest(userId) {
    return (dispatch) => {

        return fetch({
            method: 'POST',
            endpoint: 'friend/SendFriendRequest',
            data: {
                UserId: userId
            }
        }).then(
            (json) => {
                dispatch(friendRequestSent(json));
            },
            (error) => console.log('error ', error)
        ).catch(({Message: error = 'Invalid'}) => {
            throw error;
        });
    };
}

export function follow(userId) {
    return (dispatch) => {

        return fetch({
            method: 'POST',
            endpoint: 'friend/Follow',
            data: {
                UserId: userId
            }
        }).then(
            (json) => {
                dispatch(friendRequestSent(json));
            },
            (error) => console.log('error ', error)
        ).catch(({Message: error = 'Invalid'}) => {
            throw error;
        });
    };
}

export function unfollow(userId) {
    return (dispatch) => {

        return fetch({
            method: 'POST',
            endpoint: 'friend/Unfollow',
            data: {
                UserId: userId
            }
        }).then(
            (json) => {
                dispatch(fetchFriendProfile(json.User.UserId));
            },
            (error) => console.log('error ', error)
        ).catch(({Message: error = 'Invalid'}) => {
            throw error;
        });
    };
}
