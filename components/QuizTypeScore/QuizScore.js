import React, {Component, PropTypes} from 'react';
import {parseScoreData} from '../../lib/parseData.js';
import QuizControls from './QuizScoreControls';
import QuizStats from './QuizScoreStats';
import './score.scss';


class QuizScore extends Component {

    static propTypes = {
        info: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        teamNames: PropTypes.array.isRequired,
        onAnswerSubmit: PropTypes.func.isRequired,
    };

    state = {
        scores: undefined,
        showStats: false,
    };

    isAnswered() {
        return (typeof this.state.scores !== 'undefined');
    }

    handleSubmit(scores) {
        const {data, teamNames, onAnswerSubmit} = this.props;
        const {questionId, outcomeId, summary} = parseScoreData(data, teamNames, scores);

        this.setState({
            showStats: true,
            scores: scores
        }, () => {
            onAnswerSubmit(questionId, outcomeId, summary);
        });
    }

    hideStats() {
        this.setState({
            showStats: false,
        });
    }

    render() {
        const {info, data, teamNames} = this.props;
        const {showStats, scores} = this.state;
        const {stats} = parseScoreData(data, teamNames, scores);
        const onSubmit = (scores) => this.handleSubmit(scores);
        const onDismiss = () => this.hideStats();

        return (
            <div className="quiz-content">
                <QuizControls ref="controlScore" info={info} teamNames={teamNames} onSubmit={ onSubmit }/>
                <QuizStats
                    hidden={ !showStats }
                    percent={ showStats ? stats : null }
                    onDismiss={ onDismiss }/>
            </div>
        );
    }
}

export default QuizScore;
