import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {SharingPopup} from '../PopupAdditional/';

import MainBlock from './MainBlock'
import {
    inviteFriends,
    inviteSocialFriendsFacebook,
    inviteSocialFriendsTwitter,
    getInviteLink,
    hideSocial,
    showSocialBlock
} from '../../flux/actions';

import './invite-friend.scss';


const TextBlock = () => {
    return (
        <div className="invite-text-block">
            <h2>Invite new friends</h2>
            <span>and get <span className="green-circle"> +50 points </span> for each friend</span>
        </div>
    )
};

const ModalWindow = (showModal) => {
    return (
        <div id="invite-status" className={showModal ? 'status' : 'status-hide'}>
            You successfully send the invite via email.
        </div>
    )
};

const SocialModalWindow = () => {
    return (
        <div className="social-message">
            Well done! As soon as your friend join us you will get +50 points
        </div>
    )
};

export const Fetching = () => {
    return (
        <div className="fetching">
            <div className="loader"></div>
        </div>
    );
};


class InviteFriend extends Component {

    componentWillMount() {
        const {getInviteLink, link} = this.props;
        if (!link) getInviteLink();
    }

    inviteViaEmail(email) {
        const {inviteFriends, showSocialBlock} = this.props;
        showSocialBlock();
        inviteFriends(email);
    }

    async socialInvite() {
        const {inviteSocialFriends, link} = this.props;
        await inviteSocialFriends(link);
    }

    twitterInvite() {
        const {inviteSocialFriendsTwitter, link} = this.props;
        inviteSocialFriendsTwitter(link);
    }

    componentWillReceiveProps(nextProps) {
        const {hideSocial} = this.props;
        if (nextProps.showSocial) {
            setTimeout(() => {
                hideSocial();
            }, 2000)
        }
    }


    render() {

        const {fetching, showModal, showSocial, fromLeaderboard} = this.props;

        if (!fetching) {
            return (
                <div id="invite-friend" className={ "invite-friend" + (fromLeaderboard ? ' leaderboardScrollFix' : '')}>
                    <SharingPopup inviteRequest={true} showInviteRequest={showSocial}/>
                    {TextBlock()}
                    <MainBlock
                        invite={(email) => {
                            this.inviteViaEmail(email)
                        }}
                        inviteSocialFriends={() => {
                            this.socialInvite()
                        }}
                        inviteTwitter={() => {
                            this.twitterInvite()
                        }}
                    />
                </div>
            )
        } else {
            return (
                <Fetching />
            )
        }
    }
}


// Connect to store
//
const mapDispatchToProps = (dispatch) => {
    return {
        inviteFriends: (email) => dispatch(inviteFriends(email)),
        inviteSocialFriends: (link) => dispatch(inviteSocialFriendsFacebook(link)),
        inviteSocialFriendsTwitter: (link) => dispatch(inviteSocialFriendsTwitter(link)),
        getInviteLink: () => dispatch(getInviteLink()),
        hideSocial: () => dispatch(hideSocial()),
        showSocialBlock: () => dispatch(showSocialBlock())
    };
};

const mapStateToProps = (state) => {
    return {
        fetching: state.inviteFriends.isFetching,
        showModal: state.inviteFriends.showModal,
        link: state.inviteFriends.link,
        showSocial: state.inviteFriends.showSocial
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriend);
