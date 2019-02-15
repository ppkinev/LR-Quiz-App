import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRewards, startSharingFacebook, startSharingTwitter, hideShare} from '../../flux/actions';
import  { SharingPopup }   from '../Popup';
import SocialLink from '../SocialLink';


class SharingControls extends Component {
	static propTypes = {
		matchId: PropTypes.string.isRequired,
		// from store:
		isLoggedIn: PropTypes.bool.isRequired,
		points: PropTypes.number.isRequired,
		rewards: PropTypes.object.isRequired,
		fetchRewards: PropTypes.func.isRequired,
		startSharingFacebook: PropTypes.func.isRequired,
		startSharingTwitter: PropTypes.func.isRequired,
	};


	componentDidMount() {
		if (this.props.isLoggedIn) {
			this.props.fetchRewards();
		}
	}

	componentWillReceiveProps({ isLoggedIn, points , rewardsModalShow }) {
		const wasLoggedIn = this.props.isLoggedIn;
		const justAuthorized = !wasLoggedIn && isLoggedIn;

		if (justAuthorized) {
			this.props.fetchRewards();
		}

		if(rewardsModalShow) {
			setTimeout(()=> {
				this.props.hideShare()
			}, 2000)
		}

		const pointsDiff = points - this.props.points;
		if (wasLoggedIn && pointsDiff > 0) {
			this.showAwardPopup(pointsDiff);
		}
	}

	async submitShare(name) {
		const {matchId, startSharingFacebook, startSharingTwitter , hideSrare } = this.props;

		if (name === 'facebook') {

		 startSharingFacebook(matchId);
		} else if (name === 'twitter') {
		 startSharingTwitter(matchId);
		}
	}

	showAwardPopup(points) {
		this.refs['sharing-popup'].show(points, 3000);
	}

	render() {
		const { isLoggedIn, rewards , rewardsModalShow } = this.props;
		const {
			facebookShare: {rewardPoints: facebookSharePoints} = {},
			twitterShare: {rewardPoints: twitterSharePoints} = {},
			} = rewards;
		const onShareClick = (name) => this.submitShare(name);

		if (!isLoggedIn) {
			return <div/>;
		}

		return (
			<div className="sharing">
				<SharingPopup ref="sharing-popup"/>

				<SocialLink key="fb" name="facebook" points={facebookSharePoints} onClick={ onShareClick }/> &nbsp;
				<SocialLink key="tw" name="twitter" points={twitterSharePoints} onClick={ onShareClick }/>
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
		rewards: state.rewards.map,
		rewardsModalShow : state.rewards.modal
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchRewards: () => dispatch(fetchRewards()),
		startSharingFacebook: (matchId) => dispatch(startSharingFacebook(matchId)),
		startSharingTwitter: (matchId) => dispatch(startSharingTwitter(matchId)),
		hideShare : () => dispatch(hideShare())

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SharingControls);
