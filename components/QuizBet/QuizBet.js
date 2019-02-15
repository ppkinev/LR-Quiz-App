import React, {Component, PropTypes} from 'react';
import Button from '../Button';
import Slider from '../Slider';
import SharingControls from '../SharingControls';
import NotificationError from '../NotificationError';

import './bet.scss';

import {numToFixed} from '../../lib/utils';


class QuizBet extends Component {

    static propTypes = {
        matchId: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
        demoPoints: PropTypes.number.isRequired,
        odds: PropTypes.array.isRequired,
        betError: PropTypes.string.isRequired,
        onSubmitCreditsBet: PropTypes.func.isRequired,
        onSubmitPointsBet: PropTypes.func.isRequired,
        virtualFlowType: PropTypes.string,
    };

    state = {
        accBetValue: undefined,
        outcomesClicked: [],
        accumClicked: null,
        singles: {}
    };

    constructor(props) {
        super(props);

        this.onSubmitCreditsBet = this.onSubmitCreditsBet.bind(this);
        this.onSubmitPointsBet = this.onSubmitPointsBet.bind(this);
    }

    componentWillMount() {
        const {credits, points, virtualFlowType} = this.props;
        const answers = this.getAnswerObjects();

        const maxCurrency = virtualFlowType === 'points' ? points : Number(numToFixed(credits, 2));
        // const maxCredits = credits > 0 ? Number(numToFixed(credits, 2)) : 0;

        let newState = this.state;
        for (let choice in answers) {
            if (answers.hasOwnProperty(choice)) {
                newState.singles[choice] = maxCurrency;
            }
        }

        this.setState(newState);
    }

    getFriendsParticipated(friends = [], index) {
        let images = [];
        for (let i = 0; i < friends.length; i++) {
            images.push(friends[i]['ImageUrl']);
            if (i === 2) break;
        }
        return (
            <div className="fixture-item-friends-holder">
                {
                    images.map(function (image, ind) {
                        return <div className="fixture-friend-holder">
                            <img src={image} key={index + ind}
                                 className="fixture-friends-image"/>
                        </div>
                    })
                }
            </div>
        );
    }

    getAnswerObjects() {
        const {answers: predictions, singleOddsArr, questionData: {questionList, teamHome, teamAway}, fixtureItem: {bets}} = this.props;

        const answers = (bets && bets.length) ? bets[bets.length - 1].answers.map(({outcomeId}) => outcomeId) : predictions;
        // const answers = predictions;
        let answerObjects = {};

        questionList.forEach((q) => {
            let result;

            for (let i = 0; i < answers.length; i++) {
                result = q['Outcomes'].filter(o => o['OutcomeId'] === answers[i]);
                if (result.length) {
                    result = result[0];

                    if (singleOddsArr && singleOddsArr.length) {
                        result.singleOdd = singleOddsArr.filter(odd => odd['OutcomeId'] === answers[i])[0];
                        result.singleOdd = result.singleOdd ? result.singleOdd['Odds'] : 1;
                    }
                    break;
                } else {
                    result = null;
                }
            }

            if (result) {
                switch (q['Type']) {
                    case 'FirstHalfResult':
                        answerObjects[q['Type']] = {
                            id: result['OutcomeId'],
                            title: 'Half-time',
                            team: result['Team'],
                            content: result['Team'],
                            singleOdd: result.singleOdd || 1
                        };
                        break;
                    case 'CorrectScore':
                        answerObjects[q['Type']] = {
                            id: result['OutcomeId'],
                            title: 'Final score',
                            team: result['Team'],
                            score: result['Score'].replace('-', ':'),
                            content: `${result['Team']} ${result['Score'].replace('-', ':')}`,
                            singleOdd: result.singleOdd || 1
                        };
                        break;
                    case 'FirstGoalScorer':
                        answerObjects[q['Type']] = {
                            id: result['OutcomeId'],
                            title: 'First goal',
                            team: result['ScorerTeam'],
                            scorer: result['FirstScorer'],
                            content: result['FirstScorer'],
                            singleOdd: result.singleOdd || 1
                        };
                        break;
                }
            }
        });

        for (let choice in answerObjects) {
            if (answerObjects.hasOwnProperty(choice)) {
                if (answerObjects[choice].team === teamAway['Name']) {
                    answerObjects[choice].icon = teamAway['ImageUrl'];
                } else if (answerObjects[choice].team === teamHome['Name']) {
                    answerObjects[choice].icon = teamHome['ImageUrl'];
                } else {
                    let href = teamHome['ImageUrl'];
                    answerObjects[choice].icon = `${href.substr(0, href.lastIndexOf('/') + 1)}icon-friendship.png`;
                }
            }
        }

        return answerObjects;
    }

    handleAccBetValueChange(accBetValue) {
        this.setState({accBetValue});
    }

