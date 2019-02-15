import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchBadges } from '../flux/actions';
import { Fetching } from '../components/Layout';
import BadgesList from '../components/Badges';

class Badges extends Component {

	static title = 'Badges';

	componentDidMount() {
		const { fetchBadges } = this.props;
		fetchBadges();
	}

	render() {
		const { badges } = this.props;

		if (badges.isFetching) {
			return <Fetching/>;
		}

		return <BadgesList badges={badges} />;
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		badges: state.badges
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchBadges: () => dispatch(fetchBadges())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Badges);
