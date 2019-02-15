import React, { Component, PropTypes } from 'react';
import './FilterTabs.scss';


class FilterTabs extends Component {

	changeTab(filterTabId) {
		this.props.selectTab(filterTabId);
	}


	render() {
		const { tabs, selectedItemId, isLoggedIn } = this.props;

		console.log(tabs)
		if(isLoggedIn) {
			return (


				<div>
					<ul className='filter-tabs'>
						{
							tabs.map((tab, key) => {
								const selectedClass = (tab.filterTabId === selectedItemId) ? 'active' : '';
								const imageName = tab.filterTabId === selectedItemId ? `${tab.filterTabId}-active_filter.png` : `${tab.filterTabId}_filter.png`;
								return (
									<li key={key} onClick={this.changeTab.bind(this, tab.filterTabId)} className={selectedClass}>
										<img src={require(`./images/${imageName}`)} />
										<div className='tabs-title'>{tab.title === 'Followers' ? 'Following' : tab.title}</div>
									</li>
								);
							})
						}
					</ul>
				</div>
			);
		} else {
			return null
		}
	}
}

export default FilterTabs;
