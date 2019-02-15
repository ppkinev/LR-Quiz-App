import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchFixturesIfNeeded, fetchPlayedFixtures } from '../flux/actions';
import withWelcome from '../components/withWelcome';
import { Fetching } from '../components/Layout';
import Location from '../lib/Location';

// Is is from previous developer, I don`t know why he use setTimeout
// For now I just call required initial function as async func (see line 41)

const MIN_DELAY = 2000;

function goToQuizPage(matchId) {
	Location.push({pathname: './quiz', query: {matchId}});
}

function goToFixturesPage() {
	Location.push({pathname: './fixtures',});
}

class Index extends Component {

	static title = 'Score Predictor';

	static propTypes = {
		// from store
		fixtureList: PropTypes.array.isRequired,
		fetchFixtures: PropTypes.func.isRequired,
		fetchPlayedFixtures: PropTypes.func.isRequired,
	};

	async componentDidMount() {
		const { fetchFixtures, fetchPlayedFixtures } = this.props;



		try {
			fetchFixtures();
			await fetchPlayedFixtures(); // need to know which quizes are played
		} catch (e) {
			//nothing
		}

		this.visitFirstPlayableQuizOrList();
		// setTimeout(() => this.visitFirstPlayableQuizOrList() , MIN_DELAY);
	}

	visitFirstPlayableQuizOrList() {
		const notPlayedQuiz = this.props.fixtureList.filter(({ isOpenForBetting, betAmount }) => isOpenForBetting && betAmount);
		let notPlayedQuizDates, nearestNotPlayedQuizDate, nearestNotPlayedQuiz;

		if (notPlayedQuiz.length) {
			notPlayedQuizDates = notPlayedQuiz.map(({ startDate }) => Date.parse(startDate));
			nearestNotPlayedQuizDate = Math.min.apply(null, notPlayedQuizDates);
			nearestNotPlayedQuiz = notPlayedQuiz.find(({ startDate }) => Date.parse(startDate) === nearestNotPlayedQuizDate);
		}

		if (nearestNotPlayedQuiz) {
			goToQuizPage(nearestNotPlayedQuiz.matchId);
		} else {

			goToFixturesPage();
		}
	}

	render() {
		return (
			<Fetching/>
		);
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		fixtureList: state.fixtures.list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchFixtures: () => dispatch(fetchFixturesIfNeeded()),
		fetchPlayedFixtures: () => dispatch(fetchPlayedFixtures()),
	};
};

export default withWelcome(connect(mapStateToProps, mapDispatchToProps)(Index));
