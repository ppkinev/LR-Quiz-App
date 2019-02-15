import React, {Component, PropTypes} from 'react';
import moment from 'moment';

class FixturesTime extends Component {
    constructor(props) {
        super(props);

        this.state = {beginTime: 0};

        this.interval = window.setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
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
            beginTime: (
                <div className="live-match">{mins}:{secs}</div>
            )
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }

    render() {
        const {startDate, isEnded} = this.props;
        const nowU = moment(moment.now()).unix();
        const startDateU = moment(startDate).unix();
        let beginTime = moment(startDate).format('HH:mm');

        if (isEnded) {
            beginTime = 'Match ended';
        } else if (startDateU - nowU <= 0) {
            // Live match
            beginTime = this.state.beginTime;
        }

        return (
            <div className="fixture-items-time">
                {beginTime}
            </div>
        );
    }
}

FixturesTime.propTypes = {
    startDate: PropTypes.string.isRequired,
    isEnded: PropTypes.bool
};

export default FixturesTime;
