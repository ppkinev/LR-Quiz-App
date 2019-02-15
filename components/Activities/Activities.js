import React, {Component, PropTypes} from 'react';
import {Fetching} from '../Layout';
import ActivitiesItem from './ActivitiesItem';
import ScreenSwiper from '../ScreenSwiper';
import Tabs from '../Tabs';
import './Activities.scss';

const RECENT_ACTIVITY_COUNT = 3;

const tabs = [
    {
        tabId: 'all',
        label: 'General'
    },
    {
        tabId: 'my',
        label: 'Only me'
    }
];

const Screen = ({list, userProfileImage, userId}) => {
    const items = list.map((activity) => {
        return <ActivitiesItem key={activity.Id} activity={activity} userProfileImage={userProfileImage}
                               userId={userId}/>;
    });

    return (
        <div className="screen-content">
            <ul className="activity-section-list">
                { items }
            </ul>
        </div>
    );
};

export default class ActivitiesList extends Component {

    static contextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    state = {
        currentScreenIdx: 0
    };

    selectScreen(tabs, tabId) {
        const tab = tabs.find((t) => t.tabId === tabId);
        this.setState({
            currentScreenIdx: tabs.indexOf(tab)
        });
    }

    nextScreen() {
        const {currentScreenIdx: idx} = this.state;
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

    componentDidMount() {
        if (location.pathname === '/activities') {
            this.context.updateHeader({
                hasBack: true
            });
        }
    }

    renderWithoutTabs(activities) {
        return (
            <ul className="activity-section-list">
                {
                    activities.allActivities.map((activity, i) => {
                        return <ActivitiesItem key={activity.Id} activity={activity}
                                               userProfileImage={userProfileImage}/>;
                    })
                }
            </ul>
        );
    }

    render() {
        const {activities, userProfileImage, recent, userId, profileClassForStyle} = this.props;


        //if (activities.isFetching) {
        //	return <Fetching />;
        //}

        const listClass = 'activity-section-list' + (profileClassForStyle ? ' from-profile' : '');

        if (!activities.allActivities) {
            if (recent) {
                return (
                    <ul className={ listClass }>
                        {
                            activities.userActivities.map((activity, i) => {
                                return RECENT_ACTIVITY_COUNT >= i ?
                                    <ActivitiesItem key={activity.Id} activity={activity}
                                                    userProfileImage={userProfileImage}/> : null;
                            })
                        }
                    </ul>
                );
            } else {
                return (
                    <ul className={ listClass }>
                        {
                            activities.userActivities.map((activity, i) => {
                                return <ActivitiesItem key={activity.Id} activity={activity}
                                                       userProfileImage={userProfileImage}/>;
                            })
                        }
                    </ul>
                );
            }
        }

        const {currentScreenIdx: idx} = this.state;
        const {tabId} = tabs[idx];
        const onTabSelect = (tabId) => this.selectScreen(tabs, tabId);


        const screens = tabs.map((tab, i) => {
            const list = (tab.tabId !== 'all') ? activities.userActivities : activities.allActivities;
            return (
                <Screen key={`screen-${i}`} list={list} userId={userId} userProfileImage={userProfileImage}/>
            );
        });

        if (recent) {
            if (activities.userActivities.length) {
                return (
                    <ul className={ listClass }>
                        {
                            activities.userActivities.map((activity, i) => {
                                return RECENT_ACTIVITY_COUNT >= i ?
                                    <ActivitiesItem key={activity.Id} activity={activity}
                                                    userProfileImage={userProfileImage}/> : null;
                            })
                        }
                    </ul>
                );
            } else {
                return (
                    <ul className={ listClass }>
                        {
                            activities.allActivities.map((activity, i) => {
                                return RECENT_ACTIVITY_COUNT >= i ?
                                    <ActivitiesItem key={activity.Id} activity={activity}
                                                    userProfileImage={userProfileImage}/> : null;
                            })
                        }
                    </ul>
                );
            }
        }

        return (
            <div className="screen">
                <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onTabSelect }/>

                <ScreenSwiper currentScreenIdx={idx}>
                    { screens }
                </ScreenSwiper>
            </div>
        );
    }
}
