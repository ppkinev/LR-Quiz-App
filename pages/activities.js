import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Location from '../lib/Location.js';
import { fetchActivity, fetchUserActivity } from '../flux/actions';
import { Fetching } from '../components/Layout';
import ActivitiesList from '../components/Activities';

function goToFixturesPage() {
	Location.push({pathname: './fixtures'});
}

class Activities extends Component {

	constructor(props) {
		super();
		if (!props.isLoggedIn) {
			goToFixturesPage();
		}
	}

	static title = 'Activity';

	static propTypes = {
		// from store
		profile: PropTypes.object.isRequired
	};

	async componentDidMount() {
		const { params: { userId }, fetchActivity, fetchUserActivity, isLoggedIn } = this.props;

		if (userId) {
			fetchUserActivity(userId);
		} else {
			fetchActivity();
		}
	}

	render() {
		const { profile, activity } = this.props;
		const userProfileImage = profile.imageUrl ? profile.imageUrl : 'http://spr-static-test.cloudapp.net/content/main/assets/images/default-profile.png';

		if (activity.isFetching) {
			return <Fetching/>;
		}

		return <ActivitiesList activities={activity} userProfileImage={profile.imageUrl} userId={profile.userId} />;
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		profile: state.profile,
		activity: state.activity
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchActivity: () => dispatch(fetchActivity()),
		fetchUserActivity: (userId) => dispatch(fetchUserActivity(userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
