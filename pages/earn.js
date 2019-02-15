import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchEarns, fetchProfileIfNeeded, fetchPlayedEarns} from '../flux/actions';
import {Fetching} from '../components/Layout';
import EarnContainer from '../components/EarnContainer';


class Earns extends Component {

    static title = 'Earn';

    static propTypes = {
        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        earns: PropTypes.object.isRequired,
        fetchProfile: PropTypes.func.isRequired,
        fetchEarns: PropTypes.func.isRequired,
        fetchPlayedEarns: PropTypes.func.isRequired,
    };

    state = {
        isLoggedIn: false
    };

    getUserEarns() {
        const {fetchPlayedEarns} = this.props;
        this.setState({isLoggedIn: true});
        fetchPlayedEarns();
    }

    componentWillReceiveProps() {
        const {isLoggedIn} = this.props;
        const {isLoggedIn: isLoggedInState} = this.state;
        if (isLoggedIn && !isLoggedInState) {
            this.getUserEarns();
        }
    }

    componentWillMount() {
        const {fetchEarns, fetchProfile, isLoggedIn} = this.props;
        if (isLoggedIn) {
            fetchProfile();
            this.getUserEarns();
        } else {
            fetchEarns();
        }
    }


    render() {
        const {earns: {isFetching, list, categories}} = this.props;

        if (isFetching) {
            return <Fetching/>;
        }

        return (
            <EarnContainer earnList={ list } earnCategories={ categories }/>
        );
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        earns: state.earns,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchProfileIfNeeded()), // top-level page needs profile
        fetchEarns: () => dispatch(fetchEarns()),
        fetchPlayedEarns: () => dispatch(fetchPlayedEarns()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Earns);
