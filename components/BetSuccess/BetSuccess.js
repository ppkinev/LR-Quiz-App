import React, { Component, PropTypes } from 'react';
import './BetSuccess.scss';

const SHOW_TIME = 3000;


class BetSuccess extends Component {

	static propTypes = {
		onDismiss: PropTypes.func.isRequired
	};

	componentDidMount() {
		setTimeout(() => this.props.onDismiss(), SHOW_TIME);
	}

	render() {
		const { isDraw, badges, isLoggedIn } = this.props;
		const onClick = () => this.props.onDismiss();
		let isPredictorBadge;
		if (badges) {
			isPredictorBadge = badges.earned.some(badge => badge.Title === 'Predictor');
			console.warn(badges)
		}

		const successMessage = (isDraw || isPredictorBadge) ? (
			<div>
				<div className="success-subtitle">Accepted</div>
				<div className="success-text">Thank you</div>
			</div>
		) : (
			<div>
				<div className="success-subtitle">Submitting accepted</div>
				<div style={isPredictorBadge ? { fontSize : 0} : {}} className="success-text">You've got a Predictor badge</div>
			</div>
		);

		return (
			<div className="quiz-success" onClick={onClick}>
				<div className="icon-success">
					<img src={ require('../../static/images/icon-success.png') }/>
				</div>

				{ successMessage }
			</div>
		);
	}
}

export default BetSuccess;
