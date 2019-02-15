import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Location from '../../lib/Location';
import { requestAuth, postDrawBet, postDrawClaim } from '../../flux/actions';
import DrawWinner from '../DrawWinner';
import DrawClaimPrize from '../DrawClaimPrize';
import DrawStatic from '../DrawStatic';
import DrawBet from '../DrawBet';
import BetSuccess from '../BetSuccess'; // TODO - rename
import DrawBetExit from '../DrawBetExit';
import '../Header/Header.scss';




function goToExitPage() {
	Location.push({pathname: './draw-exit',});
}

class DrawContainer extends Component {

	static propTypes = {
		drawItem: PropTypes.object.isRequired,
		// from store
		isLoggedIn: PropTypes.bool.isRequired,
		points: PropTypes.number.isRequired,
		openAuthPopup: PropTypes.func.isRequired,
		postDrawBet: PropTypes.func.isRequired,
		postDrawClaim: PropTypes.func.isRequired,
		betError: PropTypes.string,
	};
	static contextTypes = {
		updateHeader: PropTypes.func.isRequired,
	};

	state = {
		view: 'bet',
	};

	componentDidMount() {
		const { drawItem: { prizeTitle }} = this.props;

		this.context.updateHeader({
			hasBack: true,
			title: prizeTitle
		});
	}

	componentWillReceiveProps({ drawItem: { prizeTitle: nextPrizeTitle } }) {
		const { drawItem: { prizeTitle }} = this.props;

		if (prizeTitle !== nextPrizeTitle) {
			// this.context.updateHeader({title: nextPrizeTitle});

            //TODO: change next draw name on draw-exit page separately
		}
	}

	nextView(view) {
		this.setState({view});
	}

    nextPage() {
		const { isLoggedIn, openAuthPopup } = this.props;

		if (!isLoggedIn) {
			openAuthPopup();
		} else {
            goToExitPage();
		}
	}

	submitClaim(formData) {
		const { drawItem: { drawId }, postDrawClaim } = this.props;

		postDrawClaim(drawId, formData)
			.then(() => {
				this.nextView('success');
			})
			.catch(() => {
			});
	}



	render() {
		const { isLoggedIn, points, drawItem, betError, postDrawBet } = this.props;
		const { view } = this.state;
		const { isDrawn, winner, isWinner, needToClaim, endDate } = drawItem;
		const demoPoints = !isLoggedIn ? 10 : 0;
		const onNextPage = () => this.nextPage();
		const onClaimSubmit = (formData) => this.submitClaim(formData);
		const onDismissSuccess = () => goToExitPage();

        const drawIsFinished = (new Date(endDate)).getTime() - Date.now() <= 0;

		let View;
		if (view === 'bet') {
		    if (!drawIsFinished) {
                View = (
                    <DrawBet
                        points={ points }
                        demoPoints={ demoPoints }
                        drawItem={ drawItem }
                        betError={ betError }
                        onSubmit={ postDrawBet }
                        nextPage={ onNextPage }
                        isLoggedIn={ isLoggedIn }
                    />
                );
            } else {
                if (!isDrawn) {
                    View = (
                        <DrawStatic drawItem={ drawItem } withLabel={false}>
                            <h2 className="draw-claim-title">Winner will be announced soon</h2>
                            <h4 className="draw-claim-subtitle">As soon as the draw will be drawn we'll know the winner!</h4>
                        </DrawStatic>
                    );
                } else if (!winner) {
                    View = (
                        <DrawStatic drawItem={ drawItem } withLabel={false}>
                            <h2 className="draw-claim-title">Nobody played this Draw</h2>
                            <h4 className="draw-claim-subtitle">Prize will be played again after some time</h4>
                        </DrawStatic>
                    );
                } else if (!isWinner) {
                    View = <DrawWinner drawItem={ drawItem }/>;
                } else if (needToClaim) {
                    View = <DrawClaimPrize drawItem={ drawItem } onSubmit={ onClaimSubmit }/>;
                } else {
                    View = (
                        <DrawStatic drawItem={ drawItem } withLabel={true}>
                            <h2 className="draw-claim-title">We'll contact you in 2 days</h2>
                            <h4 className="draw-claim-subtitle">Prize will arrive to you in 1 month</h4>
                        </DrawStatic>
                    );
                }
            }

		}
		else if (view === 'success') {
			View = <BetSuccess onDismiss={ onDismissSuccess } isDraw={true}/>;
		}

		return (
			<div className="screen">
				{ View }
			</div>
		);
	}
}


// Connect to store
//
const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		points: state.profile.points,
		betError: state.draws.betError,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		openAuthPopup: () => dispatch(requestAuth()),
		postDrawBet: (drawId, points) => dispatch(postDrawBet(drawId, points)),
		postDrawClaim: (drawId, formData) => dispatch(postDrawClaim(drawId, formData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawContainer);
