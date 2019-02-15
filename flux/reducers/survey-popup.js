import {
    OPEN_SURVEY_POPUP,
    CLOSE_SURVEY_POPUP
} from '../actions';

export function surveyPopup(state = {
    isOpen: false,
    surveyUrl: '',
    earnId: ''
}, action) {

    switch (action.type) {
        case OPEN_SURVEY_POPUP:
            return {
                ...state,
                isOpen: true,
                surveyUrl: action.surveyUrl,
                earnId: action.earnId
            };

        case CLOSE_SURVEY_POPUP:
            return {
                ...state,
                isOpen: false,
                surveyUrl: '',
                earnId: ''
            };

        default:
            return state;
    }
}
