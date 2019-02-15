import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {
    parseWinOrDrawData,
    parseFirstGoalData,
    parseScoreData,
    getFinalMatchScore,
    getWinnerOptions
} from '../../lib/parseData.js';
import {numToFixed} from '../../lib/utils';
import Link from '../Link';
import SharingControls from '../SharingControls';

import QuizSummaryParticipantsStats from '../QuizSummaryParticipantsStats';
import QuizSummaryParticipants from '../QuizSummaryParticipants';

import QuizSummaryMatchTime from '../QuizSummaryMatchTime';

import './QuizSummaryPlayed.scss';


function getSummary(questionList, teamNames, answers) {
    return questionList.reduce((acc, questionData) => {

        let outcomeId = null;
        const rightChoice = answers.find(({questionId}) => questionId === questionData.QuestionId);
        if (rightChoice) outcomeId = rightChoice.outcomeId;

        switch (questionData.Type) {
            case 'FirstHalfResult':
                return {
                    ...acc,
                    ...parseWinOrDrawData(questionData, teamNames, outcomeId).summary,
                };
            case 'FirstGoalScorer':
                if (!outcomeId) {
                    return {
                        ...acc
                    }
                }
                return {
                    ...acc,
                    ...parseFirstGoalData(questionData, teamNames, outcomeId).summary
                };
            case 'CorrectScore':
                return {
                    ...acc,
                    ...parseScoreData(questionData, teamNames, null, outcomeId).summary,
                };
            default:
                return acc;
        }
    }, {
        score: {},
        winner: {},
        halfTimeWinner: {},
        firstGoalScorer: {},
    });
}

class QuizSummaryPlayed extends Component {

    static propTypes = {
        matchId: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        questionList: PropTypes.array.isRequired,
        teamNames: PropTypes.array.isRequired,
        betAmount: PropTypes.number.isRequired,
        isWinner: PropTypes.bool.isRequired,
        isEnded: PropTypes.bool.isRequired,
        answers: PropTypes.array.isRequired,
        odds: PropTypes.number.isRequired,
        maxWonOdds: PropTypes.number.isRequired,
        maxWonPoints: PropTypes.number.isRequired,
        fetchOdds: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    static contextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const {teamNames, isUpdateHeaderTitle} = this.props;
        this.context.updateHeader({
            title: isUpdateHeaderTitle ? `${teamNames[0].Name} vs ${teamNames[1].Name}` : ''
        });
    }

    moveScreen(elem, parent) {
        let MAX = parent.scrollHeight - window.innerHeight;

        if (MAX > 0) {
            const EDGE = 50;
            let id = setInterval(frame, 1);

            window.setTimeout(() => {
                if (id) window.clearInterval(id);
            }, 1200);

            function frame() {
                parent.scrollTop += 9;
                if (elem.getBoundingClientRect().top <= EDGE) clearInterval(id);
                if (parent.scrollTop >= elem.getBoundingClientRect().height) clearInterval(id);
            }

        }
    }

    scrollToParticipants(elem) {
        try {
            this.moveScreen(ReactDOM.findDOMNode(elem), ReactDOM.findDOMNode(this));
        } catch (e) {
        }
    }

    renderChoiceItems() {
        const {questionList, teamNames, answers, isEnded} = this.props;
        const {score, winner, halfTimeWinner, firstGoalScorer} = getSummary(questionList, teamNames, answers);

        const CORRECT = 'correct';
        const INCORRECT = 'incorrect';

        const predictedScore = `(${score.scoreHome}:${score.scoreAway})`;

        let result = getWinnerOptions(questionList);

        let winnerClass = result['CorrectScore'] ? (result['CorrectScore'].team === winner.name ? CORRECT : INCORRECT) : '';
        let goalScorerClass = (result['FirstGoalScorer'] && firstGoalScorer) ? (firstGoalScorer.name === result['FirstGoalScorer'].goalScorer ? CORRECT : INCORRECT) : '';
        let halfWinnerClass = result['FirstHalfResult'] ? (result['FirstHalfResult'].team === halfTimeWinner.name ? CORRECT : INCORRECT) : '';

        if (!isEnded) {
            winnerClass = goalScorerClass = halfWinnerClass = '';
        }

        let choiceItems = [
            (
                <li key="choice-0" className={"summary-choice " + winnerClass}>
                    <div className="choice-text">
                        <span className="text-question">Winner:</span> <span
                        className="text-choice">{winner.name} {predictedScore}</span>
                    </div>
                </li>
            ),
            (
                <li key="choice-1" className={"summary-choice " + halfWinnerClass}>
                    <div className="choice-text">
                        <span className="text-question">Half-time:</span> <span
                        className="text-choice">{halfTimeWinner.name}</span>
                    </div>
                </li>
            ),
            (
                <li key="choice-2" className={"summary-choice " + goalScorerClass}>
                    <div className="choice-text">
                        <span className="text-question">First goal:</span> <span
                        className="text-choice">{firstGoalScorer.name ? firstGoalScorer.name : '?'}</span>
                    </div>
                </li>
            )
        ];

        return {
            score,
            choiceItems,
        };
    }

    renderStatus() {
        const {isEnded, isLive, startDate} = this.props;

        if (isEnded) {
            return (
                <div className="status-title">Match ended</div>
            );
        }

        if (isLive) {
            return (
                <QuizSummaryMatchTime
                    startDate={startDate}
                    isEnded={isEnded}
                />
            );
        }

        return '';
    }

