import {
	SELECT_QUIZ,
	FETCH_QUIZ,
	FETCH_QUIZ_SUCCESS,
	FETCH_QUIZ_ERROR,
	FETCH_ODDS,
	FETCH_ODDS_SUCCESS,
	FETCH_ODDS_ERROR,

	POST_QUIZ_BET,
	POST_QUIZ_BET_SUCCESS,
	POST_QUIZ_BET_ERROR,
    POST_QUIZ_BET_RESET,

	POST_QUIZ_PREDICTION,
	POST_QUIZ_PREDICTION_SUCCESS,
	POST_QUIZ_PREDICTION_ERROR,

	FETCH_PARTICIPANTS,
	FETCH_PARTICIPANTS_SUCCESS,
	FETCH_PARTICIPANTS_ERROR,

	SHOW_PARTICIPANTS,
    SHOW_PARTICIPANTS_RESET,
} from '../actions';


export function selectedMatchId(state = null, action) {
	switch (action.type) {
		case SELECT_QUIZ:
			return action.matchId;
		default:
			return state;
	}
}

function quizDataById(state = {
	isFetching: false,
	questionData: {},

	isValidating: false,
	odds: 0,
	answers: [],
	invalidOutcomes: [],

	isBetting: false,
	betSuccess: false,
	betError: ''
}, action) {
	switch (action.type) {
		case FETCH_QUIZ:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_QUIZ_SUCCESS:
			return {
				...state,
				isFetching: false,
				questionData: action.payload,
				lastUpdated: action.receivedAt,
			};
		case FETCH_ODDS:
			return {
				...state,
				answers: action.answers,
				isValidating: true,
			};
		case FETCH_ODDS_SUCCESS:
			return {
				...state,
				isValidating: false,
				odds: action.odds,
				invalidOutcomes: [],
				lastUpdated: action.receivedAt,
			};
		case FETCH_ODDS_ERROR:
			return {
				...state,
				isValidating: false,
				odds: 0,
				invalidOutcomes: action.invalidOutcomes,
			};
		case POST_QUIZ_BET:
			return {
				...state,
				isBetting: true,
				betSuccess: false,
				betError: '',
			};
		case POST_QUIZ_BET_SUCCESS:
			return {
				...state,
				isBetting: false,
				betSuccess: true,
				betError: '',
			};
		case POST_QUIZ_BET_ERROR:
			return {
				...state,
				isBetting: false,
				betSuccess: false,
				betError: action.error,
			};
        case POST_QUIZ_BET_RESET:
            return {
                ...state,
                isBetting: false,
                betSuccess: false,
                betError: ''
            };
		case FETCH_PARTICIPANTS:
			return {
				...state,
				participantsList: null,
				participantsError: null,
                participantsFetching: true
			};
		case FETCH_PARTICIPANTS_SUCCESS:
			return {
				...state,
				participantsList: action.participants,
				participantsError: null,
                participantsFetching: false
			};
		case FETCH_PARTICIPANTS_ERROR:
			return {
				...state,
				participantsError: action.error,
                participantsFetching: false
			};
		case SHOW_PARTICIPANTS:
			return {
				...state,
				showParticipants: true
			};
        case SHOW_PARTICIPANTS_RESET:
			return {
				...state,
				showParticipants: false
			};

		case POST_QUIZ_PREDICTION:
			return {
				...state,
				isPredicting: true,
				predictionSuccess: false,
				predictionError: ''
			};
		case POST_QUIZ_PREDICTION_SUCCESS:
			return {
				...state,
				isPredicting: false,
				predictionSuccess: true,
				predictionError: ''
			};
		case POST_QUIZ_PREDICTION_ERROR:
			return {
				...state,
				isPredicting: false,
				predictionSuccess: false,
				predictionError: action.error
			};
		default:
			return state;
	}
}

export function quizes(state = {}, action) {
	switch (action.type) {
		case SHOW_PARTICIPANTS:
        case SHOW_PARTICIPANTS_RESET:
		case FETCH_QUIZ:
		case FETCH_QUIZ_SUCCESS:
		case FETCH_ODDS:
		case FETCH_ODDS_SUCCESS:
		case FETCH_ODDS_ERROR:
		case POST_QUIZ_BET:
		case POST_QUIZ_BET_SUCCESS:
		case POST_QUIZ_BET_ERROR:
        case POST_QUIZ_BET_RESET:
		case FETCH_PARTICIPANTS:
		case FETCH_PARTICIPANTS_SUCCESS:
		case FETCH_PARTICIPANTS_ERROR:
		case POST_QUIZ_PREDICTION:
		case POST_QUIZ_PREDICTION_SUCCESS:
		case POST_QUIZ_PREDICTION_ERROR:
			return {
				...state,
				[action.matchId]: quizDataById(state[action.matchId], action)
			};
		default:
			return state;
	}
}
