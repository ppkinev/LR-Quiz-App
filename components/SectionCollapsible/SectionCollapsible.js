import React, { Component, PropTypes } from 'react';
import './SectionCollapsible.scss';

class SectionCollapsible extends Component {

	static propTypes = {
		renderToggle: PropTypes.func
	};

	state = {
		collapsed: true,
	};

	toggleCollapsed() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}

	render() {
		const { children, renderToggle = () => '' } = this.props;
		const { collapsed } = this.state;
		const expandedClass = !collapsed ? 'expanded' : '';
		const iconSrc = require('./images/icon-gripper.png');
		const onClick = () => this.toggleCollapsed();

		return (
			<div className={"section-collapsible " + expandedClass} >
				<div className="collapsible-content">{ children }</div>
				<div className="collapsible-toggler" onClick={ onClick }>{ renderToggle(collapsed) }</div>
				<div className="collapsible-gripper" onClick={ onClick }>
					<div className="icon-gripper">
						<img src={iconSrc} alt="gripper"/>
					</div>
				</div>
			</div>
		);
	}
}

export default SectionCollapsible;
