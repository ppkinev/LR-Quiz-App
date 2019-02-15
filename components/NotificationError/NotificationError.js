import React, {Component, PropTypes} from 'react';

import './NotificationError.scss';

export default class NotificationError extends Component {
    constructor(props) {
        super(props);

        const {reset} = this.props;

        this.state = {
            hidden: ''
        };

        window.setTimeout(() => {
            this.setState({
                hidden: ' hidden'
            });
            window.setTimeout(() => {
                if (reset) reset();
            }, 300);
        }, 4000);
    }

    render() {
        const {text} = this.props;

        return (
            <div className={"bottom-notification-error" + this.state.hidden}>
                <h5 className="notification-error-text">{text}</h5>
            </div>
        );
    }
}

NotificationError.propTypes = {
    text: PropTypes.string.isRequired,
    reset: PropTypes.func
};
