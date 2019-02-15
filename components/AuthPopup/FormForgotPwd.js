import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { postRestore } from '../../flux/actions';
import Button from '../Button';
import { EmailInput } from './Controls.js';
import autofill from 'react-autofill';


@autofill
class FormForgotPwd extends Component {

	static propTypes = {
		onNavigate: PropTypes.func.isRequired,
		// from store
		error: PropTypes.string.isRequired,
		isFetching: PropTypes.bool.isRequired,
		postRestore: PropTypes.func.isRequired,
	};


	async handleSubmit() {
		const emailEl = this.refs['email-input'];
		if (!emailEl.validate()) {
			emailEl.focus();
			return;
		}

		const data = {
			email: emailEl.value()
		};

		try {
			await this.props.postRestore(data);
			this.props.onNavigate('forgot-success');
		} catch (e) {
			//nothing
		}
	}

	render() {
		const { onNavigate, error } = this.props;
		const toLogin = () => onNavigate('login');
		const toSignup = () => onNavigate('signup');
		const onSubmit = () => this.handleSubmit();

		return (
			<div className="auth-popup">
				<div className="auth-icon">
					<img src={ require('../../static/images/icon-ball-lg.png') }/>
				</div>

				<div className="auth-p">
					<div className="auth-text">Don't feel bad</div>
					<div className="auth-text-sm">It happens to the best of us</div>
				</div>

				<div className="input-error">{ error }</div>

				<form className="auth-form">
					<EmailInput ref="email-input" required={true} />

					<Button className="footer-btn big-btn money-btn" onClick={ onSubmit }>Send</Button>
				</form>

				<div className="auth-footer">
					<div className="link-small text-brand" onClick={ toLogin }>LogIn</div>
					<div className="text-brand">|</div>
					<div className="link-small text-brand" onClick={ toSignup }>SignUp</div>
				</div>
			</div>
		);
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	const { isFetching, errors } = state.auth;
	return {
		error: errors.restore || '',
		isFetching: isFetching.restore || false,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		postRestore: (data) => dispatch(postRestore(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormForgotPwd);
