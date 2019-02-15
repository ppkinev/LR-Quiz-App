import React, { Component, PropTypes } from 'react';
import equal from 'deep-equal';
import Link from '../Link';
import RecentPlayers from '../RecentPlayers/RecentPlayers';
import './FriendsList.scss';

class FriendsListItem extends Component {

	shouldComponentUpdate(nextProps) {
		// return equal(nextProps.friend, this.props.friend) ? false : true;
		return true; // TODO
	}

	acceptFriendRequest(userId, e) {
		e.preventDefault();
		this.props.acceptFriendRequest(userId);
	}

	declineFriendRequest(userId, e) {
		e.preventDefault();
		this.props.declineFriendRequest(userId);
	}

	follow(userId, e) {
		e.preventDefault();
		this.props.follow(userId);
	}

	sendFriendRequest(userId, e) {
		e.preventDefault();
		this.props.sendFriendRequest(userId);
	}

	friendInPending(userId, ImageUrl, UserName, commonFriends) {
		return (
			<li className="frineds-item pending">
				<Link className="frineds-item-body" to="./user" query={ {userId} }>
					<div className="frineds-item-ico">
						<img src={ ImageUrl }/>
					</div>
					<div className="friends-item-content">
						<h3 className="friends-name">{ UserName }</h3>
						<h5 className="friends-meta">{ commonFriends }</h5>
					</div>
					<div className="friends-request">
						<img src={require('./images/decline.png')} onClick={this.declineFriendRequest.bind(this, userId)} />
						<img src={require('./images/not-connected-c.svg')} onClick={this.acceptFriendRequest.bind(this, userId)} />
					</div>
				</Link>
			</li>
		);
	}

	notFriends(userId, ImageUrl, UserName, commonFriends) {
		const {
			friend: {
				Rels: rels
			}
		} = this.props;

		const addToFriend = <img src={require('./images/accept.svg')} onClick={this.sendFriendRequest.bind(this, userId)} />;
		const requestSent = <span className='request-sent'>Request sent</span>;
		const isFriendRequestSent = () => rels.indexOf('FriendRequestTo') !== -1 ? requestSent : addToFriend;
		const isFollow = () => rels.indexOf('Following') === -1 ? <img src={require('./images/add-follow.png')} onClick={this.follow.bind(this, userId)} /> : null;

		return (
			<li className="frineds-item pending">
				<Link className="frineds-item-body" to="./user" query={ {userId} }>
					<div className="frineds-item-ico">
						<img src={ ImageUrl }/>
					</div>
					<div className="friends-item-content">
						<h3 className="friends-name">{ UserName }</h3>
						<h5 className="friends-meta">{ commonFriends }</h5>
					</div>
					<div className="friends-request">
						{isFriendRequestSent()}
						{isFollow()}
					</div>
				</Link>
			</li>
		);
	}

	renderFriend(userId, ImageUrl, UserName, commonFriends) {
		return (
			<li className="frineds-item">
				<Link className="frineds-item-body" to="./user" query={ {userId} }>
					<div className="frineds-item-ico">
						<img src={ ImageUrl }/>
					</div>
					<div className="friends-item-content">
						<h3 className="friends-name">{ UserName }</h3>
						<h5 className="friends-meta">{ commonFriends }</h5>
					</div>
					<div className="list-item-arrow">
						<img src={require('../../static/images/arrow-right-grey.png')}/>
					</div>
				</Link>
			</li>
		);
	}

	renderCommonFriends() {
        const {
            friend: {
                MutualFriendsTotalCount: total,
                MutualFriends: common
            }
        } = this.props;
	    return (
	        <RecentPlayers total={total} recent={common} type={'common friend'}/>
        );
    }

    getUserRelationObjects() {
        const {
            friend: {
                User: {
                    UserId: userId,
                    UserName,
                    ImageUrl
                },
                Rels
            },
        } = this.props;
        const commonFriends = this.renderCommonFriends();
        if (Rels.indexOf('FriendRequestFrom') !== -1) {
            return this.friendInPending(userId, ImageUrl, UserName, commonFriends);
        }
        if (Rels.indexOf('Friends') !== -1) {
            return this.renderFriend(userId, ImageUrl, UserName, commonFriends);
        }
        return this.notFriends(userId, ImageUrl, UserName, commonFriends);
    }

	render() {
		const {
			friend: {Rels},
			isSearchResults,
			currentScreen
		} = this.props;

        if (isSearchResults) {
            return this.getUserRelationObjects();
        } else {
            if (Rels.some(rels => currentScreen.indexOf(rels) !== -1)) {
                return this.getUserRelationObjects();
            } else {
                return null;
            }
        }
	}
}

export default FriendsListItem;
