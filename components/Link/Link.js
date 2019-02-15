import React, { Component, PropTypes } from 'react';
import './Link.scss';
import Location from '../../lib/Location';


function isLeftClickEvent(event) {
	return event.button === 0;
}

function isModifiedEvent(event) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}


class Link extends Component {

	static defaultProps = {
		goBack: false,
	};

	static propTypes = {
		goBack: PropTypes.bool,
		to: PropTypes.string,
		state: PropTypes.object,
		// query: PropTypes.object,
		children: PropTypes.any.isRequired,
		onClick: PropTypes.func,
	};

	handleClick(event) {
		let allowTransition = true;
		let clickResult;

		if (this.props && this.props.onClick) {
			clickResult = this.props.onClick(event);
		}

		if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
			return;
		}

		if (clickResult === false || event.defaultPrevented === true) {
			allowTransition = false;
		}

		event.preventDefault();

		if (!allowTransition) { return; }

		if (this.props.goBack) {
			Location.goBack();
		}
		else {
			const link = event.currentTarget;
			const {
				to: pathname = (link.pathname + link.search),
				query = null,
				state = null,
				hash = null
				} = this.props || {};

			Location.push({pathname, query, hash, state});
		}
	}

	render() {
		const { to, children, ...props } = this.props;
		const onClick = (e) => this.handleClick(e);

		return <a href={to} onClick={onClick} {...props}>{ children }</a>;
	}

}

export default Link;
