import React, {Component, PropTypes} from 'react';

class Tab extends Component {
    render() {
        const {isActive, tabClick, title, usersAmount} = this.props;
        const onClick = usersAmount ? tabClick : null;

        return (
            <div className={"participant-tab" + (isActive ? ' active' : '')}
                 onClick={onClick}>
                { title } <span className="subtitle">{ usersAmount }</span>
            </div>
        );
    }
}

class QuizSummaryParticipantsTabs extends Component {
    componentWillMount() {
        const {activeTab} = this.props;
        this.state = {selectedTabId: activeTab};
    }

    isActive(id) {
        return this.state.selectedTabId === id;
    }

    tabClick(params) {
        const {id, event} = params;
        this.setState({...this.state, selectedTabId: id});
        if (event) event();
    }

    getTabs() {
        const {isEnded, showAll, showWinners, showLosers, allParticipants} = this.props;
        const tabs = [{id: 'winners', title: 'Won'}, {id: 'losers', title: 'Lost'}];
        if (!isEnded) {
            return [(<div key="tab-3" className="participant-tab active">Participants <span
                className="subtitle">{ allParticipants.all.length }</span></div>)]
        } else {
            return tabs.map((tab, i) => {
                const click = tab.id === 'winners' ? showWinners : showLosers;
                const usersAmount = tab.id === 'winners' ? allParticipants.winners.length : allParticipants.losers.length;
                return (
                    <Tab
                        key={ 'tab-' + i }
                        isActive={ this.isActive(tab.id) }
                        title={ tab.title }
                        tabClick={ this.tabClick.bind(this, {id: tab.id, event: click}) }
                        usersAmount={ usersAmount }
                    />
                )
            });
        }
    }

    render() {
        const tabs = this.getTabs();

        return (
            <div className="participants-tabs">

                { tabs }

            </div>
        );
    }
}

export default QuizSummaryParticipantsTabs;
