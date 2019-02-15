import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { toggleWelcome } from '../../flux/actions';
import { AppConfig } from '../../lib/fetch';

const WELCOME_COOKIE_KEY = 'quiz-everton-onboarded';
const WELCOME_COOKIE_EXPIRES = 365; //days


function withWelcome(ComposedComponent) {
	class WithWelcome extends Component {

		static title = ComposedComponent.title;

		static propTypes = {
			// from store
			showWelcomePopup: PropTypes.bool.isRequired,
			openWelcomePopup: PropTypes.func.isRequired,
		};

		componentDidMount() {
			this.showWelcomeIfNeeded();
		}

		componentWillReceiveProps({ showWelcomePopup }) {
			if (showWelcomePopup) {
				Cookies.set(WELCOME_COOKIE_KEY, 'true', {expires: WELCOME_COOKIE_EXPIRES});
			}
		}

		showWelcomeIfNeeded() {
			if (!Cookies.get(WELCOME_COOKIE_KEY)) {
				this.props.openWelcomePopup();
			}
		}

		render() {
			return <ComposedComponent {...this.props}/>;
		}
	}

	// Connect to store
	//
	const mapStateToProps = (state) => {
		return {
			showWelcomePopup: state.showWelcomePopup,
		};
	};
	const mapDispatchToProps = (dispatch) => {
		return {
			openWelcomePopup: () => dispatch(toggleWelcome(true)),
		};
	};

	return connect(mapStateToProps, mapDispatchToProps)(WithWelcome);
}


export default withWelcome;
