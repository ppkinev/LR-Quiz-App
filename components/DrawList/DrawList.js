import React, {Component, PropTypes} from 'react';
import DrawListItem from './DrawListItem.js';
import moment from 'moment';
import './DrawList.scss';

import Notification from '../LeaderBoardNotification/LeaderBoardNotification';

function additionalStatus(status) {
    let elem = document.getElementById('drawHolder');
    let content = document.getElementsByClassName('content')[0]
    if (status) {
        content.style.cssText = 'position: relative'
        elem.style.cssText = 'margin-top : 110px'
    } else {
        content.style.cssText = 'position: inherit'
        elem.style.cssText = 'margin-top : 0px'
    }
}

function drawisEnded(str) {
    const formatted = moment(str).fromNow();
    return formatted.indexOf('ago') > -1;
}

class DrawList extends Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
    };

    getDrawsList(list, key) {
        return list.map((data, i) => {
            return (
                <DrawListItem key={'draw-' + key + i} data={data} />
            );
        });
    }

    render() {
        const {list} = this.props;

        const upcomingDraws = list.filter((draw) => !draw.isDrawn && !drawisEnded(draw.endDate));
        const completedDraws = list.filter((draw) => (draw.isDrawn || drawisEnded(draw.endDate)) && !draw.needToClaim);
        const notClaimedDraws = list.filter((draw) => (draw.isDrawn || drawisEnded(draw.endDate)) && draw.needToClaim);

        const upcomingDrawsItems = this.getDrawsList(upcomingDraws, 'upcoming');
        const completedDrawsItems = this.getDrawsList(completedDraws, 'completed');
        const notClaimedDrawsItems = this.getDrawsList(notClaimedDraws, 'not-claimed');

        const upcomingDrawsSection = upcomingDraws.length > 0 &&
            (<div className="draws-section">
                <div className="draws-section-header">
                    <h5>Upcoming draws</h5>
                </div>
                <ul className="draw-list">
                    { upcomingDrawsItems }
                </ul>
            </div>);
        const completedDrawsSection = completedDraws.length > 0 &&
            (<div className="draws-section">
                <div className="draws-section-header">
                    <h5>Completed draws</h5>
                </div>
                <ul className="draw-list">
                    { completedDrawsItems }
                </ul>
            </div>);
        const notClaimedDrawsSection = notClaimedDraws.length > 0 &&
            (<div className="draws-section">
                <div className="draws-section-header">
                    <h5>Claim your prize</h5>
                </div>
                <ul className="draw-list">
                    { notClaimedDrawsItems }
                </ul>
            </div>);


        return (
            <div id='drawHolder'>
                <Notification type='leaderboard'/>
                <Notification type='top3'/>

                { notClaimedDrawsSection }

                { upcomingDrawsSection }

                { completedDrawsSection }

            </div>

        );
    }

}

export default DrawList;
