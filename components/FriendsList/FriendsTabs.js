import React, { Component, PropTypes } from 'react';
import './FriendsList.scss';

const tabs = [
	{
		type: ['Friends', 'FriendRequestFrom'],
		title: 'Friends',
		ico: require('./images/friends_w.svg'),
		activeIco: require('./images/friends.svg')
	},
	{
		type: ['FollowedBy'],
		title: 'Followers',
		ico: require('./images/followers_w.svg'),
		activeIco: require('./images/followers.svg')
	},
	{
		type: ['Following'],
		title: 'Following',
		ico: require('./images/followers_w.svg'),
		activeIco: require('./images/followers.svg')
	}
];

class FriendsTabs extends Component {

	changeTab(tabType) {
		this.props.selectTab(tabType);
	}

	render() {
		const { activeTab, availableTabs } = this.props;
		const isTabActiveClass = (tab) => (activeTab.indexOf(tab.type[0]) !== -1 && activeTab.length !== availableTabs.length) ? 'active' : '';
		const isTabActiveIco = (tab) => (activeTab.indexOf(tab.type[0]) !== -1 && activeTab.length !== availableTabs.length) ? tab.activeIco : tab.ico;

		return (
			<ul className="friends-tabs">
				{
					tabs.map((tab, key) => {
						return (
							<li key={key} className={ isTabActiveClass(tab) } onClick={this.changeTab.bind(this, tab.type)}>
								<img className="tabs-ico" src={ isTabActiveIco(tab) } />
								<div className="tabs-title">{tab.title}</div>
							</li>
						);
					})
				}
			</ul>
		);
	}
}

export default FriendsTabs;
