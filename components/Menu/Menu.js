import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requestAuth, fetchProfileIfNeeded } from '../../flux/actions';
import Hammer from 'react-hammerjs';
import Link from '../Link';
import Button from '../Button';
import './Menu.scss';

import {numToFixed} from '../../lib/utils';

const DIRECTION_LEFT = 2; //from Hammer



const MenuItem = (props) => {
	const { label, path, active, query , profile, openModal } = props;
	const path2icon = (path) => {
		if (path === 'earn' || path === 'offerwall') {
			return require('../../static/images/icon-cup.svg');
		}
		if(path === 'invite-friends') {
			return require('../../static/images/invite-friends.png');
		}

		return require(`./images/icon-${path}.svg`);
	};

	return (
		<div style={!profile && path === 'invite-friends' ? {display : 'none'} : {} }
			 className={path === 'invite-friends' ? 'invite-friends' : ''}>
			<Link className={`menu-item menu-item-${path} ${active ? 'active' : ''}`} to={`./${path}`} query={ query }>
				<div className="icon-menu-item">
					<img src={ path2icon(path) }/>
				</div>
				<h3>{ label }</h3>
			</Link>
			<div className={profile ? 'hide-modal' : 'show-modal'} onClick={path === 'invite-friends' ? () => {openModal()} : null }></div>
		</div>
	)
};


const ProfileHeader = ({ profile }) => {
	const { name, imageUrl, points, credits, pendingPoints } = profile;


	return (
		<Link className="menu-header" to="./profile">
			<div className="user-picture">
				<img src={imageUrl}/>
			</div>
			<div className="user-info">
				<div className="menu-user-name">{ name }</div>
				<div className="user-stats">
					<div className="user-stats-points">{ points } Points</div>
					<div className="separator">|</div>
					{/*<div className="user-stats-pending">{ pendingPoints } pending</div>*/}
					<div className="user-stats-points">£{ credits && numToFixed(credits, 2) }</div>
				</div>
			</div>
		</Link>
	);
};


const AuthHeader = ({ onClick }) => {
	return (
		<div className="menu-header menu-login" onClick={ onClick }>
			<div className="icon-menu-item">
				<img src={ require('./images/icon-profile.svg') }/>
			</div>
			<h3 className="">Log In</h3>
		</div>
	);
};


class Menu extends Component {

	static propTypes = {
		activePath: PropTypes.string,
		show: PropTypes.bool.isRequired,
		onClick: PropTypes.func.isRequired,
		// from store
		profile: PropTypes.object,
		openAuthPopup: PropTypes.func.isRequired,
        fetchProfile: PropTypes.func
	};


	render() {
		const { activePath, show, profile, openAuthPopup, fetchProfile, ...others} = this.props;
		const hiddenClass = !show ? 'is-hidden' : '';
		const onSwipe = (e) => {
			if (e.direction === DIRECTION_LEFT) {
				this.props.onClick(); // close menu
			}
		};
		const isActiveItem = (path) => (activePath === `/${path}`);
		const onAuthClick = () => openAuthPopup('login');
		const leaderboardQuery = {
			timeperiod: 'alltime',
			filtertype: 'allusers'
		};

		let profileHeaderMaybe = <AuthHeader onClick={ onAuthClick }/>;
		if (profile !== null) {
			profileHeaderMaybe = <ProfileHeader profile={profile}/>;
		}

		return (
			<Hammer onSwipe={onSwipe}>
				<div className={"menu " + hiddenClass } {...others} >
					<div className="menu-panel">

						{profileHeaderMaybe}

						<MenuItem label="Fixtures" path='fixtures' active={ isActiveItem('fixtures') }/>

						<MenuItem label="Leaderboard" path='leaderboard' active={ isActiveItem('leaderboard') } query={ leaderboardQuery } />

						<MenuItem label="Earn" path='earn' active={ isActiveItem('earn') }/>

                        {(profile && window.config.skin !== 'mbet') ? <MenuItem label="Offer walls" path='offerwall' active={ isActiveItem('offerwall') }/> : null}

						<MenuItem label="Draws" path='draws' active={ isActiveItem('draws') }/>

                        {window.config.skin !== 'mbet' && <MenuItem label="Invite friends & get +50 pts" path='invite-friends' active={ isActiveItem('invite-friends') } profile={profile} openModal={openAuthPopup}/>}

					</div>
				</div>
			</Hammer>
		);
	}
}


// Connect to store
//
const mapStateToProps = (state) => {
	const { profile, auth } = state;
	return {
		profile: auth.isLoggedIn ? profile : null
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		openAuthPopup: (view) => dispatch(requestAuth(view)),
        fetchProfile: () => dispatch(fetchProfileIfNeeded())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
