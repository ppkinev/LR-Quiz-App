import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchRewardsNotLoggedIn, postSignup, authWithFacebook} from '../../flux/actions';
import Button from '../Button';
import {SeparatorOrError, TextInput, EmailInput, PasswordInput} from './Controls.js';
import autofill from 'react-autofill';


@autofill
class FormSignIn extends Component {
    static propTypes = {
        onNavigate: PropTypes.func.isRequired,
        // from store
        error: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        postSignup: PropTypes.func.isRequired,
        authWithFacebook: PropTypes.func.isRequired,
        fetchRewardsNotLoggedIn: PropTypes.func.isRequired,
        rewards: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const {fetchRewardsNotLoggedIn} = this.props;
        fetchRewardsNotLoggedIn();
    }

    handleSubmit() {
        const nameEl = this.refs['name-input'];
        if (!nameEl.validate()) {
            nameEl.focus();
            return;
        }
        const emailEl = this.refs['email-input'];
        if (!emailEl.validate()) {
            emailEl.focus();
            return;
        }
        const pwdEl = this.refs['pwd-input'];
        if (!pwdEl.validate()) {
            pwdEl.focus();
            return;
        }

        const data = {
            name: nameEl.value(),
            email: emailEl.value(),
            password: pwdEl.value(),
        };
        this.props.postSignup(data);
    }

    render() {
        const {onNavigate, error, authWithFacebook, rewards} = this.props;
        const toSignup = () => onNavigate('login');
        const onSubmit = () => this.handleSubmit();
        const {
            facebookConnect: {rewardPoints: facebookSignupPoints = 0} = {}
        } = rewards;

        return (
            <div className="auth-popup signup">
                <div className="auth-icon">
                    <img src={ require('../../static/images/icon-ball-lg.png') }/>
                </div>

                <div className="big-btn facebook-btn" onClick={ authWithFacebook }>SignUp with Facebook</div>
                <div className="auth-p">
                    <div className="auth-text">
                        and get <span className="text-brand">{ `+${facebookSignupPoints} points` }</span>
                    </div>
                </div>

                <SeparatorOrError error={error}/>

                <form className="auth-form">
                    <TextInput ref="name-input" required={true} name="name" label="Full Name"/>
                    <EmailInput ref="email-input" required={true}/>
                    <PasswordInput ref="pwd-input" required={true}/>

                    <Button className="footer-btn big-btn share-btn" onClick={ onSubmit }>SignUp with Email</Button>
                </form>

                <div className="auth-footer">
                    <div className="link-small text-brand" onClick={ toSignup }>
                        Already have an account? LogIn
                    </div>
                </div>
            </div>
        );
    }
}


// Connect to store
//
const mapStateToProps = (state) => {
    const {isFetching, errors} = state.auth;
    return {
        error: errors.signup || '',
        isFetching: isFetching.signup || false,
        rewards: state.rewards.map
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchRewardsNotLoggedIn: () => dispatch(fetchRewardsNotLoggedIn()),
        postSignup: (data) => dispatch(postSignup(data)),
        authWithFacebook: () => dispatch(authWithFacebook()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormSignIn);
