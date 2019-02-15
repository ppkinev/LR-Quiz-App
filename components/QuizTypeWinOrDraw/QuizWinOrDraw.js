import React, { Component, PropTypes } from 'react';
import { parseWinOrDrawData } from '../../lib/parseData.js';
import QuizControls from './QuizWinOrDrawControls';
import QuizStats from './QuizWinOrDrawStats';
import './draw.scss';


class QuizWinOrDraw extends Component {

	static propTypes = {
		info: PropTypes.string.isRequired,
		data: PropTypes.object.isRequired,
		teamNames: PropTypes.array.isRequired,
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
		const { questionId, summary } = parseWinOrDrawData(data, teamNames, outcomeId);

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
		const { info, data, teamNames } = this.props;
		const { outcomeId, showStats } = this.state;
		const { outcomes } = parseWinOrDrawData(data, teamNames, outcomeId);
		const onSubmit = (outcomeId) => this.handleSubmit(outcomeId);
		const onDismiss = () => this.hideStats();

		return (
			<div className="quiz-content">
				<QuizControls
					teamNames={teamNames}
					info={info}
					outcomes={outcomes}
					outcomeId={outcomeId}
					onSubmit={ onSubmit }/>
				<QuizStats
					hidden={ !showStats }
					order={ [ 'home', 'draw', 'away' ] }
					outcomeId={ outcomeId }
					outcomes={ outcomes }
					onDismiss={ onDismiss }/>
			</div>
		);
	}
}

export default QuizWinOrDraw;
