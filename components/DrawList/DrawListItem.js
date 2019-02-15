import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import DrawTimer from '../DrawTimer';
import RecentPlayers from  '../RecentPlayers/RecentPlayers';
import './DrawList.scss';

const STATE_UNFINISHED = 'STATE_UNFINISHED';
const STATE_UNFINISHED_HAS_BET = 'STATE_UNFINISHED_HAS_BET';
const STATE_FINISHED_WAITING_WINNER = 'STATE_FINISHED_WAITING_WINNER';
const STATE_FINISHED_NO_WINNER = 'STATE_FINISHED_NO_WINNER';
const STATE_FINISHED_HAS_WINNER = 'STATE_FINISHED_HAS_WINNER';
const STATE_FINISHED_HAS_WINNER_USER = 'STATE_FINISHED_HAS_WINNER_USER';


function dateFormat(str) {
    const formatted = moment(str).fromNow();
    const ended = formatted.indexOf('ago') > -1;
    const prefix = ended ? 'ended' : 'ends';
    return `${prefix} ${formatted}`;
}

class DrawListItem extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
    };

    getItemState(isFinished) {
        const {isDrawn, winner, betAmount, isWinner} = this.props.data;

        if (!isFinished) {
            if (betAmount) {
                return STATE_UNFINISHED_HAS_BET;
            } else {
                return STATE_UNFINISHED;
            }
        }
        else {
            if (!isDrawn) {
                return STATE_FINISHED_WAITING_WINNER;
            } else if (!winner) {
                return STATE_FINISHED_NO_WINNER;
            } else if (isWinner) {
                return STATE_FINISHED_HAS_WINNER_USER;
            } else {
                return STATE_FINISHED_HAS_WINNER;
            }
        }
    }

    getItemClass(itemState) {
        switch (itemState) {
            case STATE_UNFINISHED_HAS_BET:
                return 'has-bet';
            case STATE_FINISHED_NO_WINNER:
            case STATE_FINISHED_HAS_WINNER:
                return 'has-finished';
            case STATE_FINISHED_WAITING_WINNER:
                return 'has-finished waiting-winner';
            case STATE_FINISHED_HAS_WINNER_USER:
                return 'has-finished is-winner';
            case STATE_UNFINISHED:
            default:
                return '';
        }
    }

    render() {
        const {drawId, endDate, prizeTitle, prizeImageUrl, betAmount, winner, isWinner, needToClaim, isDrawn, totalPlayers: total, recentPlayers: recent} = this.props.data;
        const checkingDate = dateFormat(endDate);
        const subTitle = <DrawTimer endDate={endDate}/>;
        const drawIsFinished = checkingDate.indexOf('ended') >= 0;
        const itemState = this.getItemState(drawIsFinished);
        const itemClasses = this.getItemClass(itemState);
        const betLabelText = `You placed ${betAmount} point${betAmount > 1 ? 's' : ''}`;
        const userWinnerImg = require('../../static/images/user-winner.png');

        const recentPlayers = <RecentPlayers recent={recent} total={total} type={'player'} ending={'participated'} />;

        let winnerImg = '';
        if (winner) {
            winnerImg = (
                <div className={"draw-item-winner-image" + (needToClaim ? ' claim' : '')}>
                    <img src={ (isWinner && needToClaim) ? userWinnerImg : winner.ImageUrl }/>
                </div>
            );
        }
        let betLabel = '';
        if (betAmount) {
            betLabel = (
                <div className="list-label winner">{ betLabelText }</div>
            )
        }

        if (!isDrawn && !betAmount && !drawIsFinished) {
            betLabel = (
                <div className="list-label green">Enter the draw</div>
            )
        }

        let wonLabel = '';
        if (isWinner) {
            betLabel = '';
            wonLabel = (
                <div className="list-label winner">You won!</div>
            );
        }

        return (
            <li className="draw-item">
                <Link className={"draw-item-body " + itemClasses} to="./draw" query={ {drawId} }>
                    <div className="draw-item-aside">
                        <div className="draw-item-image-holder">
                            <div className="draw-item-image">
                                <img src={ prizeImageUrl }/>
                            </div>
                            { winnerImg }
                        </div>
                    </div>
                    <div className="draw-item-content">
                        <h3 className="list-title">{ prizeTitle }</h3>
                        <h5 className="list-meta">{ subTitle }</h5>
                        { recentPlayers }
                        { betLabel }
                        { wonLabel }
                    </div>
                    <div className="list-item-arrow">
                        <img src={ require('../../static/images/arrow-right-grey.png') }/>
                    </div>
                </Link>
            </li>
        );
    }

}

export default DrawListItem;
