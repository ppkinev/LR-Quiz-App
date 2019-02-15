import React, {Component, PropTypes} from 'react';
import Link from '../Link';
import Logo from './Logo.js';
import BadgesList from '../Badges/Badges';
import ActivitiesList from '../Activities/';
import ProfileBoard from './ProfileBoard';
import Button from '../Button'
import './UserProfile.scss';
import '../Leagues/Leagues.scss';

import Notification from '../LeaderBoardNotification/LeaderBoardNotification';

import {numToFixed} from '../../lib/utils';


function additionalStatus(status) {
    let elem = document.getElementById('profileHold');
    let content = document.getElementsByClassName('content')[0];
    if (status) {
        content.style.cssText = 'position: relative';
        elem.style.cssText = 'margin-top : 110px';
    } else {
        content.style.cssText = 'position: inherit';
        elem.style.cssText = 'margin-top : 0px';
    }
}

class UserProfile extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
    };

    renderRecentBadgets(badges, userBadges) {
        if (!badges.earned.length || !badges.missing.length) return null;
        const {userId} = this.props;

        const viewMoreBadges = () => {
            if (!userId) {
                return (
                    <Link className="view-more" to="/badges">
                        <div className="view-more-text">View All Badges</div>
                        <div className="li-arrow">
                            <img src={require('../../static/images/arrow-right-grey.png')}/>
                        </div>
                    </Link>
                );
            }
        };

        return (
            <div className="profile-section">
                <div className="profile-section-header">
                    <h5>Recent Badges</h5>
                </div>

                <BadgesList badges={badges} recent={true} userBadges={userBadges}/>
                { viewMoreBadges() }
            </div>
        );
    }

    lastActivity(activities, userProfileImage, userId) {
        if (!activities || !activities.userActivities.length && (!activities.allActivities || !activities.allActivities.length)) return null;
        const RECENT_ACTIVITY_COUNT = 3;

        let viewMoreActivity;
        if (!activities.allActivities) {
            viewMoreActivity = () => (activities.userActivities.length > RECENT_ACTIVITY_COUNT) ? (
                <Link className="view-more" to='/activities' query={{userId}}>
                    <div className="view-more-text">View All Activities</div>
                    <div className="li-arrow">
                        <img src={require('../../static/images/arrow-right-grey.png')}/>
                    </div>
                </Link>
            ) : null;
        } else {
            viewMoreActivity = () => activities.allActivities.length ? (
                <Link className="view-more" to='/activities'>
                    <div className="view-more-text">View All Activities</div>
                    <div className="li-arrow">
                        <img src={require('../../static/images/arrow-right-grey.png')}/>
                    </div>
                </Link>
            ) : null;
        }

        return (
            <div className='profile-section'>
                <div className="profile-section-header">
                    <h5>Latest activity</h5>
                </div>

                <ActivitiesList activities={activities} userProfileImage={userProfileImage} userId={userId}
                                recent={true} profileClassForStyle/>

                { viewMoreActivity() }
            </div>
        );
    }

    renderSummaryBadges(userId, badges) {
        return (
            <div className="summary-bottom-section">
                <div className="left-side">
                    <img className="aside-icon" src={require('./images/badges.svg')} alt=""/>
                </div>
                <div className="right-side">
                    <h4 className="aside-title">{badges.earned.length} Badges</h4>
                    { !userId ? (<h5 className="aside-text">+{badges.missing.length} in progress</h5>) : '' }
                </div>
            </div>
        );
    }

    renderSummaryPending(userId, points, pendingPoints) {
        return (
            <div className="summary-bottom-section">
                <div className="left-side">
                    <img className="aside-icon" src={require('./images/points.svg')} alt=""/>
                </div>
                <div className="right-side">
                    <h4 className="aside-title">{ points } points</h4>
                    { !userId ? (<h5 className="aside-text">+{ pendingPoints } pending</h5>) : '' }
                </div>
            </div>
        );
    }

    renderSummaryCredits(userId, credits, pendingCredits) {
        return !userId ? (
            <div className="summary-bottom-section">
                <div className="left-side">
                    <img className="aside-icon" src={require('./images/credits.svg')} alt=""/>
                </div>
                <div className="right-side">
                    <h4 className="aside-title">£{ credits && numToFixed(credits, 2) }</h4>
                    <h5 className="aside-text">+{ pendingCredits && numToFixed(pendingCredits, 2) } pending</h5>
                </div>
            </div>
        ) : null;
    }

    renderEmailVerificationPanel() {
        const {user: {email, isEmailConfirmed}, isEmailVerificationSent, verifyEmail} = this.props;

        let button = <Button className={"simple-btn"} onClick={verifyEmail}>{'Send verification email'}</Button>;
        if (isEmailVerificationSent) button = <Button className={"simple-btn green"}>Verification email sent to {email}</Button>;
        if (isEmailConfirmed) button = null;

        return (
            <div className="profile-section">
                <div className="profile-section-header">
                    <h5>Email Verification</h5>
                </div>

                {button}
            </div>
        );
    }

    render() {
        const {
            user: {
                userId,
                name,
                imageUrl,
                points,
                pendingPoints,
                credits,
                pendingCredits,
                friendsCount,
                friendRequestsCount,
                relationships,
                isEmailConfirmed
            },
            badges,
            userBadges,
            sendFriendRequest,
            follow,
            unfollow,
            friends,
            activity
        } = this.props;

        const lastActivity = () => this.lastActivity(activity, imageUrl, userId);
        const renderRecentBadgets = () => this.renderRecentBadgets(badges, userBadges);
        const emailVerificationPanel = !isEmailConfirmed ? this.renderEmailVerificationPanel() : null;

        return (
            <div id='profileHold'>
                <Notification type='leaderboard'/>
                <Notification type='top3'/>
                <div className="user-profile">
                    <div className="profile-summary">

                        <div className="profile-top">
                            <div className="summary-center">
                                <Logo src={imageUrl}/>
                                <div className="user-name">{ name }</div>
                            </div>
                        </div>

                        <div className="profile-middle">
                            { this.renderSummaryBadges(this.props.userId, badges) }
                        </div>

                        <div className="profile-bottom">
                            { this.renderSummaryPending(this.props.userId, points, pendingPoints) }
                            { this.renderSummaryCredits(this.props.userId, credits, pendingCredits) }
                        </div>
                    </div>

                    { !relationships && emailVerificationPanel }

                    <ProfileBoard userId={userId}
                                  relationships={relationships}
                                  friends={friends}
                                  friendsCount={friendsCount}
                                  friendRequestsCount={friendRequestsCount}
                                  sendFriendRequest={sendFriendRequest}
                                  follow={follow}
                                  unfollow={unfollow}
                    />

                    { renderRecentBadgets(badges, userBadges) }
                    { lastActivity() }

                </div>
            </div>
        );
    }
}

export default UserProfile;
