import fetch from '../../lib/fetch.js';

export const FETCH_FIXTURES = 'FETCH_FIXTURES';
export const FETCH_FIXTURES_SUCCESS = 'FETCH_FIXTURES_SUCCESS';
export const FETCH_FIXTURES_ERROR = 'FETCH_FIXTURES_ERROR';

export const FETCH_PLAYED_FIXTURES = 'FETCH_PLAYED_FIXTURES';
export const FETCH_PLAYED_FIXTURES_SUCCESS = 'FETCH_PLAYED_FIXTURES_SUCCESS';
export const FETCH_PLAYED_FIXTURES_ERROR = 'FETCH_PLAYED_FIXTURES_ERROR';

export const UPDATE_FIXTURES = 'UPDATE_FIXTURES';
export const UPDATE_FIXTURES_SUCCESS = 'UPDATE_FIXTURES_SUCCESS';
export const UPDATE_FIXTURES_ERROR = 'UPDATE_FIXTURES_ERROR';

export const FETCH_TOURNAMENTS_SUCCESS = 'FETCH_TOURNAMENTS_SUCCESS';

let tournaments = [];

/*
 All fixtures
 */
function fetchFixturesStart() {
    return {
        type: FETCH_FIXTURES
    };
}

function fetchFixturesSuccess(json, tournaments) {
    return {
        type: FETCH_FIXTURES_SUCCESS,
        payload: json['Matches'].map(
            ({
                MatchId: matchId,
                StartDate: startDate,
                HomeTeam: teamHome,
                AwayTeam: teamAway,
                IsOpenForBetting: isOpenForBetting,
                IsEnded: isEnded,

                RecentPlayers: recentPlayers,
                TotalPlayersCount: totalPlayersCount
            }) => {
                return {
                    matchId,
                    startDate,
                    teamHome,
                    teamAway,
                    isOpenForBetting,
                    isEnded,

                    recentPlayers,
                    totalPlayersCount
                }
            }),
        tournaments,
        receivedAt: Date.now()
    };
}

function updateFixturesSuccess(json, tournaments) {
    return {
        type: UPDATE_FIXTURES_SUCCESS,
        payload: json['Matches'].map(
            ({
                MatchId: matchId,
                StartDate: startDate,
                HomeTeam: teamHome,
                AwayTeam: teamAway,
                IsOpenForBetting: isOpenForBetting,
                IsEnded: isEnded,

                RecentPlayers: recentPlayers,
                TotalPlayersCount: totalPlayersCount
            }) => {
                return {
                    matchId,
                    startDate,
                    teamHome,
                    teamAway,
                    isOpenForBetting,
                    isEnded,

                    recentPlayers,
                    totalPlayersCount
                }
            }),
        tournaments,
        receivedAt: Date.now()
    };
}

function fetchFixturesError(error) {
    return {
        type: FETCH_FIXTURES_ERROR,
        error
    };
}

function fetchTournamentsSuccess(payload) {
    return {
        type: FETCH_TOURNAMENTS_SUCCESS,
        payload
    };
}

export function fetchTournaments() {
    return (dispatch) => {
        dispatch(fetchFixturesStart());

        return fetch({
            endpoint: 'scorepredictor/gettournaments'
        }).then((json) => {
            json.Tournaments.sort(sortTornamentsByDate);
            tournaments = json;
            dispatch(fetchFixtures({id: json.Tournaments[0].TournamentId}));
        }).catch(({Message: error = 'Invalid'}) => {
            // dispatch(fetchFixturesError(error)); // TODO
        });
    };
}

export function fetchFixtures({id: tournamentId, skip = 0, take = 20}) {
    return (dispatch, getState) => {
        dispatch(fetchFixturesStart());

        const data = {
            'tournamentid': tournamentId,
            skip, take
        };

        return fetch({
            endpoint: 'scorepredictor/getmatches',
            data
        }).then((json) => {
            if (getState().auth.isLoggedIn) {
                dispatch(fetchPlayedFixtures(tournamentId, json));
            } else {
                dispatch(fetchFixturesSuccess(json, tournaments));
            }
        }).catch(({Message: error = 'Invalid'}) => {
            // dispatch(fetchFixturesError(error)); // TODO
        });
    };
}

