import React, {Component, PropTypes} from 'react';
import moment from 'moment';

class QuizSummaryMatchTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liveTime: <div>loading...</div>,
            upcomingTime: <div>loading...</div>,
            interval: null
        };
        this.state.interval = window.setInterval(() => {
            this.updateLiveMatchTime();
            this.updateUpcomingMatch();
        }, 1000);
    }

    componentWillUnmount(){
        if (this.state.interval) window.clearInterval(this.state.interval);
    }

    updateLiveMatchTime(){
        const {startDate} = this.props;
        const nowU = moment(moment.now()).unix();
        const startDateU = moment(startDate).unix();

        const secondsPast = Math.abs(startDateU - nowU);
        let mins = Math.floor(secondsPast / 60);
        let secs = secondsPast % 60;
        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;

        this.setState({
            ...this.state,
            liveTime: (
                <div className="live-match">{mins}:{secs}</div>
            )
        });
    }

    updateUpcomingMatch(){
        const {startDate} = this.props;

        const nowU = moment(moment.now()).unix();
        const startDateU = moment(startDate).unix();

        const secondsPast = Math.abs(startDateU - nowU);
        let days = Math.floor(secondsPast / 3600 / 24);
        let daysInSecs = (secondsPast - days * 3600 * 24);
        let hours = Math.floor(daysInSecs / 3600);
        let hoursInSecs = daysInSecs - hours * 3600;
        let mins = Math.floor(hoursInSecs / 60);

        days = days < 10 ? '0' + days : days;
        hours = hours < 10 ? '0' + hours : hours;
        mins = mins < 10 ? '0' + mins : mins;

        this.setState({
            ...this.state,
            upcomingTime: (
                <div className="upcoming-match">{days}d {hours}h {mins}m</div>
            )
        });
    }

    render() {
        const {startDate, isEnded} = this.props;
        const nowU = moment(moment.now()).unix();
        const startDateU = moment(startDate).unix();

        if (!isEnded) {
            if (startDateU - nowU <= 0) {
                // Live match
                return this.state.liveTime;
            } else {
                // Upcoming match
                return this.state.upcomingTime;
            }
        }

        return <div>&nbsp;</div>
    }
}

export default QuizSummaryMatchTime;
