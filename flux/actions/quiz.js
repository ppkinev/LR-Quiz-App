import fetch from '../../lib/fetch.js';
import {fetchProfileSuccess} from './profile.js';

export const SELECT_QUIZ = 'SELECT_QUIZ';
export const FETCH_QUIZ = 'FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'FETCH_QUIZ_SUCCESS';
export const FETCH_QUIZ_ERROR = 'FETCH_QUIZ_ERROR';
export const FETCH_ODDS = 'FETCH_ODDS';
export const FETCH_ODDS_SUCCESS = 'FETCH_ODDS_SUCCESS';
export const FETCH_ODDS_ERROR = 'FETCH_ODDS_ERROR';
export const POST_QUIZ_BET = 'POST_QUIZ_BET';
export const POST_QUIZ_BET_SUCCESS = 'POST_QUIZ_BET_SUCCESS';
export const POST_QUIZ_BET_ERROR = 'POST_QUIZ_BET_ERROR';
export const POST_QUIZ_BET_RESET = 'POST_QUIZ_BET_RESET';

export const POST_QUIZ_PREDICTION = 'POST_QUIZ_PREDICTION';
export const POST_QUIZ_PREDICTION_SUCCESS = 'POST_QUIZ_PREDICTION_SUCCESS';
export const POST_QUIZ_PREDICTION_ERROR = 'POST_QUIZ_PREDICTION_ERROR';

export const FETCH_PARTICIPANTS = 'FETCH_PARTICIPANTS';
export const FETCH_PARTICIPANTS_SUCCESS = 'FETCH_PARTICIPANTS_SUCCESS';
export const FETCH_PARTICIPANTS_ERROR = 'FETCH_PARTICIPANTS_ERROR';

export const SHOW_PARTICIPANTS = 'SHOW_PARTICIPANTS';
export const SHOW_PARTICIPANTS_RESET = 'SHOW_PARTICIPANTS_RESET';

export function selectQuiz(matchId) {
    return {
        type: SELECT_QUIZ,
        matchId
    };
}

function fetchQuizStart(matchId) {
    return {
        type: FETCH_QUIZ,
        matchId
    };
}

function fetchQuizSuccess(matchId, {
    StartDate: startDate,
    HomeTeam: teamHome,
    AwayTeam: teamAway,
    IsOpenForBetting: isOpenForBetting,
    IsEnded: isEnded,
    MaxWon: maxWonPoints,
    WinOdds: maxWonOdds,
    Questions: questionList,
}) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        matchId,
        payload: {
            startDate,
            teamHome,
            teamAway,
            isOpenForBetting,
            isEnded,
            maxWonPoints,
            maxWonOdds,
            questionList,
        },
        receivedAt: Date.now()
    };
}

function fetchQuizError(matchId, error) {
    return {
        type: FETCH_QUIZ_ERROR,
        matchId,
        error
    };
}

export function fetchQuiz(matchId) {
    return (dispatch) => {
        dispatch(fetchQuizStart(matchId));

        return fetch({
            endpoint: 'scorepredictor/getmatch',
            data: {
                'MatchId': matchId
            }
        }).then((json) => {
            dispatch(fetchQuizSuccess(matchId, json));
        }).catch((error) => {
            dispatch(fetchQuizError(matchId, error)); // TODO
        });
    };
}


/*
 Odds & validation
 */

function fetchOddsStart(matchId, answers) {
    return {
        type: FETCH_ODDS,
        matchId,
        answers,
    };
}

function fetchOddsSuccess(matchId, {OutcomeOdds: singles, ScorecastOdds: accumulator}) {
    return {
        type: FETCH_ODDS_SUCCESS,
        matchId,
        odds: {singles, accumulator},
        receivedAt: Date.now()
    };
}

function fetchOddsError(matchId, {InvalidOutcomeIds: invalidOutcomes = [], Message: validationError}) {
    return {
        type: FETCH_ODDS_ERROR,
        matchId,
        invalidOutcomes,
        validationError, // Unused
    };
}

