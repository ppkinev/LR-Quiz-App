import React, {Component, PropTypes} from 'react';
import Link from '../Link';
import './UserProfile.scss';
import '../Leagues/Leagues.scss';

class ProfileBoard extends Component {

    state = {
        friendStatusIsOpen: false
    };

    sendFriendRequest() {
        const {userId, sendFriendRequest} = this.props;
        sendFriendRequest(userId);
    }

    follow() {
        const {userId, unfollow} = this.props;
        this.props.follow(userId);
    }

    unfollow() {
        const {userId, unfollow} = this.props;
        this.props.unfollow(userId);
    }

    handlerOnClick() {
        const {friendStatusIsOpen} = this.state;
        this.setState({
            friendStatusIsOpen: !friendStatusIsOpen
        });
    }

    renderOtherUser() {
        const {relationships, sendFriendRequest, follow} = this.props;
        const requestSent = <div className='request-sent'>Request sent</div>;
        const inFollowing = <div className='request-sent'>Following</div>;

        const isFriend = () => relationships.indexOf('FriendRequestTo') !== -1 ? friendRequest : noFriend;
        const isFollow = () => relationships.indexOf('Following') !== -1 ? friendFollow : noFollow;

        const noFollow = (
            <li onClick={this.follow.bind(this)}>
                <div className="profile-b">
                    <div className="profile-icon-bl">
                        <img className="profile-icon" src={require('./images/add-friends_profile.png')} alt=""/>
                    </div>
                    <div className="profile-meta-bl">
                        <div className="profile-board-title add-friends">Follow</div>
                    </div>
                </div>
            </li>
        );
        const noFriend = (
            <li onClick={this.sendFriendRequest.bind(this)}>
                <div className="profile-b">
                    <div className="profile-icon-bl">
                        <img className="profile-icon" src={require('./images/add-friends_profile.png')} alt=""/>
                    </div>
                    <div className="profile-meta-bl">
                        <div className="profile-board-title add-friends">Add Friend</div>
                    </div>
                </div>
            </li>
        );
        const friendFollow = (
            <li>
                { inFollowing }
            </li>
        );
        const friendRequest = (
            <li>
                { requestSent }
            </li>
        );

        return (
            <div className="profile-section">
                <div className="profile-section-header">
                    <h5>Social activity</h5>
                </div>
                <ul className="profile-board-nav">
                    { isFriend() }
                    { isFollow() }
                </ul>
            </div>
        );
    }

    renderFriend(relationships) {
        const {friendStatusIsOpen} = this.state;
        const unFriend = relationships.length === 1 && relationships.indexOf('Following') !== -1 ? 'Unfollow' : 'Unfriend';
        const title = relationships.length === 1 && relationships.indexOf('Following') !== -1 ? 'Following' : 'Friends';

        return (
            <div className="profile-section">
                <div className="profile-section-header">
                    <h5>Social activity</h5>
                </div>
                <div className="friend-board-section" onClick={this.handlerOnClick.bind(this)}>
                    <div className="friend-board">
                        <div className="profile-b">
                            <img className="friend-board-check" src={require('./images/check.svg')}/>
                            <span className="friend-board-title">{title}</span>
                            <span className={ friendStatusIsOpen ? "arrow down" : "arrow up" }></span>
                        </div>
                    </div>
                    <ul className={ friendStatusIsOpen ? "friend-status is-open" : "friend-status" }>
                        <li onClick={this.unfollow.bind(this)}>{unFriend}</li>
                    </ul>
                </div>
            </div>
        );
    }

    renderMyProfileBoard(friendsCount, friendRequestsCount) {
        const {friends} = this.props;
        let followersCount;
        let followingCount;

        if (friends) {
            followersCount = friends.filter(friend => friend.Rels.indexOf('FollowedBy') !== -1).length;
            followingCount = friends.filter(friend => friend.Rels.indexOf('Following') !== -1).length;
        }

        const noFriends = (
            <li>
                <Link className="profile-item" to='./friends'>
                    <div className="profile-b">
                        <div className="profile-icon-bl">
                            <img className="profile-icon" src={require('./images/add-friends_profile.png')} alt=""/>
                        </div>
                        <div className="profile-meta-bl">
                            <div className="profile-board-title add-friends">Find Friends</div>
                        </div>
                    </div>
                </Link>
            </li>
        );
        const withFriends = (
            <li>
                <Link className="profile-item" to='./friends' query={{tabId: 'friends'}}>
                    <div className="profile-b">
                        <div className="profile-icon-bl">
                            <img className="profile-icon" src={require('./images/other/friends.svg')} alt=""/>
                        </div>
                        <div className="profile-meta-bl">
                            <div className="profile-board-title">{friendsCount} Friends</div>
                            <div className="profile-board-meta">+{friendRequestsCount} pending</div>
                        </div>
                    </div>
                </Link>
            </li>
        );
        const followers = (
            <li>
                <Link className="profile-item" to='./friends' query={{tabId: 'followers'}}>
                    <div className="profile-b">
                        <div className="profile-icon-bl">
                            <img className="profile-icon" src={require('./images/other/not-connected.svg')} alt=""/>
                        </div>
                        <div className="profile-meta-bl">
                            <div className="profile-board-title withoutPending">{followersCount} Followers</div>
                        </div>
                    </div>
                </Link>
            </li>
        );
        const following = (
            <li>
                <Link className="profile-item" to='./friends' query={{tabId: 'following'}}>
                    <div className="profile-b">
                        <div className="profile-icon-bl">
                            <img className="profile-icon" src={require('./images/other/followers.svg')} alt=""/>
                        </div>
                        <div className="profile-meta-bl">
                            <div className="profile-board-title withoutPending">{followingCount} Following</div>
                        </div>
                    </div>
                </Link>
            </li>
        );

        return (
            <div className="profile-section">
                <div className="profile-section-header">
                    <h5>Social activity</h5>
                </div>
                <ul className="profile-board-nav">
                    { friendsCount || friendRequestsCount ? withFriends : noFriends }
                    { following }
                    { followers }
                </ul>
            </div>
        );
    }

    render() {
        const {relationships, friendsCount, friendRequestsCount} = this.props;

        if (!relationships) return this.renderMyProfileBoard(friendsCount, friendRequestsCount);
        return relationships.indexOf('Friends') !== -1 ? this.renderFriend(relationships) : this.renderOtherUser();
    }
}

export default ProfileBoard;
