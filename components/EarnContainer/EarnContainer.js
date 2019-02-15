import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    requestAuth,
    startEarnSharingTwitter,
    startEarnSharingFacebook,
    postTrackOffer,
    postCompleteOffer,
    postCancelOffer,
    openVideoPopup,
    openSurveyPopup,
    closeSurveyPopup,
    closeVideoPopup,
    closeInvite
} from '../../flux/actions';
import ScreenSwiper from '../ScreenSwiper';
import Tabs from '../Tabs';
import VideoPopup from '../VideoPopup/VideoPopup';
import './EarnContainer.scss';

import Notification from '../LeaderBoardNotification/LeaderBoardNotification';
import NotificationError from '../NotificationError/NotificationError';
import RecentPlayers from  '../RecentPlayers/RecentPlayers';
import SurveyPopup from  '../SurveyPopup/SurveyPopup';

import Link from '../Link';

const TYPE_WATCH_VIDEO = /WatchVideo/;
const TYPE_TWITTER_SHARE = /TwitterShare/;
const TYPE_FACEBOOK_SHARE = /FacebookShare/;
const TYPE_AFFILIATE = /Affiliate/;
const TYPE_SURVEY = /Survey/;

const Screen = ({list, onClickItem}) => {

    const earnItems = list.map((earn, i) => {
        const {earnId, subType, title, description, imageUrl, earnPoints, customData, completersCount, recentCompleters, groupIcon} = earn;
        const pointsLabelText = <div className="label-earn">+{earnPoints}<br/>point{ earnPoints > 1 ? 's' : ''}</div>;

        const recentPlayers = <RecentPlayers total={completersCount} recent={recentCompleters} ending={'did this'}/>;

        const onClick = () => onClickItem(earnId, subType, customData);

        return (
            <li key={`earn-${i}`} className="earn-list-item" onClick={ onClick }>
                <div className="earn-item-aside">
                    <div className="earn-item-image">
                        <img className="earn-logo" src={ imageUrl }/>
                    </div>
                    { pointsLabelText }
                </div>
                <div className="earn-details">
                    <div className="earn-details-text">
                        <div className="list-title">
                            <img src={ groupIcon } className="earn-group-icon"/>
                            { title }
                        </div>
                        <div className="list-meta">{ description }</div>
                    </div>
                    <div className="offer-content-footer">
                        <div className="list-label green">Go to the offer</div>
                        { recentPlayers }
                    </div>
                </div>
                <div className="list-item-arrow">
                    <img src={ require('../../static/images/arrow-right-grey.png') }/>
                </div>
            </li>
        );
    });

    return (
        <div className="screen-content">
            <ul className="earn-list">
                {earnItems}
            </ul>
        </div>
    );


};


class EarnContainer extends Component {

    static propTypes = {
        earnList: PropTypes.array.isRequired,
        // from store
        isLoggedIn: PropTypes.bool.isRequired,
        openAuthPopup: PropTypes.func.isRequired,
        startEarnSharingTwitter: PropTypes.func.isRequired,
        startEarnSharingFacebook: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.hideErrorMessage = this.hideErrorMessage.bind(this);

        this.state = {
            currentScreenIdx: 0,
            earnError: null
        };
    }

    setUrlParams({earnId, url}){
        const {profile: {userId, name}} = this.props;

        return url
        .replace(/\[UID]/g, userId)
        .replace(/\[OID]/g, earnId)
        .replace(/\[TID]/g, userId)
        .replace(/\[UNAME]/g, name);
    }

    nextScreen() {
        const {currentScreenIdx: idx} = this.state;
        const {earnCategories: tabs = []} = this.props;
        const totalSteps = tabs.length;
        if (idx + 1 < totalSteps) {
            this.setState({
                currentScreenIdx: idx + 1
            })
        }
    }

    prevScreen() {
        const {currentScreenIdx: idx} = this.state;
        if (idx > 0) {
            this.setState({
                currentScreenIdx: idx - 1
            });
        }
    }

    selectScreen(tabId) {
        const {earnCategories: tabs = []} = this.props;
        const tab = tabs.find((t) => t.tabId === tabId);
        this.setState({
            currentScreenIdx: tabs.indexOf(tab)
        });
    }

    openVideoPopup(earnId, videoUrl) {
        this.props.openVideoPopup(earnId, videoUrl);
    }

    affiliateSignup(earnId, url) {
        this.props.postTrackOffer(earnId);
        window.open(url, '_blank');
    }

    openSurveyPopup(earnId, url) {
        this.props.postTrackOffer(earnId).then(() => this.props.openSurveyPopup(earnId, url));
    }

