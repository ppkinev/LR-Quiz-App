import fetch from '../../lib/fetch.js';

export const FETCH_LEADERBOARD_START = 'FETCH_LEADERBOARD_START';
export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';
export const FETCH_LEADERBOARD_ERROR = 'FETCH_LEADERBOARD_ERROR';
export const CURRENT_USER_INSIDE = 'CURRENT_USER_INSIDE';

function fetchLeaderboardStart() {
    return {
        type: FETCH_LEADERBOARD_START
    };
}

function fetchLeaderboardSuccess({Players: players}) {
    return {
        type: FETCH_LEADERBOARD_SUCCESS,
        payload: {
            players
        }
    }
}

function fetchLeaderboardError(error) {
    return {
        type: FETCH_LEADERBOARD_ERROR,
        error
    }
}

export function findCurrentUser(id) {
    return {
        type: CURRENT_USER_INSIDE,
        payload: id
    }
}


export function fetchLeaderboard(timeperiod = 'alltime', filtertype = 'allusers') {
    return (dispatch) => {
        dispatch(fetchLeaderboardStart());


        return fetch({
            endpoint: 'leaderboard/GetSPPlayersAnswers',
            data: {
                'timeperiod': timeperiod,
                'filtertype': filtertype
            }
        }).then((json) => {
            dispatch(fetchLeaderboardSuccess(json));
            dispatch(findCurrendUser())

        }).catch((error) => {
            dispatch(fetchLeaderboardError(error));
        });
    };
}


