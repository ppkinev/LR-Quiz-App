import React, {Component, PropTypes} from 'react';

var validator = require('validator');


export default class MainBlock extends Component {

    static propTypes = {
        invite: PropTypes.func.isRequired,
        inviteSocialFriends: PropTypes.func.isRequired,
        inviteTwitter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            email: true
        }
    }

    wrongEmail() {
        let elem = document.getElementsByClassName('friendEmail')[0];
        let self = this;
        this.setState({email: false});
        elem.classList.add('error-input');
        elem.value = '';
        setTimeout(function () {
            elem.classList.remove('error-input');
            self.setState({email: true});
        }, 1500);
    }

    render() {

        const {invite, inviteSocialFriends, inviteTwitter} = this.props;
        let check = '';

        const emailClick = () => {
            if (validator.isEmail(check)) invite(check);
            else this.wrongEmail();
        };

        const onEmailChange = (e) => {
            check = e.target.value
        };

        const statusBlock = !this.state.email ? <div className="statusBlock statusNegative">Wrong email. Please try again!</div> : null;

        return (
            <div className="invite-main-block">
                <div onClick={inviteSocialFriends} className="facebook">
                    <div className='holder'>
                        <img src={require('./images/facebook-logo.png')}/>
                        <span>Invite with Facebook</span>
                    </div>
                </div>
                <div onClick={inviteTwitter} className="twitter">
                    <div className='holder'>
                        <img src={require('./images/twitter-logo.png')}/>
                        <span>Invite with Twitter</span>
                    </div>
                </div>
                <div className="via">or via Email</div>
                <div className="emailHold">
                    <input className="friendEmail" onChange={onEmailChange} type="text" placeholder="Enter friend's email"/>
                    {statusBlock}
                </div>

                <div onClick={emailClick} className="email">Send invite via Email</div>
            </div>
        )
    }
};
