import React, { Component, PropTypes } from 'react';

const SUCCESS_SHOW_TIME = 5000;


class ForgotPwdSuccess extends Component {

	static propTypes = {
		onNavigate: PropTypes.func.isRequired,
	};

	componentDidMount() {
		setTimeout(() => this.goNext(), SUCCESS_SHOW_TIME);
	}

	goNext() {
		this.props.onNavigate('login');
	}

	render() {
		const onClick = () => this.goNext();

		return (
			<div className="auth-popup" onClick={ onClick }>
				<div className="auth-icon">
					<img src={ require('../../static/images/icon-ball-lg.png') }/>
				</div>

				<div className="icon-success">
					<img src={ require('../../static/images/icon-success.png') }/>
				</div>

				<div className="success-subtitle">Instructions were sent</div>
				<div className="success-text">Check your email</div>
			</div>
		);
	}
}

export default ForgotPwdSuccess;
