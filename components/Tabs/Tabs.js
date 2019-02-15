import React, { Component, PropTypes } from 'react';
import './Tabs.scss';

class Tabs extends Component {

	static propTypes = {
		items: PropTypes.array.isRequired,
		selectedItemId: PropTypes.string.isRequired,
		onSelect: PropTypes.func.isRequired,
		isLongTabs: PropTypes.bool,
		theme: PropTypes.string
	};

	render() {
		const { items, selectedItemId, onSelect, isLongTabs, theme } = this.props;
		const tabItems = items.map(({ tabId, label }, i) => {
			const selectedClass = (tabId === selectedItemId) ? 'selected' : '';
			const onClick = () => onSelect(tabId);

			return (
				<div key={`tab-${i}`} className={"tab-item " + selectedClass} onClick={ onClick }>
					{ label }
				</div>
			);
		});

		const styles = theme ? `tabs ${theme}` : 'tabs';

		if (isLongTabs) {
			return (
				<div className='tabs-wrapper'>
					<div className='long-tabs'>
						{ tabItems }
					</div>
				</div>
			);
		}

		return (
			<div className={styles}>
				{ tabItems }
			</div>
		);
	}
}

export default Tabs;
