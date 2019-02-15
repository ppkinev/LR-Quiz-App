import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Location from '../lib/Location.js';
import { fetchProfileIfNeeded, fetchBadges, fetchFriends, fetchActivity, verifyEmail } from '../flux/actions';
import { Fetching } from '../components/Layout';
import UserProfile from '../components/UserProfile';

function goToFixturesPage() {
	Location.push({pathname: './fixtures'});
}

class Profile extends Component {

	constructor() {
		super()
		this.state = {
			fullyUploaded : false
		}
	}

	static title = 'Profile';

	static propTypes = {
		// from store
		profile: PropTypes.object.isRequired,
		fetchProfile: PropTypes.func.isRequired,
	};

	static contextTypes = {
		updateHeader: PropTypes.func.isRequired,
	};

	async componentWillMount() {
		const { fetchProfile, fetchBadges, fetchFriends, fetchActivity, isLoggedIn } = this.props;

		if (location.pathname === '/profile') {
			this.context.updateHeader({
				hasBack: false,
				hasLogout: true
			});
		}

		await fetchProfile();
		await fetchActivity();
		await fetchBadges();
		await fetchFriends();
		this.setState({fullyUploaded : true});



		if (!isLoggedIn) {
			goToFixturesPage();
		}
	}

	render() {
		const { profile: { isFetching, ...rest }, friends, badges, activity, sendFriendRequest, isEmailVerificationSent, verifyEmail } = this.props;
		const { fullyUploaded } = this.state;

		if (!fullyUploaded) {
			return <Fetching/>;
		} else {
			return <UserProfile user={rest} badges={badges} activity={activity} friends={friends.list} isEmailVerificationSent={isEmailVerificationSent} verifyEmail={verifyEmail} />;
		}


	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		friends: state.friends,
		profile: state.profile,
		badges: state.badges,
		activity: state.activity,
        isEmailVerificationSent: state.profile.isEmailVerificationSent,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchProfile: () => dispatch(fetchProfileIfNeeded()),
		fetchBadges: () => dispatch(fetchBadges()),
		fetchFriends: () => dispatch(fetchFriends()),
		fetchActivity: () => dispatch(fetchActivity()),
        verifyEmail: () => dispatch(verifyEmail())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
