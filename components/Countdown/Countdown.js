import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import './Countdown.scss';

function parseDate(str) {
	const target = moment(str);
	const diff = target.diff(moment());
	const duration = moment.duration(diff);
	const format = (num) => {
		const n = Math.max(0, num);
		return ('0' + n).slice(-2); // 0-padded
	};

	return {
		days: format(duration.days()),
		hours: format(duration.hours()),
		minutes: format(duration.minutes()),
        seconds: format(duration.seconds()),
	};
}

class Countdown extends Component {

	static propTypes = {
		dateStr: PropTypes.string.isRequired,
	};

	_interval = null;

	componentDidMount() {
		this._interval = setInterval(() => this.forceUpdate(), 1000); // every 5s is enough
	}

	componentWillUnmount() {
		clearInterval(this._interval);
	}

	render() {
		const { dateStr } = this.props;
		const { days, hours, minutes, seconds } = parseDate(dateStr);

		return (
			<div className="countdown">
				<div className="countdown-item">
					<div className="cd-panel days">{ days }</div>
					<div className="cd-label">Days</div>
					<div className="cd-separator"></div>
				</div>
				<div className="countdown-item">
					<div className="cd-panel hours">{ hours }</div>
					<div className="cd-label">Hours</div>
					<div className="cd-separator"></div>
				</div>
				<div className="countdown-item">
					<div className="cd-panel minutes">{ minutes }</div>
					<div className="cd-label">Mins</div>
					<div className="cd-separator"></div>
				</div>
                <div className="countdown-item">
                    <div className="cd-panel seconds">{ seconds }</div>
                    <div className="cd-label">Secs</div>
                    <div className="cd-separator"></div>
                </div>
			</div>
		);
	}
}

export default Countdown;
