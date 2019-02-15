import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
	fetchFriends,
	findUsers,
	acceptFriendRequest,
	declineFriendRequest,
	resetSearch,
	sendFriendRequest,
	follow
} from '../flux/actions';
import { Fetching } from '../components/Layout';
import FriendsList from '../components/FriendsList';


class Friends extends Component {

	static title = 'My Friends';



	componentDidMount() {
		this.props.fetchFriends();
	}

	render() {
		const {
			friends,
			acceptFriendRequest,
			declineFriendRequest,
			findUsers,
			fetchFriends,
			resetSearch,
			sendFriendRequest,
			follow
		} = this.props;

		if (friends.isFetching) {
			return <Fetching/>;
		}

		const { tabId } = this.props.params;

		return (
			<FriendsList friends={friends}
									 acceptFriendRequest={acceptFriendRequest}
									 declineFriendRequest={declineFriendRequest}
									 findUsers={findUsers}
									 fetchFriends={fetchFriends}
									 resetSearch={resetSearch}
									 sendFriendRequest={sendFriendRequest}
									 follow={follow}
									 tabId={tabId} />
		);
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		friends: state.friends
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchFriends: () => dispatch(fetchFriends()),
		acceptFriendRequest: (userId) => dispatch(acceptFriendRequest(userId)),
		declineFriendRequest: (userId) => dispatch(declineFriendRequest(userId)),
		findUsers: (query) => dispatch(findUsers(query)),
		searchFriendStart: () => dispatch(searchFriendStart()),
		searchFriendSucces: () => dispatch(searchFriendSucces()),
		resetSearch: () => dispatch(resetSearch()),
		sendFriendRequest: (userId) => dispatch(sendFriendRequest(userId)),
		follow: (userId) => dispatch(follow(userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
