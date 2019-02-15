import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { cancelAuth, checkSafariCookieHack } from '../../flux/actions';
import FormSignUp from './FormSignUp.js';
import FormLogIn from './FormLogIn.js';
import FormForgotPwd from './FormForgotPwd.js';
import ForgotPwdSuccess from './ForgotPwdSuccess.js';
import './AuthPopup.scss';


const view2comp = {
	'signup': FormSignUp,
	'login': FormLogIn,
	'forgot': FormForgotPwd,
	'forgot-success': ForgotPwdSuccess,
};


class AuthPopup extends Component {

	static propTypes = {
		show: PropTypes.bool.isRequired,
		view: PropTypes.string,
		//from store
		onCancel: PropTypes.func.isRequired,
		checkSafariCookieHack: PropTypes.func.isRequired,
	};

	state = {
		view: 'signup',
	};

	componentDidMount() {
		this.props.checkSafariCookieHack();
	}

	componentWillReceiveProps({view}) {
		if (!view) { return; }
		this.setState({view});
	}

	navigateTo(view) {
		this.setState({
			view
		});
	}

	render() {
		const { show, onCancel } = this.props;
		const { view, ...rest } = this.state;
		const hiddenClass = !show ? 'is-hidden' : '';
		const Component = view2comp[view];
		const onClick = (e) => {
			if (e.target === this.refs['auth-shadow']) {
				onCancel();
			}
		};

		return (
			<div ref="auth-shadow" className={"auth-screen " + hiddenClass } onClick={ onClick }>
				<Component
					onNavigate={ (view) => this.navigateTo(view) }
					{ ...rest }
				/>
			</div>
		);
	}
}


// Connect to store
//
const mapDispatchToProps = (dispatch) => {
	return {
		onCancel: () => dispatch(cancelAuth()),
		checkSafariCookieHack: () => dispatch(checkSafariCookieHack()),
	};
};

export default connect(null, mapDispatchToProps)(AuthPopup);
