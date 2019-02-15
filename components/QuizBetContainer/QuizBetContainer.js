import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {requestAuth, postQuizBet, fetchBadges, postQuizBetReset, fetchOdds} from '../../flux/actions';
import {Fetching} from '../Layout';
import QuizBet from '../QuizBet';
import BetSuccess from '../BetSuccess';
import BetNoCreditsOffer from '../BetNoCreditsOffer';
import NotificationError from '../NotificationError';
import Location from '../../lib/Location';
import {AppConfig} from '../../lib/fetch';

import '../QuizContainer/quiz.scss';

function goToQuizPage(matchId) {
    Location.push({pathname: './quiz', query: {matchId}});
}

function goToExitPage() {
    Location.push({pathname: './bet-exit'});
}


class QuizBetContainer extends Component {

    static propTypes = {
        params: PropTypes.object.isRequired,
        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        points: PropTypes.number.isRequired,
        fixtureItem: PropTypes.object,
        quizData: PropTypes.object.isRequired,
        openAuthPopup: PropTypes.func.isRequired,
        postQuizBet: PropTypes.func.isRequired,

        fetchOdds: PropTypes.func.isRequired,
        friends: PropTypes.number
    };

    state = {
        view: 'bet',
        betWasMade: false
    };

    constructor(props) {
        super(props);
        // Redirect to the exit page if virtual betting is disabled server-side
        if (!AppConfig.virtualBetFlow) {
            goToExitPage();
        }
    }


    componentWillMount() {
        const {params: {matchId}, quizData: {answers}, fixtureItem, fetchOdds} = this.props;

        // Redirect back to quiz if no data in store (page refresh scenario is not supported)
        if (!answers) {
            goToQuizPage(matchId);
        } else {
            if (fixtureItem) {
                const outcomeIds = fixtureItem.answers ? fixtureItem.answers.map(({outcomeId}) => outcomeId) : answers;
                fetchOdds(matchId, outcomeIds);
            }
        }
    }

    nextView(view) {
        this.setState({view});
    }

    doNextStep() {
        const {
            quizData: {betSuccess},
            params: {matchId},
            postQuizBetReset
        } = this.props;

        if (betSuccess) {
            window.setTimeout(() => {
                postQuizBetReset(matchId);
                goToExitPage();
            }, 1000);
        }
    }

    submitCreditsBet(betCredits, outcomes) {
        const {
            params: {matchId},
            isLoggedIn,
            openAuthPopup,
            postQuizBet,
            fetchBadges
        } = this.props;

        fetchBadges();

        if (!isLoggedIn) {
            openAuthPopup();
        } else {
            postQuizBet({matchId, betCredits, outcomes}).then(() => {
                this.setState({betWasMade: true});
                this.doNextStep();
            });
        }
    }

    submitPointsBet(betPoints, outcomes) {
        const {
            params: {matchId},
            isLoggedIn,
            openAuthPopup,
            postQuizBet,
            fetchBadges
        } = this.props;

        fetchBadges();

        if (!isLoggedIn) {
            openAuthPopup();
        } else {
            postQuizBet({matchId, betPoints, outcomes}).then(() => {
                this.setState({betWasMade: true});
                this.doNextStep();
            });
        }
    }

    getErrorPopup() {
        const {quizData: {betError}, params: {matchId}, postQuizBetReset} = this.props;
        const reset = () => {
            postQuizBetReset(matchId);
        };

        if (betError) {
            return (
                <NotificationError text={betError} reset={reset}/>
            );
        }
        return '';
    }

    render() {
        if (!AppConfig.virtualBetFlow) {
            return <Fetching/>;
        }

        const {
            params: {matchId}, isLoggedIn, badges, points, credits, fixtureItem,
            quizData: {odds = {}, betError, betSuccess, answers, questionData},
            friends
        } = this.props;

        if (!odds.singles) {
            return <Fetching/>;
        }

        const singleOddsArr = odds.singles;
        const accumulatedOdds = odds.accumulator;
        const demoPoints = !isLoggedIn ? 10 : 0;
        const oddsList = [odds, 1];
        const {view} = this.state;
        const onSubmitCreditsBet = (betCredits, outcomes) => this.submitCreditsBet(betCredits, outcomes);
        const onSubmitPointsBet = (betPoints, outcomes) => this.submitPointsBet(betPoints, outcomes);
        const onDismissSuccess = () => goToExitPage();

        const betWasMade = this.state.betWasMade;
        const virtualFlowType = AppConfig.virtualBetFlow;
        const userCanBet = (virtualFlowType === 'credits' && credits > 0) || (virtualFlowType === 'points' && points > 0);

        let View;

        if (userCanBet || betWasMade) {
            if (view === 'bet') {
                View = <QuizBet
                    matchId={matchId}
                    isLoggedIn={isLoggedIn}
                    points={points}
                    credits={credits}
                    demoPoints={demoPoints}
                    accumulatedOdds={accumulatedOdds}
                    singleOddsArr={singleOddsArr}
                    betError={betError}
                    betSuccess={betSuccess}
                    onSubmitCreditsBet={onSubmitCreditsBet}
                    onSubmitPointsBet={onSubmitPointsBet}
                    answers={answers}
                    questionData={questionData}
                    fixtureItem={fixtureItem}
                    virtualFlowType={virtualFlowType}
                />;
            }
        } else {
            View = (
                <BetNoCreditsOffer
                    isLoggedIn={isLoggedIn}
                    teamHome={questionData.teamHome}
                    teamAway={questionData.teamAway}
                    recentPlayers={fixtureItem.recentPlayers}
                    totalPlayersCount={fixtureItem.totalPlayersCount}
                    friends={friends}
                />
            );
        }

        const error = this.getErrorPopup();

        return (
            <div className="quiz">
                {View}

                {error}
            </div>
        );
    }
}


// Connect to store
//
const mapStateToProps = (state) => {
    const matchId = state.selectedMatchId;
    const quizData = state.quizes[matchId] || {};
    const fixtureItem = state.fixtures.list.find(f => f.matchId === matchId) || {};

    return {
        isLoggedIn: state.auth.isLoggedIn,
        points: state.profile.points,
        credits: state.profile.credits,
        friends: state.profile.friendsCount,
        quizData,
        fixtureItem,
        badges: state.badges,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        openAuthPopup: () => dispatch(requestAuth()),
        postQuizBet: ({matchId, betCredits, betPoints, outcomes}) => dispatch(postQuizBet({matchId, credits: betCredits, points: betPoints, answers: outcomes})),
        postQuizBetReset: (matchId) => dispatch(postQuizBetReset(matchId)),
        fetchBadges: () => dispatch(fetchBadges()),
        fetchOdds: (matchId, outcomeIds) => dispatch(fetchOdds(matchId, outcomeIds))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizBetContainer);