    handleSingleBetValueChange(type, value) {
        this.setState((prevState) => {
            let singles = prevState.singles;
            singles[type] = value;
            prevState.singles = singles;
            return prevState;
        });
    }

    onSubmitCreditsBet(outcomes) {
        const {onSubmitCreditsBet, credits} = this.props;
        let {accBetValue: betValue = credits > 0 ? Number(numToFixed(credits, 2)) : 0} = this.state;

        betValue = +betValue;
        const disabledBet = (betValue === 0);

        if (!disabledBet) {
            if (outcomes.length === 1) {
                this.setState({
                    outcomesClicked: outcomes
                });
            } else {
                this.setState({
                    accumClicked: true
                });
            }
            onSubmitCreditsBet(betValue, outcomes);
        }
    }

    onSubmitPointsBet(outcomes) {
        const {onSubmitPointsBet, points} = this.props;
        let {accBetValue: betValue = points > 0 ? points : 0} = this.state;

        betValue = +betValue;
        const disabledBet = (betValue === 0);

        if (!disabledBet) {
            if (outcomes.length === 1) {
                this.setState({
                    outcomesClicked: outcomes
                });
            } else {
                this.setState({
                    accumClicked: true
                });
            }
            onSubmitPointsBet(betValue, outcomes);
        }
    }

