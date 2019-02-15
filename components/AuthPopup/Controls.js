import React, { Component, PropTypes } from 'react';
import './Controls.scss';


const EMAIL_RE = /.*@.*?\..*?/;


export const SeparatorOrError = ({ error }) => {
	if (error) {
		return (
			<div className="input-error">{ error }</div>
		);
	}

	return (
		<div className="auth-separator">
			<img className="strike" src={ require('./images/or-separator.png') } />
			<div className="auth-text-sm">Or</div>
			<img className="strike flip" src={ require('./images/or-separator.png') } />
		</div>
	);
};


class Input extends Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		required: PropTypes.bool,
	};

	_input = null;

	state = {
		value: '',
		error: undefined
	};

	value() {
		return this.state.value;
	}

	setValid() {
		this.setState({ error: undefined });
	}

	isValid() {
		return undefined; //override in children
	}

	isEmpty() {
		const { value } = this.state;
		return value === '';
	}

	validate() {
		const { required } = this.props;

		let error;
		if (required && this.isEmpty()) {
			error = 'required';
		}
		else {
			error = this.isValid();
		}

		this.setState({ error });

		return !error;
	}

	focus() {
		this._input.focus();
	}

	handleChange(value) {
		this.setState({ value }, () => this.setValid());
	}

	render() {
		return (
			<div className="virtual"></div>
		);
	}
}


export class TextInput extends Input {
	static propTypes = {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	};

	render() {
		const { defaultValue = '', name, label } = this.props;
		const { value, error } = this.state;
		const onChange = (e) => this.handleChange(e.target.value);
		const errorClass = error ? `has-error` : '';
		const errorStyle = (type) => {
			return {
				visibility: (type === error) ? 'visible' : 'hidden'
			};
		};

		return (
			<div className={"input-group " + errorClass}>
				<input type="text" name={ name } placeholder={ label }
					ref={(c) => this._input = c}
					defaultValue={ defaultValue }
					value={ value }
					onChange={ onChange } />
				<div className="input-error" style={ errorStyle('required') } >{ label } is required</div>
			</div>
		);
	}
}


export class EmailInput extends Input {

	isValid() {
		const { value } = this.state;
		return (!EMAIL_RE.test(value) ? 'email' : undefined);
	}

	render() {
		const { defaultValue = '' } = this.props;
		const { value, error } = this.state;
		const onChange = (e) => this.handleChange(e.target.value);
		const errorClass = error ? `has-error` : '';
		const errorStyle = (type) => {
			return {
				visibility: (type === error) ? 'visible' : 'hidden'
			};
		};

		return (
			<div className={"input-group " + errorClass}>
				<input type="email" name="email" placeholder="Email"
					ref={(c) => this._input = c}
					defaultValue={ defaultValue }
					value={ value }
					onChange={ onChange } />
				<div className="input-error" style={ errorStyle('required') } >Email is required</div>
				<div className="input-error" style={ errorStyle('email') }>Email should have a format: email@example.com</div>
			</div>
		);
	}
}


export class PasswordInput extends Input {

	isValid() {
		const { value: {length} } = this.state;
		const isValid = (8 <= length && length <= 16);
		return (!isValid ? 'password' : undefined);
	}

	render() {
		const { children } = this.props;
		const { value, error } = this.state;
		const onChange = (e) => this.handleChange(e.target.value);
		const errorClass = error ? `has-error` : '';
		const errorStyle = (type) => {
			return {
				display: (type === error) ? 'block' : 'none'
			};
		};

		return (
			<div className={"input-group " + errorClass}>
				<input type="password" name="password" placeholder="Password"
					ref={(c) => this._input = c}
					value={ value }
					onChange={ onChange } />
				{ !error ? children : undefined }
				<div className="input-error" style={ errorStyle('required') } >Password is required</div>
				<div className="input-error" style={ errorStyle('password') }>Password should have from 8 to 16 characters</div>
			</div>
		);
	}
}
