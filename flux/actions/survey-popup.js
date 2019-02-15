export const OPEN_SURVEY_POPUP = 'OPEN_SURVEY_POPUP';
export const CLOSE_SURVEY_POPUP = 'CLOSE_SURVEY_POPUP';

export function openSurveyPopup(earnId, surveyUrl) {
    return {
        type: OPEN_SURVEY_POPUP,
        earnId: earnId,
        surveyUrl: surveyUrl
    }
}

export function closeSurveyPopup() {
    return {
        type: CLOSE_SURVEY_POPUP
    }
}
