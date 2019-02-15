import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchLeaderboard } from '../flux/actions';
import LeaderBoardContainer from '../components/LeaderBoardContainer';

class Leaders extends Component {

	static title = 'Leaderboard';

	componentDidMount() {
		const { params: { filtertype, timeperiod }, fetchLeaderboard } = this.props;

		fetchLeaderboard(timeperiod, filtertype);
	}

	render() {
		const { params, leaderboard: { isFetching, players }, fetchLeaderboard } = this.props;
		const listSorted = players.sort((a, b) => a.rank - b.rank);

		return (
			<LeaderBoardContainer params={ params } list={ players } fetchLeaderboard={ fetchLeaderboard } isFetching={ isFetching } />
		);
	}

}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		leaderboard: state.leaderboard
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchLeaderboard: (timeperiod, filtertype) => dispatch(fetchLeaderboard(timeperiod, filtertype))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaders);
