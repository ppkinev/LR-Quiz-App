import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Section from './Section.js';
import Link from '../Link';
import Logo from '../UserProfile/Logo.js';
import AuthPopup from '../../components/AuthPopup/AuthPopup'
import './leader-board.scss';

import  InviteFriend from '../../components/invite-friend/InviteFriend'

import _ from 'lodash';

import {requestAuth, findCurrentUser} from '../../flux/actions';


class LeaderBoard extends Component {

    static propTypes = {
        top3: PropTypes.array.isRequired,
        users: PropTypes.array.isRequired,
        //from store
        profile: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired
    };

    openSignUp() {
        this.props.requestAuth();
    }

    componentWillMount() {
        let {findCurrentUser, profile : {userId}} = this.props;
        findCurrentUser(userId);
    }


    render() {
        const {top3, users, profile: {userId: profileUserId}, auth : {isLoggedIn}, currentUserStatus, friends} = this.props;
        const myUser = users.find(({UserId}) => UserId === profileUserId);
        const rankTitle = myUser ? `You are ranked ${myUser.Rank}` : '';

        const top3cols = top3.map((user, i) => {
            const {UserId: userId, ImageUrl, UserName, AnswersCount, Rank} = user;
            const hoverBlockStyle = isLoggedIn ? 'hover-block' : 'show-hover-block';

            return (
                <div key={`top-user-${i}`} className="leaderboard-top">
                    <Link to="./user" query={ {userId} }>
                        <Logo src={ ImageUrl } rank={ Rank }/>
                    </Link>
                    <div className="leaderboard-top-info">
                        <div className="user-points">{ AnswersCount } Answers</div>
                        <Link to="./user" query={ {userId} }>
                            <div className="user-name">{ UserName }</div>
                        </Link>
                    </div>
                    <div onClick={() => {
                        this.openSignUp()
                    } } className={hoverBlockStyle}></div>
                </div>
            );
        });


        let additionalSort = _.sortBy(users, ["Rank", "UserName"]);

        if (additionalSort.length > 50) {
            additionalSort.splice(49)
        }

        const playerItems = additionalSort.map((user, i) => {
            const {UserId: userId, ImageUrl, UserName, AnswersCount, Rank} = user;
            const style = profileUserId == userId ? 'user-list-item myself' : 'user-list-item';

            const hoverBlockStyle = isLoggedIn ? 'hover-block' : 'show-hover-block';

            return (
                <div key={`user-${i}`} className={style}>
                    <div className="user-rank">{ Rank }</div>
                    <Link to="./user" query={ {userId} }>
                        <Logo src={ImageUrl}/>
                    </Link>
                    <div className="user-details">
                        <div className="user-name large">
                            <Link to="./user" query={ {userId} }>{ UserName }</Link>
                        </div>
                        <div className="user-points large">{ AnswersCount } answers</div>
                        <div onClick={() => {
                            this.openSignUp()
                        } } className={hoverBlockStyle}></div>
                    </div>
                </div>
            );
        });


        const additionalUserBlock = () => {
            if (currentUserStatus) {
                return null
            } else {
                const {profile : {userId, imageUrl, name}} = this.props
                return (
                    <div className="leaderboard ">
                        <div key={`user-${userId}`} className='user-list-item myself additionalUserBlock'>
                            <div className="user-rank"> ---</div>
                            <Link to="./user" query={ {userId} }>
                                <Logo src={imageUrl}/>
                            </Link>
                            <div className="user-details">
                                <div className="user-name large">
                                    <Link to="./user" query={ {userId} }>{name}</Link>
                                </div>
                                <div className="user-points large">0 answers</div>
                            </div>
                        </div>
                    </div>
                )
            }
        }


        const topBlock = () => {
            if (top3cols.length > 0) {
                return (
                    <div className="leaderboard">
                        <div>
                            <div className="leaderboard-title">
                                <h2>Top players</h2>
                                <p>Overall</p>
                            </div>
                            <div className="top3cols">
                                { top3cols }
                            </div>
                        </div>

                    </div>
                );
            } else {
                return null;
            }
        };

        const middleBlock = () => {
            if (playerItems.length > 0) {
                return (
                    <div className="leaderboard">
                        <div>
                            <div className="leaderboard-title">
                                <h2>{ rankTitle }</h2>
                                <p>Overall</p>
                            </div>
                            <ul className="user-list">
                                { playerItems }
                            </ul>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        };


        const RatedUsersMiss = () => {
            return (
                <span>
					asf
				</span>
            );
        };


        const {auth, friendsCount} = this.props;

        // Here we check currentUser friends length. If he has zero friends, we render invite-friends page
        const additionalFiler = location.search.split('&')[0].split('=')[1];

        const RULE = additionalFiler === 'friends';
        const EMPTY_LIST_RULE = !playerItems.length && !top3cols.length && additionalFiler === 'followers';

        if (RULE && friendsCount < 1) {
            return (
                <InviteFriend fromLeaderboard={true}/>
            );
        } else if (EMPTY_LIST_RULE) {
            return (
                <div className="screen-content">
                    <div className="emptyContent">
                        <h3>No ranked Friends</h3>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="screen-content">
                    <div className="leaderboard">
                        <div>
                            <div className="leaderboard-title">
                                <h2>Top players</h2>
                                <p>Overall</p>
                            </div>
                            <div className="top3cols">
                                { top3cols }
                            </div>
                        </div>

                    </div>

                    {middleBlock()}
                    {additionalUserBlock()}
                </div>
            );
        }
    }

}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        auth: state.auth,
        currentUserStatus: state.leaderboard.userAnswers,
        friends: state.friends,
        friendsCount: state.profile.friendsCount
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestAuth: () => dispatch(requestAuth()),
        findCurrentUser: (id) => dispatch(findCurrentUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