    getGoalScorer(player) {
        if (player) {
            player = player['goalScorer'];
            return (
                <div className="summary-subtitle-bottom">
                    First goal: <br/>
                    {player}
                </div>
            );
        } else return '';
    }

    getFinalScore(score) {
        if (score) {
            if (Array.isArray(score)) return score.join(':');
            return score['score'].replace('-', ':');
        }
        return '?:?';
    }

    getEditBtn() {
        const {isOpenForBetting, creditsBetAmount, pointsBetAmount, editQuizChoices} = this.props;

        if (isOpenForBetting && (!creditsBetAmount && !pointsBetAmount)) {
            return (
                <div className="summary-edit-btn" onClick={editQuizChoices}></div>
            );
        }
        return '';
    }

    getBetBtn() {
        const {isOpenForBetting, creditsBetAmount, pointsBetAmount, matchId, creditsWonAmount, pointsWonAmount, wonAmount} = this.props;

        const title = creditsBetAmount ? 'Increase bet' : 'Place bet';
        let bet = creditsBetAmount ?
            <div className="summary-bet">You bet <span className="bet-bold">£{numToFixed(creditsBetAmount, 2)}</span>
            </div> : '';
        if (pointsBetAmount) bet = <div className="summary-bet">You bet <span className="bet-bold">{pointsBetAmount} points</span></div>;

        if (isOpenForBetting) {
            return (
                <div className="summary-card">
                    {bet}
                    <Link className="summary-card-btn" to="./bet" query={{matchId}}>{title}</Link>
                </div>
            );
        }

        if (creditsWonAmount) {
            return (
                <div className="summary-card">
                    {bet}
                    <div className="summary-card-btn green">You won £{numToFixed(creditsWonAmount, 2)}</div>
                </div>
            );
        }

        if (pointsWonAmount) {
            return (
                <div className="summary-card">
                    {bet}
                    <div className="summary-card-btn green">You won {pointsWonAmount} points</div>
                </div>
            );
        }

        if (creditsBetAmount || pointsBetAmount) {
            return (
                <div className="summary-card">
                    {bet}
                </div>
            );
        }

        return '';
    }


    render() {
        const {
            isEnded, isLive, startDate, info, teamNames, questionList,
            user: {imageUrl: userImage, userId}, participants, participantsError, showParticipants, participantsFetching,
            openAuthPopup, isLoggedIn
        } = this.props;
        const {score: betScore, choiceItems} = this.renderChoiceItems();
        const [teamHome, teamAway] = teamNames;
        const {scoreHome: betScoreHome, scoreAway: betScoreAway} = betScore;

        const result = getWinnerOptions(questionList);
        // const scoreStr = this.getFinalScore(result['CorrectScore']);
        const score = getFinalMatchScore(questionList, teamNames);
        const [scoreHome, scoreAway] = score;
        const scoreStr = `${scoreHome}:${scoreAway}`;

        let status = this.renderStatus();
        let goalScorer = this.getGoalScorer(result['FirstGoalScorer']);

        let editBtn = this.getEditBtn();

        let teamScoreContainer = '';

        if (isEnded || isLive) {
            teamScoreContainer = (
                <div className="team-score-container">
                    {status}
                    <div className="team-score">{scoreStr}</div>
                    {goalScorer}
                </div>
            );
        } else {
            teamScoreContainer = (
                <div className="upcoming-container">
                    <div className="team-score-title">Match starts in:</div>
                    <QuizSummaryMatchTime
                        startDate={startDate}
                        isEnded={isEnded}
                    />
                </div>
            );
        }

        const participantsElem = (!participants || participantsFetching) ? '' :
            <QuizSummaryParticipants
                participants={participants}
                participantsError={participantsError}
                isEnded={isEnded}
                questions={questionList}
                currentUserId={userId}
                showParticipants={showParticipants}
                scrollToParticipants={this.scrollToParticipants.bind(this)}
                openAuthPopup={openAuthPopup}
                isLoggedIn={isLoggedIn}
            />;

        return (
            <div className="quiz-content summary-played">
                <div className="summary-top">
                    <div className="quiz-info">{info}</div>

                    <div className="summary-banner">
                        <div className="team-logo-small left">
                            <div className="team-logo-image-holder">
                                <img src={teamHome.ImageUrl}/>
                            </div>
                            <div className="text-small"><span>{teamHome.Name.split(/(?=[A-Z])/).join(" ")}</span>
                            </div>
                        </div>

                        {teamScoreContainer}

                        <div className="team-logo-small right">
                            <div className="team-logo-image-holder">
                                <img src={teamAway.ImageUrl}/>
                            </div>
                            <div className="text-small text-right">
                                <span>{teamAway.Name.split(/(?=[A-Z])/).join(" ")}</span></div>
                        </div>
                    </div>

                    <QuizSummaryParticipantsStats participants={participants}/>

                    <div className="summary-card">
                        <div className="image-holder">
                            <img src={userImage}/>
                        </div>
                        <div className="summary-holder">
                            <h3>Your predictions</h3>
                            <ul className="summary-choices">
                                {choiceItems}
                            </ul>
                        </div>
                        {editBtn}
                    </div>

                    {this.getBetBtn()}

                    <h4 className="participants-link-title">View all predictors</h4>
                </div>

                {participantsElem}
            </div>
        );
    }
}

export default QuizSummaryPlayed;
