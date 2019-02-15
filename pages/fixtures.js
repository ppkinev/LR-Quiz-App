import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    fetchProfileIfNeeded,
    fetchFixtures,
    updateFixtures,
    fetchTournaments,
    fetchPlayedFixtures,
    showParticipants,
    showParticipantsReset,
    resetJustAuthorized
} from '../flux/actions';
import withWelcome from '../components/withWelcome';
import {Fetching} from '../components/Layout';
import FixtureList from '../components/FixtureList';


class Fixtures extends Component {

    static title = 'Fixtures';

    static propTypes = {
        fixtures: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        fetchProfile: PropTypes.func.isRequired,
        fetchFixtures: PropTypes.func.isRequired,

        fetchPlayedFixtures: PropTypes.func,
        resetJustAuthorized: PropTypes.func
    };

    componentDidMount() {
        const {fetchTournaments} = this.props;
        fetchTournaments();
    }

    render() {
        const {
            fixtures: {isFetching, list, tournaments}, fetchFixtures, updateFixtures,
            isLoggedIn, showParticipants, showParticipantsReset,
            justAuthorized, resetJustAuthorized, fetchTournaments,
            userId
        } = this.props;

        if (!tournaments.length && isFetching) {
            return <Fetching />;
        }

        if (justAuthorized) {
            fetchTournaments();
            resetJustAuthorized();
        }

        return <FixtureList
            isLoggedIn={isLoggedIn}
            list={list}
            isFetching={isFetching}
            tournaments={tournaments}
            fetchFixtures={fetchFixtures}
            updateFixtures={updateFixtures}
            showParticipants={showParticipants}
            showParticipantsReset={showParticipantsReset}
            userId={userId}
        />;
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        fixtures: state.fixtures,
        isLoggedIn: state.auth.isLoggedIn,
        justAuthorized: state.auth.justAuthorized,
        userId: state.profile.userId
        // entries: state.
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchProfileIfNeeded()), // top-level page needs profile
        fetchFixtures: ({id, skip, take}) => dispatch(fetchFixtures({id, skip, take})),
        updateFixtures: ({id, skip, take}) => dispatch(updateFixtures({id, skip, take})),
        fetchTournaments: () => dispatch(fetchTournaments()),
        showParticipants: (matchId) => dispatch(showParticipants(matchId)),
        showParticipantsReset: (matchId) => dispatch(showParticipantsReset(matchId)),
        fetchPlayedFixtures: (id, fixtures) => dispatch(fetchPlayedFixtures(id, fixtures)),
        resetJustAuthorized: () => dispatch(resetJustAuthorized())
    };
};

// export default connect(mapStateToProps, mapDispatchToProps)(Fixtures);
export default withWelcome(connect(mapStateToProps, mapDispatchToProps)(Fixtures));
