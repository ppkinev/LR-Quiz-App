import React, { Component, PropTypes } from 'react';
import './leader-board.scss'


class Section extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
	};

	render() {
		const { title, children } = this.props;

		return (
			<div className="content-section">
				<div className="section-header">
					<h5>{ title }</h5>
				</div>
				{ children }
			</div>
		);
	}
}

export default Section;
