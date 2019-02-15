import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {getOfferWalls} from '../flux/actions';
import {Fetching} from '../components/Layout';
import OfferWallContainer from '../components/OfferWallContainer';


class OfferWalls extends Component {

    static title = 'Offer wall';

    static propTypes = {
        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        getOfferWalls: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.getOfferWalls();
    }

    render() {
        const {isLoggedIn, isFetching, offerwalls, userId} = this.props;

        if (isFetching) {
            return <Fetching/>;
        }

        return (
            <OfferWallContainer
                isLoggedIn={ isLoggedIn }
                offerwalls={ offerwalls }
                userId={ userId }
            />
        );
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        isFetching: state.offerwalls.isFetching,
        isLoggedIn: state.auth.isLoggedIn,
        offerwalls: state.offerwalls.list,
        userId: state.auth.isLoggedIn ? state.profile.userId : null
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getOfferWalls: () => dispatch(getOfferWalls())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferWalls);
