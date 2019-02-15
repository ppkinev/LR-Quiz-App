import React, {Component, PropTypes} from 'react';
import Location from '../../lib/Location.js';
import Link from '../Link';
import Button from '../Button';
import SharingControls from '../SharingControls';
import NotificationError from '../NotificationError';

import {AppConfig} from '../../lib/fetch';

import './summary.scss';


class QuizSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {predicted: false};
    }

    static propTypes = {
        matchId: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        teamNames: PropTypes.array.isRequired,
        summary: PropTypes.object.isRequired,
        invalidOutcomes: PropTypes.array.isRequired,
        onShowScreen: PropTypes.func.isRequired,
    };


    makePrediction() {
        const {matchId, summary, postQuizPrediction} = this.props;

        let answers = [];
        for (let answer in summary) {
            if (summary.hasOwnProperty(answer)) {
                if (!answers.some((a) => a === summary[answer].outcomeId)) {
                    answers.push(summary[answer].outcomeId);
                }
            }
        }

        postQuizPrediction(matchId, answers);
        this.setState({
            ...this.state,
            predicted: true
        });
        window.setTimeout(() => {
            Location.push({pathname: './bet', query: {matchId}});
        }, 1500);
    }

    clickPrediction() {
        const {openAuthPopup, isLoggedIn} = this.props;

        if (isLoggedIn) {
            this.makePrediction();
        } else {
            openAuthPopup();
        }
    }

    renderChoiceItems() {
        const {invalidOutcomes = []} = this.props;
        const {
            score = {},
            winner = {},
            halfTimeWinner = {},
            firstGoalScorer = {},
        } = this.props.summary;

        const MISSED = ' missed';
        const INVALID = ' invalid';

        const items = [
            {
                title: 'Winner',
                content: `${ winner.name } (${ score.scoreHome + ':' + score.scoreAway })`,
                missed: winner.name ? '' : MISSED,
                invalid: invalidOutcomes.some(o => o === winner.outcomeId) ? INVALID : ''
            },
            {
                title: 'Half-time',
                content: halfTimeWinner.name,
                missed: halfTimeWinner.name ? '' : MISSED,
                invalid: invalidOutcomes.some(o => o === halfTimeWinner.outcomeId) ? INVALID : ''
            },
            {
                title: 'First goal',
                content: firstGoalScorer.name ? firstGoalScorer.name : '?',
                missed: firstGoalScorer.name ? '' : MISSED,
                invalid: invalidOutcomes.some(o => o === firstGoalScorer.outcomeId) ? INVALID : ''
            }
        ];

        return items.map((i, ind) => {
            return (
                <li key={"choice-" + ind} className={"summary-choice" + i.missed + i.invalid}>
                    <div className="choice-text">
                        <span className="text-question">{ i.title }:</span> <span
                        className="text-choice">{ i.content }</span>
                    </div>
                </li>
            )
        });
    }

    getFooter() {
        const {isLoggedIn, badges = {}} = this.props;
        const isPredictorBadge = badges.earned && badges.earned.some(badge => badge.Title === 'Predictor');
        let summaryFooter = '';

        if (!isLoggedIn || !isPredictorBadge) {
            summaryFooter = (
                <div className='summary-footer'>
                    <div className='summary-footer-title'>You will receive a Predictor badge</div>
                    <img className='summary-footer-ico' src={ require('./images/predictor-icon.png') }/>
                </div>
            );
        } else {
            summaryFooter = (
                <div className='summary-footer'>
                    <img className='summary-footer-ico' src={ require('./images/cup.png') }/>
                    <div className='summary-footer-title'>Win points for every correct predictions <br/>&<br/> Be entered into Free weekly draws</div>
                </div>
            );
        }

        return summaryFooter;
    }

    getPredictionError(){
        const {predictionError} = this.props;

        if (predictionError)
            return <NotificationError text={predictionError} />;
        return '';
    }

    render() {
        const {
            info, teamNames, invalidOutcomes, onShowScreen, summary: {
            score = {},
        },
            justAuthorized,
            resetJustAuthorized,
            summary,
            summaryScreen
        } = this.props;

        const [teamHome, teamAway] = teamNames;
        const {scoreHome = '?', scoreAway = '?', questionId} = score;
        const scoreStr = `${scoreHome}:${scoreAway}`;
        // const showScoreScreen = () => onShowScreen(questionId);
        const showScoreScreen = () => onShowScreen(0);

        const choiceItems = this.renderChoiceItems();
        const hasInvalids = invalidOutcomes.length > 0;
        const predictedClass = this.state.predicted ? ' predicted' : '';
        const btnText = this.state.predicted ? 'Thanks!' : 'Submit Prediction';

        let btnOrError = (
            <div className="error-text">
                <h3 className="strong">Answers that marked in red<br/> contradict each other.</h3>
                Please change your answers
            </div>
        );
        if (!hasInvalids) {
            btnOrError = (
                <div className={"big-btn money-btn" + predictedClass}
                     onClick={this.clickPrediction.bind(this)}>{ btnText }</div>
            );
        }

        const summaryFooter = this.getFooter();

        const error = this.getPredictionError();

        // ...
        if (justAuthorized) {
            if (summaryScreen) {
                this.makePrediction();
            }
            resetJustAuthorized();
        }

        return (
            <div className="quiz-content summary predict">
                <div className="quiz-info">{ info }</div>

                <h2 className="quiz-title">Your prediction</h2>

                <div className="summary-prediction-panel">
                    <div className="summary-banner" onClick={ showScoreScreen }>

                        <div className="team-logo-small">
                            <img src={teamHome.ImageUrl}/>
                        </div>
                        <div className="team-score">{ scoreStr }</div>
                        <div className="team-logo-small">
                            <img src={teamAway.ImageUrl}/>
                        </div>

                    </div>

                    <ul className="summary-choices" onClick={ showScoreScreen }>
                        { choiceItems }
                    </ul>

                    { btnOrError }

                </div>

                { summaryFooter }

                { error }
            </div>
        );
    }
}

export default QuizSummary;
