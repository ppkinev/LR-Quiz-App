import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {Fetching} from '../Layout';
import ScreenSwiper from '../ScreenSwiper';
import Tabs from '../Tabs';
import FixtureListItem from './FixtureListItem.js';

import './FixtureList.scss';

import Notification from '../LeaderBoardNotification/LeaderBoardNotification'

function sortFixturesByDate(a, b) {
    return new Date(b.startDate) - new Date(a.startDate);
}

class Screen extends Component {

    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
    }

    checkIfLoadNeeded(elem) {
        const threshold = elem.getBoundingClientRect().height + 30;
        const scrollTop = elem.scrollTop;
        const scrollHeight = elem.scrollHeight;

        const {updateFixtures} = this.props;

        if (scrollHeight - scrollTop - threshold < 0) {
            updateFixtures();
        }
    }

    onScroll(ev) {
        this.checkIfLoadNeeded(ev.target);
    }

    render() {
        const {ind, list, isLoggedIn, showParticipants, showParticipantsReset} = this.props;

        const items = list
        .sort(sortFixturesByDate)
        .map((match) => {
            const {startDate} = match;
            const header = moment(startDate).format('D MMMM').toUpperCase();
            return {...match, header};
        })
        .map((match, i, array) => {
            const {header, ...others} = match;
            const {header: prevHeader} = array[i - 1] || {};
            const showHeader = !prevHeader || prevHeader !== header;
            const headerMaybe = showHeader ? header : null;

            return (
                <FixtureListItem
                    key={'fixture-' + ind + i}
                    header={ headerMaybe }
                    fixtureItem={ others }
                    isLoggedIn={ isLoggedIn }
                    index={i}
                    showParticipants={ showParticipants }
                    showParticipantsReset={ showParticipantsReset }
                />
            );
        });

        const onScroll = this.onScroll;

        return (
            <div className='screen-content' onScroll={ onScroll }>
                <ul className='fixture-list'>
                    { items }
                </ul>
            </div>
        );
    }
}

class FixtureList extends Component {

    constructor(props) {
        super(props);

        this.updateFixtures = this.updateFixtures.bind(this);
    }

    state = {
        currentScreenIdx: 0,
        fixturesUpdating: false
    };

    static propTypes = {
        list: PropTypes.array.isRequired
    };

    nextScreen() {
        const {currentScreenIdx: idx} = this.state;
        const tabs = this.generateTabs();
        const totalSteps = tabs.length;
        if (idx + 1 < totalSteps) {
            this.setState({
                currentScreenIdx: idx + 1
            });
            const {currentScreenIdx} = this.state;
            this.props.fetchFixtures({id: tabs[currentScreenIdx].tabId});
        }
    }

    prevScreen() {
        const {currentScreenIdx: idx} = this.state;
        const tabs = this.generateTabs();
        const totalSteps = tabs.length;
        if (idx > 0) {
            this.setState({
                currentScreenIdx: idx - 1
            });
            const {currentScreenIdx} = this.state;
            this.props.fetchFixtures({id: tabs[currentScreenIdx].tabId});
        }
    }

    selectScreen(tabs, tabId) {
        const tab = tabs.find((t) => t.tabId === tabId);
        this.setState({
            currentScreenIdx: tabs.indexOf(tab)
        });
        this.props.fetchFixtures({id: tabId});
    }

    generateTabs() {
        return this.props.tournaments.map(tournament => {
            return {
                tabId: tournament.TournamentId,
                label: tournament.Name
            };
        });
    }

    updateFixtures() {
        const {updateFixtures, isFetching, list, tournaments} = this.props;
        const skipCount = list.length;
        const id = tournaments[this.state.currentScreenIdx].TournamentId;
        if (!isFetching) {
            updateFixtures({id, skip: skipCount});
            this.setState({fixturesUpdating: true});
        }
    }

    render() {
        const {list, tournaments, isFetching, isLoggedIn, showParticipants, showParticipantsReset} = this.props;
        const fixturesUpdating = this.state.fixturesUpdating;

        if (tournaments.length === 0) return null;

        let tabs = this.generateTabs();

        //Hide all championships, extends 2016-2016 Premier League.To abort - remove filter

        tabs = tabs.filter((t) => {
            return t.label === '2018–19 Premier League'
        });

        const {currentScreenIdx: idx} = this.state;
        const {tabId} = tabs[idx];
        const onPrev = (tabs, tabId) => this.prevScreen(tabs, tabId);
        const onNext = (tabs, tabId) => this.nextScreen(tabs, tabId);
        const onTabSelect = (tabId) => this.selectScreen(tabs, tabId);

        const screens = tabs.map((tab, i) =>
            <Screen
                key={`screen-${i}`}
                ind={i}
                list={ list }
                isFetching={ isFetching }
                isLoggedIn={ isLoggedIn }
                showParticipants={showParticipants}
                showParticipantsReset={showParticipantsReset}
                updateFixtures={ this.updateFixtures }
            />
        );

        if (tournaments.length) {
            if (isFetching && !fixturesUpdating) {
                return (
                    <div>
                        <Tabs items={tabs} selectedItemId={tabId} onSelect={onTabSelect} isLongTabs={true}/>

                        <div className='fetching-section'>
                            <Fetching />
                        </div>
                    </div>
                );
            }
            if (list.length === 0) {
                return (
                    <div>
                        <Tabs items={tabs} selectedItemId={tabId} onSelect={onTabSelect} isLongTabs={true}/>
                        <div className='text-regular text-center'>No matches</div>
                    </div>
                );
            }
        }

        return (
            <div className='screen' id='fixturesHolder'>
                <Notification type='leaderboard'/>
                <Notification type='top3'/>
                <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onTabSelect } isLongTabs={ true }/>
                <ScreenSwiper currentScreenIdx={idx} onPrevScreen={onPrev} onNextScreen={onNext}>
                    { screens }
                </ScreenSwiper>

                { (fixturesUpdating && isFetching) && <Fetching isOnTop/> }
            </div>
        );
    }

}

export default FixtureList;
