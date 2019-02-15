import React, {Component, PropTypes} from 'react';
import Button from '../Button';
import Link from '../Link';

import './BetNoCreditsOffer.scss';

class BetNoCreditsOffer extends Component {

    getFriendsParticipated(friends = [], index) {
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

    render() {
        const {isLoggedIn, teamHome, teamAway, recentPlayers, totalPlayersCount, friends} = this.props;

        const ending = totalPlayersCount === 1 ? '' : 's';
        const participants = `${totalPlayersCount} ${isLoggedIn ? 'friend' + ending : 'user' + ending}`;
        const participantsImages = this.getFriendsParticipated(recentPlayers, 'accumulated');

        const participantsText = (friends && friends.length > 0) ? `${ participants } participated` : '';

        return (
            <div className="bet-panel-holder no-credits-offer">
                <div className="bet-panel">
                    <div className="bet-panel-header">
                        <h3 className="bet-panel-header-title">Free bet</h3>
                    </div>

                    <div className="bet-panel-body">
                        <div className="teams-holder">
                            <img className="panel-team-icon" src={teamHome['ImageUrl']}/>
                            <span>vs</span>
                            <img className="panel-team-icon" src={teamAway['ImageUrl']}/>
                        </div>

                        <div className="panel-text">
                            <div className="panel-bold">Download</div> some free apps, get £5 free bet and win <div className="panel-bold">£600</div> with the accumulated bet for {teamHome['Name']} vs {teamAway['Name']} game.
                        </div>


                        <Link className="panel-bet-button" to="./offerwall">
                            Take me to the offerwall
                        </Link>

                        <Link className="back-btn" to="./bet-exit">No, thanks</Link>
                    </div>

                    <div className="bet-panel-footer">
                        <div className="bet-panel-footer-participants">
                            { participantsImages }
                            <p className="participants-text">{ participantsText }</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BetNoCreditsOffer;
