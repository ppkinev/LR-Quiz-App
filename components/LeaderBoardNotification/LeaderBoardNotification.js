import React, {Component, PropTypes} from 'react';
import './LeaderBoardNotification.scss';
import {connect} from 'react-redux';
import moment from 'moment';

import Link from '../Link';

import {open_notification, close_notification, fetchLeaderboard} from '../../flux/actions';


class LeaderBoardNotification extends Component {

    async componentWillMount() {
        const {open_notification, type, fetchLeaderboard, userId, users} = this.props;
        const TODAY = moment().format('x');
        let STORAGE = JSON.parse(localStorage.getItem('notifications'));

        function getDefaultData() {
            return {
                lastEnter: new Date(),
                hideLeaderboard: false,
                hideInvite: false,
                hideTop: false,
                threeDaysTimeStamp: moment().add(3, 'days').format('x')
            };
        }

        if (STORAGE) {
            const ENTRY = STORAGE[userId];

            if (ENTRY) {
                const TOP_3_RULE = +TODAY < +ENTRY.threeDaysTimeStamp;
                const LEADERBOARD_RULE = moment().toObject().date < 8;

                if (type === 'leaderboard') {
                    if (LEADERBOARD_RULE && !ENTRY.hideLeaderboard) {
                        open_notification(type);
                        ENTRY.hideLeaderboard = true;
                    }
                    if (!LEADERBOARD_RULE) ENTRY.hideLeaderboard = false;
                }

                if (type === 'top3') {
                    if (TOP_3_RULE && !ENTRY.hideTop) {
                        await fetchLeaderboard('lastmonth');
                        if (users.length > 0) {
                            const sortByRank = users.sort((a, b) => a.Rank - b.Rank);
                            const top3 = sortByRank.slice(0, 3);
                            top3.forEach((topUser) => {
                                if (topUser.UserId === userId) {
                                    open_notification(type);
                                    ENTRY.hideTop = true;
                                }
                            });
                        }
                    }
                    if (!TOP_3_RULE) ENTRY.hideTop = false;
                }
            } else {
                // Add storage data for current user
                if (userId) STORAGE[userId] = getDefaultData();
            }
        } else {
            // Create enter data, if storage is empty
            if (userId) STORAGE = {[userId]: getDefaultData()};
        }

        await window.localStorage.setItem('notifications', JSON.stringify(STORAGE));
    }


    closeNotification() {
        let {type, close_notification} = this.props;
        if (type === 'invite-friend') {
            let elem = document.getElementsByClassName('screen-swiper')[0];
            elem.style.cssText = 'margin-top : 0'
        }
        close_notification(type);
    }


    render() {

        const {isLoggedIn, notifications, type} = this.props;
        const close = () => this.closeNotification();

        let link;
        let image = `./images/${type}.png`;
        let query = null;

        switch (type) {
            case 'invite-friend' :
                link = 'invite-friends';
                break;
            case 'leaderboard' :
                link = 'leaderboard';
                query = {
                    timeperiod: 'lastmonth',
                    filtertype: 'allusers'
                };
                break;
            case 'top3':
                link = 'leaderboard';
                query = {
                    timeperiod: 'lastmonth',
                    filtertype: 'allusers'
                };
                break;
            default :
                link = 'test';
                break;
        }


        let blocks = notifications.list.map((n) => {
            if (n.show && n.type === type) {
                return (
                    <div className={` notificationLeaderboard ${n.type}Notification `}>
                        <Link to={`./${link}`} query={ query } className="notification-left-side">
                            <div className="picture">
                                <img src={ require(image) }/>
                            </div>
                            <div className="central">
                                <h3 className="title">{ n.title }</h3>
                                <span className="message">{ n.msg }</span>
                            </div>
                        </Link>
                        <div className="notification-right-side" onClick={ close }>
                            <div className="close">&times;</div>
                        </div>
                    </div>
                )
            } else {
                return null
            }
        });

        return (
            <div id='notificationHolder' style={!isLoggedIn ? {display: 'none'} : {}}>
                {blocks}
            </div>
        )

    }
}


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        notifications: state.notifications,
        users: state.leaderboard.players,
        userId: state.profile.userId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        open_notification: (type) => dispatch(open_notification(type)),
        close_notification: (type) => dispatch(close_notification(type)),
        fetchLeaderboard: () => dispatch(fetchLeaderboard())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoardNotification)


