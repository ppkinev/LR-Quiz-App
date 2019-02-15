import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Location from '../lib/Location.js';
import {
    fetchFriendProfile,
    fetchUserBadges,
    fetchActivity,
    fetchUserActivity,
    sendFriendRequest,
    follow,
    unfollow
} from '../flux/actions';
import {Fetching} from '../components/Layout';
import UserProfile from '../components/UserProfile';

const normalizeUserObj = user => {
    let userId, name, imageUrl, points, relationships = [];
    if (!user.User) {
        userId = user['UserId'];
        name = user['UserName'];
        imageUrl = user['ImageUrl'];
        relationships = user['Relationships'] && user['Relationships']['Rels']
            ? user['Relationships']['Rels']
            : [];
        points = user['TotalPointsEarned'];
    } else {
        userId = user['User']['UserId'];
        name = user['User']['UserName'];
        imageUrl = user['User']['ImageUrl'];
        relationships = user['Rels'] ? user['Rels'] : [];
    }

    return {
        userId,
        name,
        imageUrl,
        points,
        relationships,
    }
};

class User extends Component {

    static propTypes = {
        // from store
        profile: PropTypes.object.isRequired,
        fetchProfile: PropTypes.func.isRequired,
    };

    static contextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    componentWillMount(){
        const {params: {userId}, currentUserId} = this.props;
        if (userId === currentUserId) Location.push({pathname: './profile'});
    }

    async componentDidMount() {

        const {params: {userId}, fetchProfile, fetchUserBadges, fetchActivity, fetchUserActivity} = this.props;


        await fetchProfile(userId);
        await fetchUserBadges();

        if (userId) {
            fetchUserActivity(userId);
        } else {
            fetchActivity();
        }

        const name = this.props.profile.user.UserName;
        if (location.pathname === '/user') {
            this.updateHeader(name);
        }
    }

    updateHeader(name) {
        this.context.updateHeader({
            hasBack: true,
            title: name
        });
    }

    async componentWillReceiveProps(nextProps) {
        const {params: {userId}, fetchProfile, currentUserId} = this.props;
        if (nextProps.params.userId !== userId) {
            await fetchProfile(nextProps.params.userId);
            if (location.pathname === '/user') {
                this.updateHeader(this.props.profile.user.UserName);
            }
        }
    }


    render() {
        const {profile: {isFetching, user}, params: {userId}, badges, activity, sendFriendRequest, follow, unfollow} = this.props;
        let userProfile = {};


        if (Object.keys(user).length) {
            userProfile = normalizeUserObj(user);
        }

        if (isFetching) {
            return <Fetching />;
        }

        return <UserProfile user={userProfile}
                            userId={userId}
                            badges={badges}
                            userBadges={true}
                            activity={activity}
                            sendFriendRequest={sendFriendRequest}
                            follow={follow}
                            unfollow={unfollow}/>;
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        currentUserId: state.profile.userId,
        profile: state.user,
        badges: state.badges,
        activity: state.activity,
        auth: state.auth
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchProfile: (userId) => dispatch(fetchFriendProfile(userId)),
        fetchUserBadges: () => dispatch(fetchUserBadges()),
        fetchActivity: () => dispatch(fetchActivity()),
        sendFriendRequest: (userId) => dispatch(sendFriendRequest(userId)),
        follow: (userId) => dispatch(follow(userId)),
        unfollow: (userId) => dispatch(unfollow(userId)),
        fetchUserActivity: (userId) => dispatch(fetchUserActivity(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
