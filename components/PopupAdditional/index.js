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
		let { inviteRequest , showInviteRequest, shareShow } = this.props;


		if(showInviteRequest) {



			if(inviteRequest) {
					return (
				<Popup  className="blue inviteBlue">
					<div className="popup-icon"></div>
					<div className="popup-content">
						<div className="popup-title inviteResize">Well done! As soon as your friend join us you will get +50 points</div>
					</div>
				</Popup>
					)
			}
			if(shareShow)  {
				return (
				<Popup ref="sharing-popup" className="blue">
					<div className="popup-icon"></div>
					<div className="popup-content">
						<div className="popup-title">You got +5 points!</div>
						<div className="popup-text">Thank you for sharing</div>
					</div>
				</Popup>
				)
			} else {
				return null
			}
		} else {
			return	null
		}
				
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
