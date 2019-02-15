import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Location from '../lib/Location';
import {
    fetchProfileIfNeeded, fetchFixturesIfNeeded,
    fetchPlayedFixtures, fetchQuiz, selectQuiz,
    fetchOdds, fetchBadges, fetchParticipants,
    postQuizPrediction, requestAuth, resetJustAuthorized
} from '../flux/actions';
import {Fetching} from '../components/Layout';
import withWelcome from '../components/withWelcome';
import QuizContainer from '../components/QuizContainer';
import QuizSummaryPlayed from '../components/QuizSummaryPlayed';
import QuizSummaryNotPlayed from '../components/QuizSummaryNotPlayed';

function goToFixturesPage() {
    Location.push({pathname: './fixtures'});
}


class Quiz extends Component {

    static title = '';

    state = {
        editQuizChoices: false
    };

    static propTypes = {
        params: PropTypes.object.isRequired,
        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        justAuthorized: PropTypes.bool,
        isFetching: PropTypes.bool.isRequired,
        fixtureItem: PropTypes.object,
        questionData: PropTypes.object,
        isValidating: PropTypes.bool,
        odds: PropTypes.number,
        invalidOutcomes: PropTypes.array,

        fetchProfile: PropTypes.func.isRequired,
        fetchFixtures: PropTypes.func.isRequired,
        fetchPlayedFixtures: PropTypes.func.isRequired,
        fetchQuiz: PropTypes.func.isRequired,
        selectQuiz: PropTypes.func.isRequired,
        fetchOdds: PropTypes.func.isRequired,
        postQuizPrediction: PropTypes.func.isRequired,
        openAuthPopup: PropTypes.func,
        resetJustAuthorized: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.editMatch = this.editMatch.bind(this);
    }

    getParticipants() {
        const {
            params: {matchId},
            fetchParticipants,
            fixtureItem,
            questionData = {},
            showParticipants,
        } = this.props;

        const {isOpenForBetting} = questionData;
        const {betAmount, answers, creditsBetAmount} = fixtureItem;
        const isPlayed = !!betAmount || !!creditsBetAmount
            || (answers && answers.length && !this.state.editQuizChoices);

        if (
            isPlayed || !isOpenForBetting || showParticipants
        ) {
            fetchParticipants(matchId);
        }
    }

    componentWillMount() {

        const {params} = this.props;

        // Url without matchId is not supported
        if (!params || !params.matchId) {
            goToFixturesPage();
        }
    }

    componentDidMount() {
        const {params: {matchId}, fetchFixtures, fetchQuiz, selectQuiz, fetchBadges} = this.props;

        this.isUpdateHeaderTitle = true;

        if (this.props.questionData) {
            this.isUpdateHeaderTitle = false;
            this.teamHome = this.props.questionData.teamHome.Name;
            this.teamAway = this.props.questionData.teamAway.Name;
        }

        selectQuiz(matchId); // first select, then fetch
        fetchQuiz(matchId).then(() => {
            // trying to get participants
            // or logic inside method
            this.getParticipants();
        });

        // fetchFixtures(); // for fixtureItem
        this.fetchPrivateData();
        fetchBadges();
    }

    componentWillReceiveProps({isLoggedIn}) {
        const {isLoggedIn: wasLoggedIn} = this.props;
        const justAuthorized = !wasLoggedIn && isLoggedIn;
        if (justAuthorized) {
            this.fetchPrivateData()
        }
    }

    fetchPrivateData() {
        const {fetchProfile, fetchPlayedFixtures} = this.props;
        try {
            fetchProfile(); // need points for bet, etc
            // fetchPlayedFixtures(); // for fixtureItem
        } catch (e) {
            //nothing
        }
    }

    reworkParticipants(participants) {
        if (!participants) {
            return {
                all: [], winners: [],
                losers: [], scores: []
            };
        }

        const all = participants;
        const winners = all.filter((p) => p['Predictions'].some((pr) => pr['IsCorrect']));
        const scores = all.filter((p) => p['Predictions'].every((pr) => pr['IsCorrect']));
        const losers = all.filter((p) => p['Predictions'].every((pr) => !pr['IsCorrect']));

        return {
            all, winners, losers, scores
        }
    }

    editMatch() {
        this.setState({...this.state, editQuizChoices: true});
    }

