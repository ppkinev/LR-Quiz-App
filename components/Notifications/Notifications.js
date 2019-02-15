import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './Notifications.scss';

const DELAY = 3000;

class Notifications extends Component {

	componentWillReceiveProps(nextProps) {
		const { list, toggle, active } = nextProps;
		const activeNotification = list.filter(item => item.type === active);
		if (active && activeNotification.length) {
			setTimeout(() => toggle(active), DELAY);
		}
	}

	close() {
		const { toggle, active } = this.props;
		toggle(active);
	}

	render() {
		const { list, active, toggle } = this.props;
		const activeNotification = list.filter(item => item.type === active);

		if (!active) return null;

		return (
			<div className='notification'>
				<div className='content'>
					<div className='title'>Thanks for registaration!</div>
					<div className='msg'>You've got extra +5 points</div>
				</div>
				<div className='close' onClick={this.close.bind(this)}>X</div>
			</div>
		);
	}
}

export default Notifications;
