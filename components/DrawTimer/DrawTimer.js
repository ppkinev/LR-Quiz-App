import React, {Component, PropTypes} from 'react';
import moment from 'moment';
class DrawTimer extends Component {
    state = {
        time: null
    };

    componentWillMount() {
        this.setState({
            interval: window.setInterval(() => {
                this.updateTime();
            }, 1000)
        });
    }

    componentWillUnmount() {
        if (this.state.interval) window.clearInterval(this.state.interval);
    }

    updateTime() {

        const fixN = function(num){
            return num > 9 ? num : '0' + num;
        };

        const {endDate} = this.props;

        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;
        const _day = _hour * 24;

        const distance = (new Date(endDate)) - new Date();

        const days = Math.floor(distance / _day);
        const hours = Math.floor((distance % _day) / _hour);
        const minutes = Math.floor((distance % _hour) / _minute);
        const seconds = Math.floor((distance % _minute) / _second);

        if (distance < 0) {
            const formatted = moment(endDate).fromNow();
            const ended = formatted.indexOf('ago') > -1;
            const prefix = ended ? 'ended' : 'ends';

            this.setState({
                time: `${prefix} ${formatted}`
            });
        } else {
            this.setState({
                time: `${fixN(days)}d ${fixN(hours)}h ${fixN(minutes)}m ${fixN(seconds)}s`
            });
        }
    }

    render() {
        return (
            <div className="draw-countdown">{ this.state.time }</div>
        );
    }
}

DrawTimer.propTypes = {
    startDate: PropTypes.string.isRequired,
    isEnded: PropTypes.bool
};

export default DrawTimer;