    render() {
        const {
            params: {matchId},
            isFetching,
            fixtureItem,
            questionData: {startDate, teamHome, teamAway, isOpenForBetting, isEnded, maxWonOdds, maxWonPoints, questionList} = {},
            isValidating,
            odds,
            invalidOutcomes,
            fetchOdds,
            isLoggedIn,
            badges,
            profile,
            participantsList,
            participantsError,
            participantsFetching,
            showParticipants,
            postQuizPrediction,
            openAuthPopup,
            justAuthorized,
            resetJustAuthorized
        } = this.props;
        const info = moment(startDate).format('D MMMM, HH:mm');
        const {betAmount, answers, isWinner, creditsBetAmount, pointsBetAmount, creditsWonAmount, pointsWonAmount, wonAmount} = fixtureItem;
        const isPlayed = !!betAmount || !!creditsBetAmount || (answers && answers.length && !this.state.editQuizChoices);
        const _fetchOdds = (matchId, answers) => fetchOdds(matchId, answers);
        const participants = this.reworkParticipants(participantsList);
        let isLive = false;


        if (teamHome && this.teamHome && teamAway && this.teamAway) {
            this.isUpdateHeaderTitle = true;
        }

        const nowU = moment(moment.now()).unix();
        const startDateU = moment(startDate).unix();

        if (startDateU - nowU <= 0) {
            isLive = true;
        }

        if (isFetching) {
            return <Fetching/>;
        }

        if ((!isOpenForBetting && !isPlayed) || (!isPlayed && showParticipants)) {
            // Closed for betting (finished match) and user didn't play it
            return (
                <QuizSummaryNotPlayed
                    matchId={ matchId }
                    info={ info }
                    teamNames={ [teamHome, teamAway] }
                    questionList={ questionList }
                    maxWonOdds={ maxWonOdds }
                    maxWonPoints={ maxWonPoints }
                    isOpenForBetting={ isOpenForBetting }
                    isEnded={ isEnded }
                    isUpdateHeaderTitle={ this.isUpdateHeaderTitle }
                    user={ profile }
                    participants={ participants }
                    participantsError={ participantsError }
                    participantsFetching={participantsFetching}
                    showParticipants={showParticipants}
                    isLive={ isLive }
                    startDate={ startDate }
                    openAuthPopup={ openAuthPopup }
                    isLoggedIn={isLoggedIn}
                />
            );
        }

        if (isPlayed) {
            // User played it
            return (
                <QuizSummaryPlayed
                    matchId={ matchId }
                    info={ info }
                    teamNames={ [teamHome, teamAway] }
                    questionList={ questionList }
                    betAmount={ betAmount }
                    creditsBetAmount={ creditsBetAmount }
                    creditsWonAmount={ creditsWonAmount }
                    pointsBetAmount={ pointsBetAmount }
                    pointsWonAmount={ pointsWonAmount }
                    wonAmount={ wonAmount }
                    isWinner={ isWinner }
                    isOpenForBetting={ isOpenForBetting }
                    isEnded={ isEnded }
                    answers={ answers }
                    odds={ odds }
                    maxWonOdds={ maxWonOdds }
                    maxWonPoints={ maxWonPoints }
                    fetchOdds={ _fetchOdds }
                    isUpdateHeaderTitle={ this.isUpdateHeaderTitle }
                    user={ profile }
                    participants={ participants }
                    participantsError={ participantsError }
                    participantsFetching={participantsFetching}
                    showParticipants={showParticipants}
                    editQuizChoices={ this.editMatch }
                    isLive={ isLive }
                    startDate={ startDate }
                    openAuthPopup={ openAuthPopup }
                    isLoggedIn={isLoggedIn}
                />
            );
        }

        // Upcoming match
        return (
            <QuizContainer
                key={`match-${matchId}`}
                matchId={ matchId }
                info={ info }
                teamNames={ [teamHome, teamAway] }
                questionList={ questionList }
                isValidating={ isValidating }
                odds={ odds }
                invalidOutcomes={ invalidOutcomes }
                fetchOdds={ _fetchOdds }
                isLoggedIn={ isLoggedIn }
                badges={ badges }
                isUpdateHeaderTitle={ this.isUpdateHeaderTitle }
                user={ profile }
                isOpenForBetting={ isOpenForBetting }
                postQuizPrediction={ postQuizPrediction }
                openAuthPopup={ openAuthPopup }
                justAuthorized={ justAuthorized }
                resetJustAuthorized={ resetJustAuthorized }
            />
        );
    }

}

// Connect to store
//
const mapStateToProps = (state) => {
    const quiz = state.quizes[state.selectedMatchId] || {isFetching: true};
    const fixtureItem = state.fixtures.list.find(f => f.matchId === state.selectedMatchId) || {};


    return {
        isLoggedIn: state.auth.isLoggedIn,
        justAuthorized: state.auth.justAuthorized,
        ...quiz,
        fixtureItem,
        badges: state.badges,
        profile: state.profile,
        participantsList: quiz.participantsList,
        participantsError: quiz.participantsError,
        participantsFetching: quiz.participantsFetching
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchProfileIfNeeded()),
        fetchFixtures: () => dispatch(fetchFixturesIfNeeded()),
        fetchPlayedFixtures: () => dispatch(fetchPlayedFixtures()),
        fetchQuiz: (matchId) => dispatch(fetchQuiz(matchId)),
        selectQuiz: (matchId) => dispatch(selectQuiz(matchId)),
        fetchOdds: (matchId, answer) => dispatch(fetchOdds(matchId, answer)),
        fetchBadges: () => dispatch(fetchBadges()),
        postQuizPrediction: (matchId, answers) => dispatch(postQuizPrediction(matchId, answers)),
        fetchParticipants: (matchId) => dispatch(fetchParticipants(matchId)),
        openAuthPopup: (view) => dispatch(requestAuth(view)),
        resetJustAuthorized: () => dispatch(resetJustAuthorized())
    };
};

export default withWelcome(connect(mapStateToProps, mapDispatchToProps)(Quiz));
