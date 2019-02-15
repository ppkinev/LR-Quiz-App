import React, {Component, PropTypes} from 'react';
import Tabs from '../Tabs';

import './OfferWallContainer.scss';

class OfferWallContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offerwalls: [],
            tabs: [],
            currentScreenIdx: 0
        };
    }

    componentWillMount() {
        const {userId, offerwalls} = this.props;

        this.setState({
            ...this.state,
            offerwalls: offerwalls.map((offerwall) => {
                return {
                    ...offerwall,
                    url: offerwall.url.replace(/\[UID]/g, userId),
                    id: offerwall.name.toLowerCase().replace(/\s*/g, '')
                }
            }),
            tabs: offerwalls.map((offerwall) => {
                return {
                    tabId: offerwall.name.toLowerCase().replace(/\s*/g, ''),
                    label: offerwall.name
                }
            })
        });
    }

    selectScreen(tabId) {
        const {tabs} = this.state;
        const tab = tabs.find((t) => t.tabId === tabId);
        this.setState({
            ...this.state,
            currentScreenIdx: tabs.indexOf(tab)
        });
    }

    render() {
        const {currentScreenIdx: idx, tabs, offerwalls} = this.state;

        if (!offerwalls || !offerwalls.length) {
            return (
                <div>Loading...</div>
            );
        }

        const {tabId} = tabs[idx];
        const {url} = offerwalls[idx];

        const onTabSelect = (tabId) => this.selectScreen(tabId);


        return (
            <div className="offerwalls-holder">
                <Tabs items={ tabs } selectedItemId={ tabId } onSelect={ onTabSelect }/>
                <iframe className="offerwalls-iframe" src={ url }/>
            </div>
        );
    }
}

export default OfferWallContainer;