export function fetchOdds(matchId, answers) {
    return (dispatch) => {
        dispatch(fetchOddsStart(matchId, answers));

        const data = {
            'matchid': matchId,
            'outcomeids': answers,
        };

        return fetch({
            method: 'POST',
            endpoint: 'scorepredictor/getodds',
            data
        }).then((json) => {
            dispatch(fetchOddsSuccess(matchId, json));
        }).catch((error) => {
            dispatch(fetchOddsError(matchId, error)); // TODO
        });
    };
}


/*
 Bet
 */


function postQuizBetStart(matchId) {
    return {
        type: POST_QUIZ_BET,
        matchId
    };
}

function postQuizBetSuccess(matchId) {
    return {
        type: POST_QUIZ_BET_SUCCESS,
        matchId,
        receivedAt: Date.now()
    };
}

function postQuizBetError(matchId, error) {
    return {
        type: POST_QUIZ_BET_ERROR,
        matchId,
        error,
    };
}

export function postQuizBet({matchId, credits, points, answers}) {
    return (dispatch) => {
        dispatch(postQuizBetStart(matchId));

        const data = {
            'MatchId': matchId,
            'CreditsAmount': credits,
            'PointsAmount': points,
            'OutcomeIds': answers,
        };

        return fetch({
            method: 'POST',
            endpoint: 'scorepredictor/bet',
            data
        }).then((json) => {
            dispatch(fetchProfileSuccess(json.User));
            dispatch(postQuizBetSuccess(matchId));
        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(postQuizBetError(matchId, error));
        });
    };
}

export function postQuizBetReset(matchId) {
    return (dispatch) => {
        dispatch({
            type: POST_QUIZ_BET_RESET,
            matchId
        });
    };
}

export function postQuizPrediction(matchId, answers) {
    return (dispatch) => {
        dispatch({type: POST_QUIZ_PREDICTION});

        const data = {
            'MatchId': matchId,
            'OutcomeIds': answers
        };

        return fetch({
            method: 'POST',
            endpoint: 'scorepredictor/makeprediction',
            data
        }).then((json) => {
            // dispatch(fetchProfileSuccess(json.User));
            dispatch({type: POST_QUIZ_PREDICTION_SUCCESS, matchId});
        }).catch(({Message: error = 'Invalid'}) => {
            dispatch({type: POST_QUIZ_PREDICTION_ERROR, matchId, error});
        });
    };
}

/* Get match participants */
function fetchParticipantsStart(matchId) {
    return {
        type: FETCH_PARTICIPANTS,
        matchId
    };
}

function fetchParticipantsSuccess(matchId, participants) {

    participants = participants['MatchQuizEntries'].map((p) => {
        p['UserRelationship'] = p['Player'];

        return p;
    });

    return {
        type: FETCH_PARTICIPANTS_SUCCESS,
        matchId, participants
    };
}

function fetchParticipantsError(matchId, error) {
    return {
        type: FETCH_PARTICIPANTS_ERROR,
        matchId, error
    };
}

export function fetchParticipants(matchId) {
    return (dispatch) => {
        dispatch(fetchParticipantsStart(matchId));

        const data = {'MatchId': matchId};
        return fetch({
            endpoint: 'scorepredictor/getmatchentries',
            data
        }).then((json) => {
            dispatch(fetchParticipantsSuccess(matchId, json));
        }).catch((err) => {
            dispatch(fetchParticipantsError(matchId, err));
        });
    };
}


export function showParticipants(matchId) {
    return (dispatch) => {
        dispatch({
            type: SHOW_PARTICIPANTS, matchId
        });
    };
}

export function showParticipantsReset(matchId) {
    return (dispatch) => {
        dispatch({
            type: SHOW_PARTICIPANTS_RESET, matchId
        });
    };
}