    handleClickItem(earnId, subType, customData) {
        const {isLoggedIn, openAuthPopup, startEarnSharingTwitter, startEarnSharingFacebook} = this.props;

        if (!isLoggedIn) {
            return openAuthPopup();
        }

        if (TYPE_TWITTER_SHARE.test(subType)) {
            return startEarnSharingTwitter(earnId, customData);
        }
        if (TYPE_FACEBOOK_SHARE.test(subType)) {
            return startEarnSharingFacebook(earnId, customData);
        }
        if (TYPE_WATCH_VIDEO.test(subType)) {
            return this.openVideoPopup(earnId, this.setUrlParams({url: customData.Url, earnId}));
        }
        if (TYPE_AFFILIATE.test(subType)) {
            return this.affiliateSignup(earnId, this.setUrlParams({url: customData.Url, earnId}));
        }
        if (TYPE_SURVEY.test(subType)) {
            return this.openSurveyPopup(earnId, this.setUrlParams({url: customData.Url, earnId}));
        }
    }

    renderSurveyPopup() {
        const {surveyPopup, closeSurveyPopup} = this.props;
        return <SurveyPopup survey={surveyPopup} close={closeSurveyPopup} />
    }

    showErrorMessage(text) {
        this.setState({
            earnError: text
        });
    }

    hideErrorMessage() {
        this.setState({
            earnError: null
        });
    }

    render() {
        const {
            earnList, earnCategories: tabs = [], videoPopup, postTrackOffer, postCompleteOffer, postCancelOffer,
            openVideoPopup, closeVideoPopup, closeInvite, showInvite, isLoggedIn
        } = this.props;
        const {currentScreenIdx: idx, earnError} = this.state;
        const {tabId} = tabs[idx] || {};
        const onPrev = () => this.prevScreen();
        const onNext = () => this.nextScreen();
        const onTabSelect = (tabId) => this.selectScreen(tabId);
        const onClickItem = this.handleClickItem.bind(this);
        const trackActions = {postTrackOffer, postCompleteOffer, postCancelOffer};
        const videoPopupActions = {openVideoPopup, closeVideoPopup};

        const surveyPopup = this.renderSurveyPopup();

        const videoPopupElem = videoPopup.isOpen ?
            <VideoPopup showErrorMessage={this.showErrorMessage} popup={videoPopup} trackActions={trackActions}
                        videoPopupActions={videoPopupActions}/> : null;


        const screens = tabs
        .map((tab, i) => {
            let earnItems = (tab.tabId !== 'all') ? earnList.filter(offer => offer.type === tab.label) : earnList;

            if (tab.tabId !== 'all' && earnItems.length < 1) {
                return (
                    <div className="no_suggestions">
                        <span>There are no suggestions at the moment. Please, check this page later.</span>
                    </div>
                );
            } else {
                return (
                    <Screen key={`screen-${i}`} list={ earnItems } onClickItem={ onClickItem }/>
                );
            }
        });

        const errorPopup = earnError ? <NotificationError text={earnError} reset={this.hideErrorMessage}/> : null;

        return (
            <div className="screen">
                { videoPopupElem }
                { surveyPopup }
                <Notification type='leaderboard'/>
                <Notification type='top3'/>
                {window.config.skin !== 'mbet' && <Notification type='invite-friend'/>}
                <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onTabSelect }/>
                <ScreenSwiper showInvite={showInvite} isLoggedIn={isLoggedIn} currentScreenIdx={idx}
                              onPrevScreen={onPrev} onNextScreen={onNext}>
                    { screens }
                </ScreenSwiper>

                { errorPopup }
            </div>
        );
    }
}


// Connect to store
//
const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        videoPopup: state.videoPopup,
        surveyPopup: state.surveyPopup,
        showInvite: state.earns.showInvite,
        profile: state.profile
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        openAuthPopup: () => dispatch(requestAuth()),
        startEarnSharingTwitter: (earnId, customData) => dispatch(startEarnSharingTwitter(earnId, customData)),
        startEarnSharingFacebook: (earnId, customData) => dispatch(startEarnSharingFacebook(earnId, customData)),
        openSurveyPopup: (earnId, url) => dispatch(openSurveyPopup(earnId, url)),
        closeSurveyPopup: () => dispatch(closeSurveyPopup()),
        openVideoPopup: (earnId, videoUrl) => dispatch(openVideoPopup(earnId, videoUrl)),
        closeVideoPopup: () => dispatch(closeVideoPopup()),
        postTrackOffer: (earnId) => dispatch(postTrackOffer(earnId)),
        postCompleteOffer: (earnId) => dispatch(postCompleteOffer(earnId)),
        closeInvite: () => dispatch(closeInvite())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EarnContainer);
