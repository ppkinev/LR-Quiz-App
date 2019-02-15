import React, { Component, PropTypes } from 'react';
import { parseFirstGoalData } from '../../lib/parseData.js';
import QuizControls from './QuizFirstGoalControls';
import QuizStats from './QuizFirstGoalStats';
import './players.scss';


class QuizFirstGoal extends Component {

	static propTypes = {
		info: PropTypes.string.isRequired,
		teamNames: PropTypes.array.isRequired,
		data: PropTypes.object.isRequired,
		onAnswerSubmit: PropTypes.func.isRequired,
	};

	state = {
		outcomeId: null,
		showStats: false,
	};

	isAnswered() {
		return (this.state.outcomeId !== null);
	}

	handleSubmit(outcomeId) {
		const { data, teamNames, onAnswerSubmit } = this.props;
		const { questionId, summary } = parseFirstGoalData(data, teamNames, outcomeId);

		this.setState({
			outcomeId,
			showStats: true,
		}, () => {
			onAnswerSubmit(questionId, outcomeId, summary);
		});
	}

	hideStats() {
		this.setState({
			showStats: false
		});
	}

	render() {
		const { info, data, teamNames, summary } = this.props;
		const { showStats, outcomeId } = this.state;
		const { players } = parseFirstGoalData(data, teamNames, outcomeId);
		const stats = players.map(({ outcomeId, percent }) => {
			return {
				outcomeId,
				percent
			};
		});

		const halfTimeWinner = summary.halfTimeWinner || {};

		const container = this.refs['container'];
		const offsetHeight = container ? container.offsetHeight : 0;
		const onSubmit = (outcomeId) => this.handleSubmit(outcomeId);
		const onDismiss = () => this.hideStats();

		return (
			<div ref="container" className="quiz-content">
				<QuizControls halfTimeWinner={halfTimeWinner} teamNames={teamNames} info={info} players={players} outcomeId={outcomeId} onSubmit={ onSubmit }>
					<QuizStats
						hidden={ !showStats }
						stats={ stats }
						outcomeId={ outcomeId }
						offsetHeight={ offsetHeight }
						onDismiss={ onDismiss }/>
				</QuizControls>
			</div>
		);
	}
}

export default QuizFirstGoal;
