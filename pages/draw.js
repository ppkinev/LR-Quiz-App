import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchProfileIfNeeded, fetchDraws, selectDraw, fetchPlayedDraws} from '../flux/actions';
import {Fetching} from '../components/Layout';
import DrawContainer from '../components/DrawContainer';


class Draw extends Component {

    static title = ' '; // set dynamically to draw title

    static propTypes = {
        params: PropTypes.object.isRequired,

        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        drawItem: PropTypes.object.isRequired,
        fetchProfile: PropTypes.func.isRequired,
        fetchDraws: PropTypes.func.isRequired,
        selectDraw: PropTypes.func.isRequired,
    };

    state = {
        isLoggedIn: false
    };

    getPlayedDraws(){
        const {fetchPlayedDraws, isLoggedIn} = this.props;

        if (!this.state.isLoggedIn) {
            if (isLoggedIn) {
                this.setState({isLoggedIn: true});
                fetchPlayedDraws();
            }
        }
    }

    async componentDidMount() {
        const {draws, params: {drawId}, selectDraw, fetchDraws, fetchProfile} = this.props;

        fetchProfile(); // need points for bet
        selectDraw(drawId);
        if (!draws.length) {
            fetchDraws().then(() => {
                this.getPlayedDraws();
            });
        }
    }

    render() {
        const {drawItem} = this.props;

        if (drawItem.isFetching) {
            return <Fetching/>;
        }

        return (
            <DrawContainer drawItem={ drawItem }/>
        );
    }

}

// Connect to store
//
const mapStateToProps = (state) => {
    const selectedDrawItem = state.draws.list.find(({drawId}) => drawId === state.selectedDrawId);

    return {
        isLoggedIn: state.auth.isLoggedIn,
        drawItem: selectedDrawItem || {isFetching: true},
        draws: state.draws.list
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: () => dispatch(fetchProfileIfNeeded()),
        fetchDraws: () => dispatch(fetchDraws()),
        fetchPlayedDraws: () => dispatch(fetchPlayedDraws()),
        selectDraw: (matchId) => dispatch(selectDraw(matchId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Draw);
