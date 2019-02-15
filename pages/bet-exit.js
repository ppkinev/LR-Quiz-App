import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLatestStartedDrawItem } from '../lib/utils.js';
import { fetchDraws } from '../flux/actions';
import { Fetching } from '../components/Layout';
import QuizBetExit from '../components/QuizBetExit';


class BetExit extends Component {

	static title = 'Score Predictor';

	static propTypes = {
		// from store
        isFetching: PropTypes.bool.isRequired,
		latestDrawItem: PropTypes.object.isRequired,
		fetchDraws: PropTypes.func.isRequired,
	};

	componentWillMount(){
	    const {draws, fetchDraws} = this.props;
	    if (!draws.length) fetchDraws();
    }

	// componentDidMount() {
	// 	this.props.fetchDraws({upcoming: true}); // need to get nextDrawItem
	// }

	render() {
		const { latestDrawItem } = this.props;

		if (latestDrawItem.isFetching) {
			return <Fetching/>;
		}

		return (
			<QuizBetExit latestDrawItem={ latestDrawItem }/>
		);
	}
}


// Connect to store
//
const mapStateToProps = (state) => {
	return {
	    draws: state.draws.list,
		latestDrawItem: getLatestStartedDrawItem(state.draws.list) || {isFetching: true},
        isFetching: state.draws.isFetching
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchDraws: () => dispatch(fetchDraws()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(BetExit);

