import React, {PropTypes} from 'react';
import './SurveyPopup.scss';

const SurveyPopup = ({survey, close}) => {
    const classes = ['survey-popup', ...(survey.isOpen ? ['visible'] : [])].join(' ');

    const url = survey.surveyUrl;
    const iframe = survey.isOpen ? <iframe className="survey-iframe" src={url}></iframe> : null;


    return (
        <div className={classes}>
            <div className="close-btn" onClick={ close }>Back to the app</div>
            <div className="iframe-holder">{ iframe }</div>
        </div>
    );
};

SurveyPopup.propTypes = {
    survey: PropTypes.object.isRequired,
    close: PropTypes.func,
    profile: PropTypes.object
};

export default SurveyPopup;
