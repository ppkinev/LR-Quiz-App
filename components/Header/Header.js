import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {postLogout} from '../../flux/actions';
import Location from '../../lib/Location';
import Link from '../Link';
import './Header.scss';

import {numToFixed} from '../../lib/utils';


class Header extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        hasBack: PropTypes.bool.isRequired,
        hasLogout: PropTypes.bool.isRequired,
        onMenuBtnClick: PropTypes.func.isRequired,
        // From store
        credits: PropTypes.number,
    };

    handleLogout() {
        this.props.postLogout({
            onSuccess: () => {
                Location.push({pathname: './fixtures'});
            }
        });
    }

    renderLeftBtn() {
        const {onMenuBtnClick, hasBack, directBack} = this.props;
        const menuBtn = (
            <div className="nav-button" onClick={onMenuBtnClick}>
                <img className="icon-menu" src={require('./images/icon-menu.svg')}/>
            </div>
        );
        const backBtn = directBack ? (
            <Link className="nav-button back" to={directBack}>
                <img src={require('../../static/images/arrow-left-white.png')}/> Back
            </Link>
        ) : (
            <Link className="nav-button back" goBack={true}>
                <img src={require('../../static/images/arrow-left-white.png')}/> Back
            </Link>
        );

        return hasBack ? backBtn : menuBtn;
    }

    renderRightBtn() {
        const {points, credits, hasLogout, hasInviteFriendsIco} = this.props;
        // const pointsClass = (credits === null) ? 'is-hidden' : '';
        const pointsClass = (points === null) ? 'is-hidden' : '';
        const onLogout = () => this.handleLogout();

        const inviteFriendsIco = (
            <Link className="header-points" to="./invite-friends">
                <img className="icon-points" src={require('./images/invite-friends.png')}/>
            </Link>
        );
        // const ptsBtn = (
        // 	<Link className={ "header-points " + pointsClass } to="./offerwall">
        // 		{/*<img className="icon-points" src={ require('../../static/images/icon-cup.svg') }/>*/}
        // 		£{ credits && numToFixed(credits, 2) }
        // 	</Link>
        // );

        const ptsBtn = (
            <Link className={'header-points ' + pointsClass} to="./earn">
                {/*<img className="icon-points" src={ require('../../static/images/icon-cup.svg') }/>*/}
                {points} pts
            </Link>
        );
        const logoutBtn = (
            <div className="nav-button logout" onClick={onLogout}>
                Logout
            </div>
        );

        // TODO: INVITE_FRIENDS TEMPORARY CONDITION
        if (window.config.skin === 'mbet') {
            return hasLogout ? logoutBtn : ptsBtn;
        }

        if (hasLogout) {
            return logoutBtn;
        } else if (hasInviteFriendsIco) {
            return inviteFriendsIco;
        } else {
            return ptsBtn;
        }
    }

    render() {
        const {title} = this.props;

        return (
            <div className="header">
                {this.renderLeftBtn()}

                <div className="header-title">
                    <h2>{title}</h2>
                </div>

                {this.renderRightBtn()}
            </div>
        );
    }

}

// Connect to store
//
const mapStateToProps = (state) => {
    const {profile, auth} = state;

    return {
        credits: auth.isLoggedIn ? profile.credits : null,
        points: auth.isLoggedIn ? profile.points : null
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        postLogout: ({page, onSuccess}) => dispatch(postLogout({page, onSuccess})),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);
