import React, {Component, PropTypes} from 'react';
import QuizSummaryParticipantItem from './QuizSummaryParticipantItem.js';
import QuizSummaryParticipantsTabs from './QuizSummaryParticipantsTabs.js';

import './QuizSummaryParticipants.scss';

class QuizSummaryParticipants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: 'all',
            fetchingState: true
        };
    }

    componentDidMount() {
        const {showParticipants, scrollToParticipants} = this.props;
        const {isEnded, participants: {winners}} = this.props;
        const participants = isEnded ? (winners.length > 0 ? 'winners' : 'losers') : 'all';
        this.setState({...this.state, participants, fetchingState: false});

        if (showParticipants) {
            scrollToParticipants(this);
        }
    }

    ifSameUser(rels) {
        const {currentUserId} = this.props;
        if (rels && rels['User'] && rels['User']['UserId']) {
            return rels['User']['UserId'] === currentUserId;
        }
        return false;
    }

    getAll() {
        const {participants: {all}, questions, openAuthPopup, isLoggedIn} = this.props;
        return all.map((user, i) => {
            let sameUser = this.ifSameUser(user['UserRelationship']);
            return <QuizSummaryParticipantItem
                key={"participant-" + i}
                userInfo={user}
                questions={questions}
                sameUser={sameUser}
                openAuthPopup={openAuthPopup}
                isLoggedIn={isLoggedIn}
            />;
        });
    }

    getWinners() {
        const {participants: {winners}, questions, openAuthPopup, isLoggedIn} = this.props;
        return winners.map((user, i) => {
            let sameUser = this.ifSameUser(user['UserRelationship']);
            const winnerClass = i < 3 ? ' winner' : '';
            return <QuizSummaryParticipantItem
                key={"participant-" + i}
                userInfo={user}
                questions={questions}
                winnerClass={winnerClass}
                sameUser={sameUser}
                openAuthPopup={openAuthPopup}
                isLoggedIn={isLoggedIn}
            />;
        });
    }

    getLosers() {
        const {participants: {losers}, questions, openAuthPopup, isLoggedIn} = this.props;

        return losers.map((user, i) => {
            let sameUser = this.ifSameUser(user['UserRelationship']);
            return <QuizSummaryParticipantItem
                key={"participant-" + i}
                userInfo={user}
                questions={questions}
                sameUser={sameUser}
                openAuthPopup={openAuthPopup}
                isLoggedIn={isLoggedIn}
            />;
        });
    }

    showAll() {
        this.setState({participants: 'all'});
    }

    showWinners() {
        this.setState({participants: 'winners'});
    }

    showLosers() {
        this.setState({participants: 'losers'});
    }


    render() {
        const {isEnded, participants: allParticipants} = this.props;
        const activeTab = this.state.participants;
        const fetchingState = this.state.fetchingState;
        let participants = null;
        let tabs = '';

        switch (activeTab) {
            case 'winners':
                participants = this.getWinners();
                break;
            case 'losers':
                participants = this.getLosers();
                break;
            default:
                participants = this.getAll();
        }

        if (!fetchingState) {
            tabs = (
                <QuizSummaryParticipantsTabs
                    isEnded={ isEnded }
                    showWinners={ this.showWinners.bind(this) }
                    showLosers={ this.showLosers.bind(this) }
                    activeTab={ activeTab }
                    allParticipants={ allParticipants }
                />
            );
        }

        return (
            <div className="participants-section" id="participants">

                { tabs }

                <div className="participants-list-holder">
                    <ul className="participants-list">
                        { participants }
                    </ul>
                </div>
            </div>
        );
    }
}

export default QuizSummaryParticipants;
