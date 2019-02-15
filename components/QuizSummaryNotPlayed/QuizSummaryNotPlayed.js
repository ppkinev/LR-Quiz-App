import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {getFinalMatchScore, getWinnerOptions} from '../../lib/parseData.js';
import Link from '../Link';
import SharingControls from '../SharingControls';

import QuizSummaryParticipantsStats from '../QuizSummaryParticipantsStats';
import QuizSummaryParticipants from '../QuizSummaryParticipants';

import QuizSummaryMatchTime from '../QuizSummaryMatchTime';

import './QuizSummaryNotPlayed.scss';


class QuizSummaryNotPlayed extends Component {

    static propTypes = {
        matchId: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        questionList: PropTypes.array.isRequired,
        teamNames: PropTypes.array.isRequired,
        maxWonOdds: PropTypes.number.isRequired,
        maxWonPoints: PropTypes.number.isRequired,
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
                    startDate={ startDate }
                    isEnded={ isEnded }
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
                    First goal: <br />
                    { player }
                </div>
            );
        } else return '';
    }

    render() {
        const {isEnded, isLive, startDate, info, questionList, teamNames, maxWonOdds, maxWonPoints,
            user: {userId}, participants, participantsError, showParticipants, participantsFetching,
            openAuthPopup, isLoggedIn
        } = this.props;
        const score = getFinalMatchScore(questionList, teamNames);
        const [teamHome, teamAway] = teamNames;
        const [scoreHome, scoreAway] = score;
        const scoreStr = `${scoreHome}:${scoreAway}`;
        const oddsStr = [maxWonOdds, 1].join('-');
        let oddsPointsOfWinner = '';
        if (maxWonPoints) {
            oddsPointsOfWinner =
                <span className="btn-text-sm">{ `Odds: ${oddsStr}  Max won ${maxWonPoints} pts` }</span>
        }

        let result = getWinnerOptions(questionList);

        let status = this.renderStatus(scoreStr, oddsPointsOfWinner);
        let goalScorer = this.getGoalScorer(result['FirstGoalScorer']);

        let teamScoreContainer = '';

        if (isEnded || isLive) {
            teamScoreContainer = (
                <div className="team-score-container">
                    { status }
                    <div className="team-score">{ scoreStr }</div>
                    { goalScorer }
                </div>
            );
        } else {
            teamScoreContainer = (
                <div className="upcoming-container">
                    <div className="team-score-title">Match starts in:</div>
                    <QuizSummaryMatchTime
                        startDate={ startDate }
                        isEnded={ isEnded }
                    />
                </div>
            );
        }

        const participantsElem = (!participants || participantsFetching) ? '' :
            <QuizSummaryParticipants
                participants={ participants }
                participantsError={ participantsError }
                isEnded={ isEnded }
                questions={ questionList }
                currentUserId={userId}
                showParticipants={showParticipants}
                scrollToParticipants={this.scrollToParticipants.bind(this)}
                openAuthPopup={openAuthPopup}
                isLoggedIn={isLoggedIn}
            />;

        return (
            <div className="quiz-content summary-played">
                <div className="summary-top">
                    <div className="quiz-info">{ info }</div>

                    <div className="summary-banner">

                        <div className="team-logo-small left">
                            <div className="team-logo-image-holder">
                                <img src={teamHome.ImageUrl}/>
                            </div>
                            <div className="text-small"><span>{ teamHome.Name.split(/(?=[A-Z])/).join(" ") }</span>
                            </div>
                        </div>

                        { teamScoreContainer }

                        <div className="team-logo-small right">
                            <div className="team-logo-image-holder">
                                <img src={teamAway.ImageUrl}/>
                            </div>
                            <div className="text-small text-right">
                                <span>{ teamAway.Name.split(/(?=[A-Z])/).join(" ") }</span></div>
                        </div>

                    </div>

                    <QuizSummaryParticipantsStats participants={participants}/>


                    <h4 className="participants-link-title">View all predictors</h4>
                </div>

                { participantsElem }

            </div>
        );
    }
}

export default QuizSummaryNotPlayed;
