import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import './players.scss';

const DIRECTION_UP = 8; // from Hammer

class QuizFirstGoalStats extends Component {

	static propTypes = {
		hidden: PropTypes.bool.isRequired,
		outcomeId: PropTypes.string,
		stats: PropTypes.array.isRequired,
		onDismiss: PropTypes.func.isRequired,
		offsetHeight: PropTypes.number,
	};


	render() {
		const { hidden, outcomeId: selectedOutcomeId, stats, onDismiss, offsetHeight } = this.props;
		const classes = !hidden ? 'reveal' : '';
		const bottom = 139 + stats.length * 81 - offsetHeight; // TODO - hack
		const [fromX, toX] = [25, 90];

		const listItems = stats
			.map(({ outcomeId, percent }, i) => {
				const isSelected = (outcomeId === selectedOutcomeId);
				const statPos = hidden ? 100 : 0;
				const rowPos = fromX + (toX - fromX) * (100 - percent) / 100;
				const selectedClass = (isSelected ? 'selected' : '');
				const statStyle = {
					transform: `translateX(${statPos}%)`,
					WebkitTransform: `translateX(${statPos}%)`,
				};
				const rowStyle = {
					transform: `translateX(${rowPos}%)`,
					WebkitTransform: `translateX(${rowPos}%)`,
				};

				return (
					<li key={`stats-${i}`} className={"stats-item " + selectedClass}
						style={statStyle}>
						<div className="stats-row" style={rowStyle}>{ percent }%</div>
					</li>
				);
			});

		const hammerOptions = {
			recognizers: {
				swipe: {
					direction: DIRECTION_UP
				}
			}
		};
		const onSwipe = () => onDismiss();

		return (
			<Hammer onSwipe={onSwipe} options={ hammerOptions }>
				<div className={"quiz-stats " + classes } style={{ bottom: `-${bottom}px` }}
					onClick={ onDismiss }>
					<div className="stats-spacer"></div>

					<ul className="stats-list">
						{ listItems }
					</ul>
				</div>
			</Hammer>
		);
	}
}

export default QuizFirstGoalStats;
