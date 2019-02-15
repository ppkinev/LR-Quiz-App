import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';
import Location from '../../lib/Location';
import Tabs from '../Tabs';
import ScreenSwiper from '../ScreenSwiper';
import {Fetching} from '../Layout';
import FilterTabs from '../FilterTabs';
import LeaderBoard from '../LeaderBoard';

import {getInviteLink} from '../../flux/actions';

import './LeaderBoard.scss';


const tabs = [
    {
        tabId: 'alltime',
        label: 'All Time',
    },
    {
        tabId: 'thismonth',
        label: 'This Month',
    },
    {
        tabId: 'lastmonth',
        label: 'Last Month',
    }
];

const filterTabs = [
    {
        filterTabId: 'allusers',
        title: 'Overall',
        ico: '',
        activeIco: ''
    },
    {
        filterTabId: 'friends',
        title: 'Friends',
        ico: '',
        activeIco: ''
    },
    {
        filterTabId: 'followers',
        title: 'Followers',
        ico: '',
        activeIco: ''
    }
];

class LeaderBoardContainer extends Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        friendsCount: PropTypes.number,

        getInviteLink: PropTypes.func
    };

    state = {
        currentScreenIdx: 0,
        currentFilterIdx: 0
    };

    componentDidMount() {
        const {params: {filtertype, timeperiod}, userId} = this.props;

        const tabObj = tabs.find((t) => t.tabId === timeperiod);
        const filterTabObj = filterTabs.find((t) => t.filterTabId === filtertype);

        const currentScreenIdx = tabs.indexOf(tabObj);
        const currentFilterIdx = filterTabs.indexOf(filterTabObj);

        const STORAGE = JSON.parse(localStorage.getItem('notifications'));
        if (STORAGE && STORAGE[userId]) {
            STORAGE[userId].hideLeaderboard = true;
            localStorage.setItem('notifications', JSON.stringify(STORAGE));
        }

        this.setState({currentScreenIdx, currentFilterIdx});
    }

    nextScreen() {
    }

    prevScreen() {
    }

    selectScreen(tabId) {
        const tab = tabs.find((t) => t.tabId === tabId);
        const currentScreenIdx = tabs.indexOf(tab);
        const {currentFilterIdx} = this.state;

        this.setState({currentScreenIdx});

        const timeperiod = tabs[currentScreenIdx].tabId;
        const filtertype = filterTabs[currentFilterIdx].filterTabId;

        Location.push({
            pathname: './leaderboard',
            query: {
                timeperiod,
                filtertype
            }
        });
        this.props.fetchLeaderboard(timeperiod, filtertype);
    }

    getInviteLink(filterTabId){
        const {friendsCount, getInviteLink} = this.props;

        if (filterTabId === 'friends' && friendsCount < 1) {
            if (getInviteLink) getInviteLink();
        }
    }

    tabFilter(filterTabId) {
        const tab = filterTabs.find((t) => t.filterTabId === filterTabId);
        const currentFilterIdx = filterTabs.indexOf(tab);
        const {currentScreenIdx} = this.state;

        this.setState({currentFilterIdx});

        const timeperiod = tabs[currentScreenIdx].tabId;
        const filtertype = filterTabs[currentFilterIdx].filterTabId;

        Location.push({
            pathname: './leaderboard',
            query: {
                timeperiod,
                filtertype
            }
        });

        this.getInviteLink(filterTabId);

        this.props.fetchLeaderboard(timeperiod, filtertype);
    }

    render() {
        const {list, isFetching, isLoggedIn} = this.props;

        const sortByRank = list.sort((a, b) => a.Rank - b.Rank);
        const top3 = sortByRank.slice(0, 3);
        const filterList = sortByRank.filter(el => top3.indexOf(el) === -1);

        const {currentScreenIdx: idx, currentFilterIdx: filterIdx} = this.state;
        const {tabId} = tabs[idx] || {};
        const {filterTabId} = filterTabs[filterIdx] || {};

        const onPrev = () => this.prevScreen();
        const onNext = () => this.nextScreen();
        const onSelectTab = (tabId) => this.selectScreen(tabId);
        const screens = tabs.map((tab, i) => <LeaderBoard key={`screen-${i}`} top3={ top3 } users={ filterList }/>);


        if (isFetching) {
            return (
                <div className='screen'>
                    <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onSelectTab } theme='white'/>

                    <div className='fetching-section'>
                        <Fetching />
                    </div>


                    <FilterTabs tabs={ filterTabs } selectTab={ this.tabFilter.bind(this) }
                                selectedItemId={ filterTabId }/>
                </div>
            );
        }
        return (
            <div className='screen'>
                <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onSelectTab } theme='white'/>

                <ScreenSwiper currentScreenIdx={idx} onPrevScreen={onPrev} onNextScreen={onNext}>
                    { screens }
                </ScreenSwiper>

                <FilterTabs isLoggedIn={isLoggedIn} tabs={ filterTabs } selectTab={ this.tabFilter.bind(this) }
                            selectedItemId={ filterTabId }/>
            </div>
        );
    }
}

// Connect to store
//
const mapStateToProps = (state) => {
    return {
        userId: state.profile.userId,
        isLoggedIn: state.auth.isLoggedIn,
        friendsCount: state.profile.friendsCount
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getInviteLink: () => dispatch(getInviteLink()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoardContainer);
