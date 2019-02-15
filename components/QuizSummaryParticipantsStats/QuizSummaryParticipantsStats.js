import React, {Component} from 'react';

export default class QuizSummaryParticipantsStats extends Component {
	render() {
		const {all, winners, scores} = this.props.participants;
		const PARTICIPANT = all.length === 1 ? 'participant' : 'participants';

		return (
			<div className="summary-participants-holder">
				<div className="participants-section-1">
					<h3 className="participants-value">{ all.length }</h3>
					<p className="participants-title">{ PARTICIPANT }</p>
				</div>
				<div className="participants-section-2 participants-borders">
					<h3 className="participants-value">{ winners.length }</h3>
					<p className="participants-title">won</p>
				</div>
				<div className="participants-section-3">
					<h3 className="participants-value">{ scores.length }</h3>
					<p className="participants-title">score!</p>
				</div>
			</div>
		);
	}
}
