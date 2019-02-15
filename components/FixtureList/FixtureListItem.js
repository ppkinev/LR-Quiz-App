import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import Location from '../../lib/Location.js';
import FixturesTime from './FixturesTime.js';
import './FixtureList.scss';

class FixtureListItem extends Component {

    static propTypes = {
        header: PropTypes.string,
        fixtureItem: PropTypes.object.isRequired,
    };

    getItemClass({isOpenForBetting, isWinner, isEnded}) {
        if (isWinner) {
            return 'has-finished is-winner';
        } else if (isEnded) {
            return 'has-finished';
        }
        return '';
    }

    getFriendsParticipated(friends, index) {
        let images = [];
        for (let i = 0; i < friends.length; i++) {
            images.push(friends[i]['ImageUrl']);
            if (i === 2) break;
        }
        return (
            <div className="fixture-item-friends-holder">
                {
                    images.map(function (image, ind) {
                        return <div className="fixture-friend-holder">
                            <img src={ image } key={ index + ind }
                                 className="fixture-friends-image"/>
                        </div>
                    })
                }
            </div>
        );
    }

    getWinLabel(answers) {
        const {creditsWonAmount, pointsWonAmount} = this.props;
        const answersCount = answers.length;
        let correct = 0;
        answers.forEach((a) => {
            if (a.isCorrect) correct++;
        });
        if (creditsWonAmount) return `You won £${creditsWonAmount}`;
        if (pointsWonAmount) return `You won ${pointsWonAmount} points`;
        if (correct === answersCount) return 'Score: 3/3';
        return `Correct: ${correct}/${answersCount}`;
    }

    getLabel() {
        const {answers, isOpenForBetting, isEnded, isLoggedIn, bets} = this.props.fixtureItem;
        const betsItem = bets && bets.length && bets[bets.length - 1];

        if (!isEnded) {
            if (isOpenForBetting) {
                if (betsItem && (betsItem.betAmount || betsItem.creditsBetAmount || betsItem.pointsBetAmount)) {
                    return <div className="list-label winner">Increase bet</div>;
                }
                if (answers && answers.length) {
                    return <div className="list-label winner">Place bet</div>;
                }
            } else {
                return <div className="list-label winner">In progress</div>;
            }

            return <div className="list-label green">Predict</div>;
        } else {
            if (answers && answers.length) {
                return (
                    <div className="list-label winner">
                        { this.getWinLabel(answers) }
                    </div>
                );
            }
            return (
                <div className="list-label winner">{ isLoggedIn ? 'Not played' : 'Finished' }</div>
            );
        }
    }

    openMatchWithParticipants() {
        const {showParticipants, fixtureItem: {matchId}} = this.props;
        showParticipants(matchId);
        Location.push({pathname: './quiz', query: {matchId}});
    }

    openMatch(){
        const {showParticipantsReset, fixtureItem: {matchId}} = this.props;
        showParticipantsReset(matchId);
        Location.push({pathname: './quiz', query: {matchId}});
    }

    render() {
        const {fixtureItem, header, isLoggedIn, index} = this.props;
        const {
            matchId, teamHome, teamAway,
            startDate, isOpenForBetting,
            isEnded, recentPlayers, totalPlayersCount,
            wonAmount
        } = fixtureItem;
        const itemClass = this.getItemClass(fixtureItem);
        const headerClass = !header ? 'is-collapsed' : '';
        const title = (<div>{ teamHome.Name.split(/(?=[A-Z])/).join(" ") } <span
            className="thin-grey">vs</span> { teamAway.Name.split(/(?=[A-Z])/).join(" ") }</div>);
        const timeStr = moment(startDate).format('HH:mm');
        const isPending = !isOpenForBetting && !isEnded;
        const teamHomeIcon = teamHome.ImageUrl;
        const teamAwayIcon = teamAway.ImageUrl;

        const label = this.getLabel();

        let subTitle = timeStr;
        if (isPending) {
            subTitle += ' - in progress';
        } else if (isEnded) {
            subTitle = `Finished ${ moment(startDate).fromNow() }`;
        }

        const ending = totalPlayersCount === 1 ? '' : 's';
        const participants = `${totalPlayersCount} ${isLoggedIn ? 'friend' + ending : 'user' + ending}`;
        const participantsImages = this.getFriendsParticipated(recentPlayers, index);

        return (
            <li className="fixture-item">
                <div className={ "fixture-item-header " + headerClass }>
                    <h5>{ header }</h5>
                </div>

                <div className="fixture-item-body">
                    <div className={ "fixture-item-match " + itemClass } onClick={this.openMatch.bind(this)}>
                        <div className="fixture-item-icons-holder">
                            <FixturesTime
                                startDate={ startDate }
                                isEnded={ isEnded }
                            />
                            <div className="fixture-item-team-icons">
                                <div className="fixture-item-team">
                                    <img src={ teamHomeIcon }/>
                                </div>
                                <div className="fixture-item-team fixture-item-team-overlap">
                                    <img src={ teamAwayIcon }/>
                                </div>
                            </div>
                        </div>
                        <div className="fixture-item-content">
                            <h3 className="list-title">{ title }</h3>
                            {/*<h5 className="list-meta">{ subTitle }</h5>*/}
                            <div className="list-label-cont">
                                { label }
                            </div>
                        </div>
                    </div>

                    <div className="fixture-item-friends" onClick={this.openMatchWithParticipants.bind(this)}>
                        <h5 className="list-meta">{ participants }</h5>
                        { participantsImages }

                        <div className="list-label-cont">
                            <div className="list-label friends">View</div>
                        </div>
                    </div>

                </div>
            </li>
        );
    }

}

export default FixtureListItem;
