import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import './score.scss';

const DIRECTION_UP = 8; // from Hammer


class QuizScoreStats extends Component {

	static propTypes = {
		hidden: PropTypes.bool.isRequired,
		percent: PropTypes.number,
		onDismiss: PropTypes.func.isRequired,
	};

	render() {
		const { hidden, onDismiss, percent } = this.props;
		const classes = !hidden ? 'reveal' : '';
		const [fromY, toY] = [80, 10]; // by trial
		const sz = !percent ? 100 : fromY - (fromY - toY) * percent / 100;
		const style = {
			transform: `translateY(${sz}%)`,
			WebkitTransform: `translateY(${sz}%)`,
		};

		const hammerOptions = {
			recognizers: {
				swipe: {
					direction: DIRECTION_UP
				}
			}
		};
		const onSwipeUp = () => onDismiss();

		return (
			<Hammer onSwipe={onSwipeUp} options={ hammerOptions }>
				<div className={"quiz-stats cols-2 " + classes } onClick={ onDismiss }>
					<div className="col" style={ style }>
						<div className="stats-bar winner">{ percent }%</div>
					</div>
				</div>
			</Hammer>
		);
	}
}

export default QuizScoreStats;
