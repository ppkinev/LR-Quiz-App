import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import './Activities.scss';

const RECENT_ACTIVITIES_COUNT = 4;

export default class ActivitiesItem extends Component {

    splitCapitalsJoinSpaces(text) {
        return text.split(/(?=[A-Z])/).join(' ');
    }

    render() {
        const {activity, userProfileImage, userId, recent} = this.props;
        let ownStats;

        if (!activity.User || activity.User.UserName === 'You') {
            ownStats = true;
            activity.User = {
                UserName: 'You',
                ImageUrl: userProfileImage
            }
        }

        if (userId === activity.User.UserId) {
            ownStats = true;
            activity.User.UserName = 'You';
        }

        let messageTitle = '';
        messageTitle += (ownStats !== true) ? ' has ' : ' have ';
        messageTitle += (activity.Direction === 'Outflow') ? 'spent ' : 'earned ';
        messageTitle += activity.PointsAmount;
        messageTitle += ' points';

        let message = '';

        if (activity.ActivityType === 'GamePurchase') {
            if (activity.Game.Type === 'Draw') {
                message += ' playing the draw';
                message += (' to win ' + activity.Game.Draw.Prize.Title);
            } else if (activity.Game.Type === 'MatchQuiz') {
                message += ' for placing a bet on the ' + this.splitCapitalsJoinSpaces(activity.Game.MatchQuiz.HomeTeam.Name) +
                    ' vs ' + this.splitCapitalsJoinSpaces(activity.Game.MatchQuiz.AwayTeam.Name) + ' game';
            }
        }

        if (activity.ActivityType === 'RewardedActionReward') {
            switch (activity.RewardedAction.Type) {
                case 'UserRegister':
                    message += ' for joining our rewarded program';
                    break;
                case 'FacebookConnect':
                    message += ' for connecting with Facebook';
                    break;
                case 'FriendSignUp':
                    message += ' inviting a friend to our rewarding program';
                    break;
                case 'ConnectNewApp':
                    message += ' connecting another app';
                    break;
                case 'FacebookShare':
                    message += ' shouting out about us on Facebook';
                    break;
                case 'TwitterShare':
                    message += ' tweeting about us';
                    break;
                case 'CommissionConfirmed':
                    message += ' for making a great purchase';
                    break;
                case 'MatchQuizFacebookShare':
                    message += ' for sharing Score Predictor results on Facebook';
                    break;
                case 'MatchQuizTwitterShare':
                    message += ' for sharing Score Predictor results on Twitter';
                    break;
                case 'ShoppingTrackingStart':
                    message += ' for using Everton Rewards extension';
                    break;
                default:
            }
        }

        if (activity.ActivityType === 'OfferActionReward') {
            if (activity.OfferAction.Type.Group.Name === 'Share') {
                switch (activity.OfferAction.Type.Name) {
                    case 'FacebookShare':
                        message += ' finishing Facebook share offer';
                        break;
                    case 'TwitterShare':
                        message += ' finishing Twitter share offer';
                }
            } else if (activity.OfferAction.Type.Group.Name === 'Watch') {
                message += ' watching "' + activity.OfferAction.Title + '" video';
            } else if (activity.OfferAction.Type.Group.Name === 'Discover') {
                if (activity.OfferAction.Type.Name === 'Learn') {
                    message += ' for completing the tutorial "' + activity.OfferAction.Title + '"';
                } else {
                    message += ' downloading an app';
                }
            } else if (activity.OfferAction.Type.Name === 'Survey') {
                message += ' for completing the survey "' + activity.OfferAction.Title + '"';
            }
        }

        if (activity.ActivityType === 'BadgeReward') {
            message += ' getting a shiny new badge "' + activity.BadgeReward.Title + '"';
        }

        if (activity.ActivityType === 'GameWinningReward') {
            message += ' for making a correct prediction on the ' + this.splitCapitalsJoinSpaces(activity.Game.MatchQuiz.HomeTeam.Name) +
                ' vs ' + this.splitCapitalsJoinSpaces(activity.Game.MatchQuiz.AwayTeam.Name) + ' game';
        }

        const imageLink = (activity.User.UserId && userId !== activity.User.UserId) ? (
            <Link to="./user" query={ {userId: activity.User.UserId} }>
                <img src={ activity.User.ImageUrl }/>
            </Link>
        ) : (
            <div>
                <img src={ activity.User.ImageUrl }/>
            </div>
        );
        const nameLink = (activity.User.UserId && userId !== activity.User.UserId) ? (
            <Link className='activity-name' to='./user'
                  query={ {userId: activity.User.UserId} }>{activity.User.UserName}</Link>
        ) : (
            <span>{activity.User.UserName}</span>
        );

        const messageEl = message.length ? (<div className='activity-message'>{ message }</div>) : null;

        return (
            <li className="activity-section-item">
                <div className="activity-section-item-body">
                    <div className="activity-section-item-team-icons">
                        <div className="activity-section-item-team">
                            { imageLink }
                        </div>
                    </div>
                    <div className="activity-section-item-content">
                        <h5 className='activity-description'>
                            <div className='activity-title'>{ nameLink } { messageTitle }</div>
                            { messageEl }
                        </h5>
                        <h5 className='activity-date'>{ moment(activity.Date).format('dddd, MMMM Do, YYYY') }</h5>
                    </div>
                </div>
            </li>
        );
    }
}