    getAccumulatedPanelContent(choices) {
        const {
            isLoggedIn,
            credits,
            points,
            accumulatedOdds,
            fixtureItem: {recentPlayers, totalPlayersCount},
            betSuccess,
            virtualFlowType
        } = this.props;

        if (!accumulatedOdds) return '';

        // FILTER IDS
        const outcomeIds = Object.entries(choices).filter(([k, v]) => k !== 'FirstHalfResult').map(([k, v]) => v.id);

        const isPointsFlow = virtualFlowType === 'points';
        const minCurrency = 0;
        const maxCurrency = isPointsFlow ? points : Number(numToFixed(credits, 2));
        let {accBetValue: betValue = maxCurrency} = this.state;
        betValue = +betValue;

        const betStep = isPointsFlow ? 1 : .01;

        const winValue = numToFixed((accumulatedOdds * betValue), 2);
        const disabledBet = (betValue === 0);
        const disabledBtnClass = disabledBet ? ' disabled' : '';
        const onSubmitBet = isPointsFlow ? this.onSubmitPointsBet : this.onSubmitCreditsBet;
        const onChange = (v) => this.handleAccBetValueChange(Number(v));
        const onBetClick = () => onSubmitBet(outcomeIds);

        const ending = totalPlayersCount === 1 ? '' : 's';
        const participants = totalPlayersCount ? `${totalPlayersCount} ${isLoggedIn ? 'friend' + ending : 'user' + ending} participated` : '';
        const participantsImages = this.getFriendsParticipated(recentPlayers, 'accumulated');

        let btnText = isPointsFlow
            ? `Bet ${ betValue } points and win ${ winValue }`
            : `Bet £${ betValue && numToFixed(betValue, 2) } and win £${ winValue }`;
        let betClass = '';

        const btnClicked = this.state.accumClicked;

        if (betSuccess && btnClicked) {
            btnText = 'Thanks!';
            betClass = ' bet';
        }

        const betTitle = `${!isPointsFlow ? '£' : ''}${ !isPointsFlow ? (betValue && numToFixed(betValue, 2)) : betValue } ${isPointsFlow ? '' : 'points'}`;

        let goalScorerChoice = null;

        if (choices['FirstGoalScorer']) {
            goalScorerChoice = (
                <div className="bet-panel-choice">
                    <div className="bet-panel-choice-img-holder">
                        <img className="bet-panel-choice-img" src={choices['FirstGoalScorer'].icon}/>
                    </div>
                    <div className="bet-panel-choice-text">
                        <h3 className="choice-title">{choices['FirstGoalScorer'].title}</h3>
                        <h4 className="choice-content">{choices['FirstGoalScorer'].scorer}</h4>
                    </div>
                </div>
            );
        }

        return (
            <div className="bet-panel-holder">
                <h2 className="bet-panel-title">Accumulated bet</h2>
                <div className="bet-panel">
                    <div className="bet-panel-header">
                        <div className="bet-panel-choice">
                            <div className="bet-panel-choice-img-holder">
                                <img className="bet-panel-choice-img" src={choices['CorrectScore'].icon}/>
                            </div>
                            <div className="bet-panel-choice-text">
                                <h3 className="choice-title">{choices['CorrectScore'].title}</h3>
                                <h4 className="choice-content">
                                    {choices['CorrectScore'].team + ' ' + choices['CorrectScore'].score}
                                </h4>
                            </div>
                            {goalScorerChoice}
                        </div>
                    </div>
                    <div className="bet-panel-body">
                        <div className="bet-value">
                            <span className="bet-points">{betTitle}</span>
                        </div>

                        <Slider min={minCurrency} max={maxCurrency} value={+betValue} step={betStep}
                                onChange={onChange}/>

                        <Button className={"panel-bet-button" + disabledBtnClass + betClass} onClick={onBetClick}>
                            {btnText}
                        </Button>
                    </div>
                    <div className="bet-panel-footer">
                        <div className="bet-panel-footer-participants">
                            {participantsImages}
                            <p className="participants-text">{participants}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getPanelsContent(choices) {
        const {
            isLoggedIn,
            credits,
            points,
            fixtureItem: {recentPlayers, totalPlayersCount},
            betSuccess,
            virtualFlowType
        } = this.props;

        const isPointsFlow = virtualFlowType === 'points';
        const minCurrency = 0;
        // const maxCurrency = credits > 0 ? Number(numToFixed(credits, 2)) : 0;
        const maxCurrency = isPointsFlow ? points : Number(numToFixed(credits, 2));
        let {accBetValue: betValue = maxCurrency} = this.state;

        const betStep = isPointsFlow ? 1 : .01;

        const ending = totalPlayersCount === 1 ? '' : 's';
        const participants = totalPlayersCount ? `${totalPlayersCount} ${isLoggedIn ? 'friend' + ending : 'user' + ending} participated` : '';
        const participantsImages = this.getFriendsParticipated(recentPlayers, 'accumulated');

        betValue = Number(betValue);

        const disabledBet = (betValue === 0);
        const disabledBtnClass = disabledBet ? ' disabled' : '';
        const onChange = (v) => this.handleAccBetValueChange(v);
        const onSubmitBet = isPointsFlow ? this.onSubmitPointsBet : this.onSubmitCreditsBet;

        let panels = [];
        for (let choice in choices) {
            if (choices.hasOwnProperty(choice)) {
                const c = choices[choice];
                const outcomeId = [c.id];

                const betClick = () => onSubmitBet(outcomeId);

                if (!c.singleOdd) c.singleOdd = 1;
                let winValue = !isPointsFlow
                    ? betValue && numToFixed((betValue * c.singleOdd), 2)
                    : Math.floor(betValue * c.singleOdd);

                let btnText = isPointsFlow
                    ? `Bet ${ betValue } points and win ${ winValue }`
                    : `Bet £${ betValue && numToFixed(betValue, 2) } and win £${ winValue }`;
                let betClass = '';

                const btnClicked = this.state.outcomesClicked.length === 1 && this.state.outcomesClicked[0] === outcomeId[0];

                if (betSuccess && btnClicked) {
                    btnText = 'Thanks!';
                    betClass = ' bet';
                }

                const betTitle = `${!isPointsFlow ? '£' : ''}${ !isPointsFlow ? (betValue && numToFixed(betValue, 2)) : betValue } ${isPointsFlow ? '' : 'points'}`;


                panels.push((
                    <div className="bet-panel">
                        <div className="bet-panel-header">
                            <div className="bet-panel-choice">
                                <div className="bet-panel-choice-img-holder">
                                    <img className="bet-panel-choice-img" src={c.icon}/>
                                </div>
                                <div className="bet-panel-choice-text">
                                    <h3 className="choice-title">{c.title}</h3>
                                    <h4 className="choice-content">
                                        {c.content}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="bet-panel-body">
                            <div className="bet-value">
                                <span className="bet-points">{betTitle}</span>
                            </div>

                            <Slider min={minCurrency} max={maxCurrency} value={Number(betValue)} step={betStep}
                                    onChange={onChange}/>

                            <Button className={"panel-bet-button" + disabledBtnClass + betClass} onClick={betClick}>
                                {btnText}
                            </Button>
                        </div>
                        <div className="bet-panel-footer">
                            <div className="bet-panel-footer-participants">
                                {participantsImages}
                                <p className="participants-text">{participants}</p>
                            </div>
                        </div>
                    </div>
                ));
            }
        }

        return (
            <div className="bet-panel-holder">
                <h2 className="bet-panel-title">Single bets</h2>
                {panels}
            </div>
        );
    }


    render() {
        const {answers} = this.props;

        let panels = [];
        const choices = this.getAnswerObjects();

        if (answers && answers.length) {
            // if (choices['CorrectScore'] && choices['FirstGoalScorer']) {
            // 	panels.push(this.getAccumulatedPanelContent());
            // }
            // ...
            // Use this when score cast is done

            panels.push(this.getAccumulatedPanelContent(choices));
            panels.push(this.getPanelsContent(choices));
        }

        return (
            <div className="quiz-content bet">
                {panels}
            </div>
        );
    }
}

export default QuizBet;
