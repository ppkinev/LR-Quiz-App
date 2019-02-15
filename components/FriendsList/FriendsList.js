import React, {Component, PropTypes} from 'react';
import equal from 'deep-equal';
import Link from '../Link';
import Location from '../../lib/Location';
import FriendsListItem from './FriendsListItem';
import FriendsSearchBar from './FriendsSearchBar';
import FriendsTabs from './FriendsTabs';
import ScreenSwiper from '../ScreenSwiper';
import './FriendsList.scss';

const tabs = ['Friends', 'FriendRequestFrom', 'FriendRequestTo', 'FollowedBy', 'Following'];

class FriendsList extends Component {

    constructor(props) {
        super(props);

        this.selectTab = this.selectTab.bind(this);
    }

    state = {
        currentScreen: []
    };

    static contextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const {tabId} = this.props;
        const currentScreen = this.screenByTabId(tabId);
        this.setState({currentScreen});

        this.context.updateHeader({
            hasBack: true,
            hasLogout: false,
            directBack: './profile',
            hasInviteFriendsIco: true
        });
    }

    screenByTabId(tabId) {
        switch (tabId) {
            case 'friends':
                return ['Friends', 'FriendRequestFrom'];
            case 'followers':
                return ['FollowedBy'];
            case 'following':
                return ['Following'];
            default:
                return ['Friends', 'FriendRequestFrom'];
        }
    }

    tabIdQuery(tabType) {
        if (tabType.indexOf('Friends') !== -1 || tabType.indexOf('Friends') !== -1) {
            return 'friends';
        } else if (tabType.indexOf('FollowedBy') !== -1) {
            return 'followers';
        } else if (tabType.indexOf('Following') !== -1) {
            return 'following';
        } else {
            return 'friends';
        }
    }

    selectTab(tabType) {
        const tabId = this.tabIdQuery(tabType);
        this.setState({currentScreen: tabType});
        this.props.resetSearch();
        Location.push({pathname: './friends', query: {tabId}});
    }

    render() {
        const {
            friends,
            acceptFriendRequest,
            declineFriendRequest,
            findUsers,
            resetSearch,
            sendFriendRequest,
            follow
        } = this.props;
        const {currentScreen} = this.state;

        const friendRequestFrom = friends.list.filter(friend => friend.Rels.indexOf('FriendRequestFrom') !== -1);
        const withoutFriendRequestFrom = friends.list.filter(friend => friend.Rels.indexOf('FriendRequestFrom') === -1);
        const _friends = friendRequestFrom.concat(withoutFriendRequestFrom).map(
            friend => <FriendsListItem key={friend.User.UserId}
                                       friend={friend}
                                       acceptFriendRequest={acceptFriendRequest}
                                       declineFriendRequest={declineFriendRequest}
                                       isSearchResults={friends.searchResults}
                                       sendFriendRequest={sendFriendRequest}
                                       follow={follow}
                                       currentScreen={currentScreen}
            />);

        const friendsList = () => {
            const noFriendsMessage = window.config.skin !== 'mbet'
                ? (<div className='noUserFound'>You have no friends yet, <Link to="./invite-friends" className="inline-link">invite somebody</Link>!</div>)
                : (<div className='noUserFound'>You have no friends yet</div>);
            if (!friends.list.length) {
                if (friends.searchResults) return <div className='noUserFound'>0 users were found</div>;
                else return noFriendsMessage;
            }

            return (
                <ul className="friends-list">
                    { _friends }
                </ul>
            );
        };

        const listHeader = (friends.list.length || (!friends.list.length && friends.isSearching))
            ? <FriendsCount friends={friends.list} activeTab={currentScreen} fromSearch={friends.searchResults}/>
            : null;

        const idx = 0;

        return (
            <div className='screen'>
                <FriendsSearchBar findUsers={findUsers} resetSearch={resetSearch} isSearching={friends.isSearching}/>

                <ScreenSwiper currentScreenIdx={idx} page='friends'>
                    <div className="screen-content">
                        <div className="friends-list-section">
                            { listHeader }
                            { friendsList() }
                        </div>
                    </div>
                </ScreenSwiper>

                <FriendsTabs activeTab={currentScreen} selectTab={this.selectTab} availableTabs={tabs}/>
            </div>
        );
    }
}

class FriendsCount extends Component {

    render() {
        const {friends, activeTab, fromSearch} = this.props;

        const friendsLength = friends.filter(friend => friend.Rels.indexOf('Friends') !== -1);
        const followingLength = friends.filter(friend => friend.Rels.indexOf('Following') !== -1 && friend.Rels.indexOf('Friends') === -1);
        const followersLength = friends.filter(friend => friend.Rels.indexOf('FollowedBy') !== -1 && friend.Rels.indexOf('Friends') === -1);

        let text = '';
        if (activeTab.indexOf('Friends') !== -1) {
            text = `You have ${friendsLength.length} friends`;
        } else if (activeTab.indexOf('Following') !== -1) {
            text = `You follow ${followingLength.length} users`;
        } else {
            text = `You are followed by ${followersLength.length} users`;
        }
        if (fromSearch) text = `${friends.length} users were found`;

        return (
            <div className="friends-list-header">{ text }</div>
        );
    }
}

export default FriendsList;
