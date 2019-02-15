import React, { Component, PropTypes } from 'react';
import './popup.scss';


export class SharingPopup extends Component {

	state = {
		points: 0
	};

	show(points, autoHide) {
		this.setState({ points }, () => {
			this.refs['sharing-popup'].show(autoHide);
		})
	}

	render() {
		const { points } = this.state;

		return (
			<Popup ref="sharing-popup" className="blue">
				<div className="popup-icon"></div>
				<div className="popup-content">
					<div className="popup-title">You got +{ points } points!</div>
					<div className="popup-text">Thank you for sharing</div>
				</div>
			</Popup>
		);
	}
}

class Popup extends Component {

	static propTypes = {
		autoHide: PropTypes.number
	};

	timeout = null;

	state = {
		show: false
	};

	show(autoHide) {
		this.setState({ show: true}, () => {
			if (autoHide) {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => this.hide(), autoHide);
			}
		})
	}

	hide() {
		this.setState({ show: false });
	}

	render() {
		const { children, className, ...rest } = this.props;
		const { show } = this.state;
		const classes = ['popup', className, ...(show ? ['visible'] : [])].join(' ');
		return (
			<div className={ classes } {...rest}>{ children }</div>
		);
	}
}

export default Popup;
