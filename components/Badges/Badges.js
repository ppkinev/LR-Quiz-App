import React, {Component, PropTypes} from 'react';
import {Fetching} from '../Layout';
import BadgesItem from './BadgesItem';
import BadgePopup from './BadgesPopup';
import './Badges.scss';

const RECENT_BADGES_COUNT = 2;

export default class BadgesList extends Component {

    state = {
        badgePopupIsOpen: false,
        badgePopupContent: {
            title: '',
            desc: '',
            image: ''
        }
    };

    static contextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (location.pathname === '/badges') {
            this.context.updateHeader({
                hasBack: true
            });
        }
    }

    recentBadges(badges) {
        const {badgePopupIsOpen, badgePopupContent} = this.state;

        if (this.props.userBadges) {
            return (
                <div>
                    <BadgePopup isOpen={badgePopupIsOpen} content={badgePopupContent}
                                toggleBadgePopup={this.toggleBadgePopup.bind(this)}/>
                    <ul className="badges-section-list">
                        {
                            badges.earned.map((badge, i) => <BadgesItem noClick={true}
                                                                        toggleBadgePopup={this.toggleBadgePopup.bind(this)}
                                                                        key={badge.BadgeId} badge={badge}/>)
                        }
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <BadgePopup isOpen={badgePopupIsOpen} content={badgePopupContent}
                            toggleBadgePopup={this.toggleBadgePopup.bind(this)}/>
                <ul className="badges-section-list">
                    {
                        badges.earned.map((badge, i) => RECENT_BADGES_COUNT >= i ?
                            <BadgesItem noClick={true} toggleBadgePopup={this.toggleBadgePopup.bind(this)}
                                        key={badge.BadgeId} badge={badge}/> : null)
                    }
                </ul>
            </div>
        );
    }

    earnedBadges(badges, count) {
        const {earned} = badges;
        const earnedCount = earned.length;
        const {badgePopupIsOpen} = this.state;

        return (
            <div className="badges-panel">
                <div className='badges-section-header'>
                    {`My Badges (${earnedCount} of ${count})`}
                </div>
                <ul className="badges-section-list earned">
                    {
                        earned.map((badge, i) => <BadgesItem key={badge.BadgeId} badge={badge}
                                                             toggleBadgePopup={this.toggleBadgePopup.bind(this)}/>)
                    }
                </ul>
            </div>
        );
    }

    missingBadges(badges, count) {
        const {missing} = badges;
        const missingCount = missing.length;
        const {badgePopupIsOpen} = this.state;

        if (this.props.userBadges) return null;

        return (
            <div className="badges-panel">
                <div className='badges-section-header'>
                    {`Missing Badges (${missingCount} of ${count})`}
                </div>
                <ul className="badges-section-list missing">
                    {
                        missing.map((badge, i) => <BadgesItem key={badge.BadgeId} badge={badge}
                                                              toggleBadgePopup={this.toggleBadgePopup.bind(this)}/>)
                    }
                </ul>
            </div>
        );
    }

    allBadges(badges) {
        const count = badges.earned.length + badges.missing.length;
        const {badgePopupIsOpen, badgePopupContent} = this.state;

        return (
            <div className="badges-full-list">
                <BadgePopup isOpen={badgePopupIsOpen} content={badgePopupContent}
                            toggleBadgePopup={this.toggleBadgePopup.bind(this)}/>
                { this.earnedBadges(badges, count) }
                { this.missingBadges(badges, count) }
            </div>
        );
    }

    toggleBadgePopup(title, desc, image) {
        const {badgePopupIsOpen} = this.state;

        if (!badgePopupIsOpen) {
            this.setState({
                badgePopupIsOpen: true,
                badgePopupContent: {
                    title,
                    desc,
                    image
                }
            });
        } else {
            this.setState({badgePopupIsOpen: false});
        }


    }

    render() {
        const {badges, recent} = this.props;

        //
        //if (badges.isFetching) {
        //  return <Fetching/>;
        //}

        return recent ? this.recentBadges(badges) : this.allBadges(badges);
    }
}
