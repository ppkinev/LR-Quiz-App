import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchDraws, fetchProfileIfNeeded, fetchPlayedDraws, resetJustAuthorized} from '../flux/actions';
import {Fetching} from '../components/Layout';
import DrawList from '../components/DrawList';


class Draws extends Component {

    static title = 'Draws';

    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        draws: PropTypes.object.isRequired,
        fetchProfile: PropTypes.func.isRequired,
        fetchDraws: PropTypes.func.isRequired,
        fetchPlayedDraws: PropTypes.func.isRequired,
        resetJustAuthorized: PropTypes.func.isRequired,
    };

    state = {
        isLoggedIn: false
    };

    fetchPrivateData() {
        const {fetchProfile, fetchPlayedDraws, isLoggedIn} = this.props;
        if (!this.state.isLoggedIn) {
            if (isLoggedIn) {
                this.setState({isLoggedIn: true});
                fetchProfile();
                fetchPlayedDraws();
            }
        }
    }

    componentWillMount() {
        const {fetchDraws} = this.props;
        fetchDraws().then(() => {
            this.fetchPrivateData();
        });
    }

    render() {
        const {draws: {isFetching, list}, justAuthorized, resetJustAuthorized} = this.props;

        // ...
        if (justAuthorized) {
            // rest is handled in componentWillReceiveProps
            resetJustAuthorized();
        }

        if (isFetching) {
            return <Fetching/>;
        }
        return <DrawList list={ list }/>;
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        justAuthorized: state.auth.justAuthorized,
        draws: state.draws,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchProfileIfNeeded()), // top-level page needs profile
        fetchDraws: () => dispatch(fetchDraws()),
        fetchPlayedDraws: () => dispatch(fetchPlayedDraws()),
        resetJustAuthorized: () => dispatch(resetJustAuthorized())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Draws);
