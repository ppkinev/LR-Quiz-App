import React, { Component, PropTypes } from 'react';
import './button.scss';

class Button extends Component {

	static propTypes = {
		onClick: PropTypes.func
	};

	render() {
		const { children, ...rest } = this.props;
		return (
			<div {...rest}>{ children }</div>
		);
	}
}

export default Button;