export function updateFixtures({id: tournamentId, skip = 0, take = 20}) {
    return (dispatch, getState) => {
        dispatch({type: UPDATE_FIXTURES});
        const data = {'tournamentid': tournamentId, skip, take};
        const playedFixturesSaved = getState().fixtures.listCount > 0;
        return fetch({
            endpoint: 'scorepredictor/getmatches',
            data
        }).then((json) => {
            if (getState().auth.isLoggedIn && !playedFixturesSaved) {
                dispatch(fetchPlayedFixtures(tournamentId, json));
            } else {
                dispatch(updateFixturesSuccess(json, tournaments));
            }
        }).catch(({Message: error = 'Invalid'}) => {
            // dispatch(fetchFixturesError(error)); // TODO
        });
    };
}

/*
 User completed fixtures
 */
function fetchPlayedFixturesStart() {
    return {
        type: FETCH_PLAYED_FIXTURES
    };
}

function fetchPlayedFixturesSuccess(json) {
    return {
        type: FETCH_PLAYED_FIXTURES_SUCCESS,
        payload: json.MatchQuizEntries.map(({
            MatchId: matchId,
            BetAmount: betAmount,
            IsWinner: isWinner,
            WonAmount: wonAmount,
            CreditsBetAmount: creditsBetAmount,
            CreditsWonAmount: creditsWonAmount,
            PointsBetAmount: pointsBetAmount,
            PointsWonAmount: pointsWonAmount,
            Predictions,
            Bets
        }) => {
            let bets = null;
            if (Bets && Bets.length) {
                bets = Bets.map((b) => {
                    const {
                        BetType: betType,
                        CreditsBetAmount: creditsBetAmount,
                        CreditsWonAmount: creditsWonAmount,
                        PointsBetAmount: pointsBetAmount,
                        PointsWonAmount: pointsWonAmount,
                        IsWinner: isWinner,
                        Predictions: predictions
                    } = b;

                    const answers = predictions.map(({OutcomeId: outcomeId, QuestionId: questionId, IsCorrect: isCorrect}) => {
                        return {outcomeId, questionId, isCorrect};
                    });

                    return {
                        betType, creditsBetAmount, creditsWonAmount, pointsBetAmount, pointsWonAmount, isWinner, answers
                    };
                });
            }

            const answers = Predictions.map(({OutcomeId: outcomeId, QuestionId: questionId, IsCorrect: isCorrect}) => {
                    return {
                        outcomeId,
                        questionId,
                        isCorrect
                    };
                }
            );

            return {
                matchId,
                betAmount,
                creditsBetAmount,
                pointsBetAmount,
                isWinner,
                wonAmount,
                creditsWonAmount,
                pointsWonAmount,
                bets,
                answers
            }
        }),
        receivedAt: Date.now()
    };
}

function fetchPlayedFixturesError(error) {
    return {
        type: FETCH_PLAYED_FIXTURES_ERROR,
        error
    };
}

export function fetchPlayedFixtures(tournamentId, fixtures) {
    return (dispatch, getState) => {

        return fetch({
            endpoint: 'scorepredictor/getuserentries',
            data: {
                'tournamentid': tournamentId
            }
        }).then((json) => {

            dispatch(fetchFixturesSuccess(fixtures, tournaments));
            dispatch(fetchPlayedFixturesSuccess(json));

        }).catch(({Message: error = 'Invalid'}) => {
            dispatch(fetchPlayedFixturesError(error));
        });
    };
}

function sortTornamentsByDate(a, b) {
    return new Date(b.StartDate) - new Date(a.StartDate);
}
