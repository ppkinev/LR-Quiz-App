import React, { Component, PropTypes } from 'react';
import './ProgressBar.scss';

class ProgressBar extends Component {

	static propTypes = {
		current: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired
	};

	getProgressBarInfo() {
		let percentage = (this.props.current + 1) / this.props.total;
		let style = {
			transform: `scaleX(${percentage})`
		};

		return { style };
	}


	render() {
		let { style } = this.getProgressBarInfo();

		return (
			<div className="progress-bar">
				<div className="progress-bar-completed" style={style} />
			</div>
		);
	}
}

export default ProgressBar;
